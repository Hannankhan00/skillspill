import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
        return NextResponse.redirect(new URL("/login?error=GitHub OAuth code missing", req.url));
    }

    let stateObj = { action: 'login', sharePrivate: false };
    if (state) {
        try {
            stateObj = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));
        } catch (e) {
            console.error("Failed to parse state", e);
        }
    }

    const { action, sharePrivate } = stateObj;
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = process.env.GITHUB_REDIRECT_URI;

    try {
        // Exchange code for access token
        const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri
            })
        });

        const tokenData = await tokenRes.json();

        if (tokenData.error) {
            if (action === 'connect') {
                return new NextResponse(`<script>window.opener.postMessage({ type: 'github_callback', error: '${tokenData.error_description}' }, '*'); window.close();</script>`, { headers: { "Content-Type": "text/html" } });
            }
            return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(tokenData.error_description)}`, req.url));
        }

        const accessToken = tokenData.access_token;

        // Get user profile
        const userRes = await fetch("https://api.github.com/user", {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "SkillSpill-App"
            }
        });
        const githubUser = await userRes.json();

        if (action === 'connect') {
            // Popup flow for signup
            const popupScript = `
                <script>
                    window.opener.postMessage({
                        type: 'github_callback',
                        data: {
                            githubUsername: "${githubUser.login}",
                            githubAccessToken: "${accessToken}",
                            githubRepos: ${githubUser.public_repos},
                            githubId: "${githubUser.id}",
                            sharePrivateRepos: ${sharePrivate}
                        }
                    }, '*');
                    window.close();
                </script>
            `;
            return new NextResponse(popupScript, { headers: { "Content-Type": "text/html" } });
        } else {
            // Direct login flow
            // Find existing user by githubId or email
            let user = await prisma.user.findFirst({
                where: { OR: [{ githubId: githubUser.id.toString() }] }
            });

            if (!user) {
                // Check if email match
                // We might need to fetch emails if githubUser.email is null
                let email = githubUser.email;
                if (!email) {
                    const emailsRes = await fetch("https://api.github.com/user/emails", {
                        headers: { "Authorization": `Bearer ${accessToken}`, "Accept": "application/vnd.github.v3+json", "User-Agent": "SkillSpill-App" }
                    });
                    const emails = await emailsRes.json();
                    const primary = emails.find((e: any) => e.primary) || emails[0];
                    if (primary) email = primary.email;
                }

                if (email) {
                    user = await prisma.user.findUnique({ where: { email } });
                    if (user) {
                        // Link github
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { githubId: githubUser.id.toString() }
                        });

                        // Also update talent profile access token if it's a talent
                        if (user.role === 'TALENT') {
                            await prisma.talentProfile.updateMany({
                                where: { userId: user.id },
                                data: { githubAccessToken: accessToken, sharePrivateRepos: sharePrivate, githubUsername: githubUser.login, githubConnected: true }
                            });
                        }
                    }
                }

                // If completely new, register them!
                if (!user) {
                    if (!email) {
                        return NextResponse.redirect(new URL("/login?error=GitHub email required", req.url));
                    }
                    // create new talent profile
                    const randomSuffix = Math.floor(Math.random() * 10000);
                    user = await prisma.$transaction(async (tx) => {
                        const newUser = await tx.user.create({
                            data: {
                                email,
                                username: githubUser.login + randomSuffix,
                                githubId: githubUser.id.toString(),
                                passwordHash: "OAUTH",
                                fullName: githubUser.name || githubUser.login,
                                role: "TALENT"
                            }
                        });

                        await tx.talentProfile.create({
                            data: {
                                userId: newUser.id,
                                githubUsername: githubUser.login,
                                githubConnected: true,
                                githubRepos: githubUser.public_repos,
                                githubAccessToken: accessToken,
                                sharePrivateRepos: sharePrivate
                            }
                        });

                        return newUser;
                    });
                }
            } else {
                // Update their access token and login details just in case
                if (user.role === 'TALENT') {
                    await prisma.talentProfile.updateMany({
                        where: { userId: user.id },
                        data: { githubAccessToken: accessToken, sharePrivateRepos: sharePrivate, githubUsername: githubUser.login, githubConnected: true }
                    });
                }
            }

            // Create session and login
            await createSession(user.id, user.role);

            // Update login time
            await prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() }
            });

            return NextResponse.redirect(new URL(user.role === "TALENT" ? "/talent" : "/dashboard", req.url));
        }

    } catch (e: any) {
        console.error("Github Auth Error:", e);
        if (action === 'connect') {
            return new NextResponse(`<script>window.opener.postMessage({ type: 'github_callback', error: 'Server error' }, '*'); window.close();</script>`, { headers: { "Content-Type": "text/html" } });
        }
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(e.message)}`, req.url));
    }
}
