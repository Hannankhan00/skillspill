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
            return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(tokenData.error_description || 'GitHub authentication failed')}`, req.url));
        }

        const accessToken = tokenData.access_token;

        // Get user profile from GitHub
        const userRes = await fetch("https://api.github.com/user", {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "SkillSpill-App"
            }
        });
        const githubUser = await userRes.json();

        // ──────────────────────────────────────────────
        //   ACTION: CONNECT (popup flow from settings)
        // ──────────────────────────────────────────────
        if (action === 'connect') {
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
        }

        // ──────────────────────────────────────────────
        //   ACTION: LOGIN (Continue with GitHub)
        // ──────────────────────────────────────────────

        // Resolve GitHub email (needed for matching existing accounts)
        let githubEmail = githubUser.email;
        if (!githubEmail) {
            try {
                const emailsRes = await fetch("https://api.github.com/user/emails", {
                    headers: { "Authorization": `Bearer ${accessToken}`, "Accept": "application/vnd.github.v3+json", "User-Agent": "SkillSpill-App" }
                });
                const emails = await emailsRes.json();
                const primary = emails.find((e: any) => e.primary) || emails[0];
                if (primary) githubEmail = primary.email;
            } catch { /* continue without email */ }
        }

        // STEP 1: Try to find existing user by their GitHub ID (fastest, most reliable)
        let user = await prisma.user.findUnique({
            where: { githubId: githubUser.id.toString() }
        });

        if (user) {
            // ── User found by GitHub ID → just log them in ──
            if (user.role !== 'TALENT') {
                return NextResponse.redirect(new URL("/login?error=GitHub sign-in is only available for Talent accounts", req.url));
            }

            // Refresh their access token silently
            await prisma.talentProfile.updateMany({
                where: { userId: user.id },
                data: { githubAccessToken: accessToken, githubUsername: githubUser.login, githubConnected: true }
            });

            await createSession(user.id, user.role);
            await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

            return NextResponse.redirect(new URL("/talent", req.url));
        }

        // STEP 2: No match by GitHub ID → try matching by email
        if (githubEmail) {
            user = await prisma.user.findUnique({ where: { email: githubEmail } });

            if (user) {
                // Found existing account by email → link GitHub ID and log in
                if (user.role !== 'TALENT') {
                    return NextResponse.redirect(new URL("/login?error=GitHub sign-in is only available for Talent accounts", req.url));
                }

                // Link GitHub ID to this existing account so next login is instant
                await prisma.user.update({
                    where: { id: user.id },
                    data: { githubId: githubUser.id.toString() }
                });

                // Update talent profile with GitHub data
                await prisma.talentProfile.updateMany({
                    where: { userId: user.id },
                    data: {
                        githubAccessToken: accessToken,
                        sharePrivateRepos: sharePrivate,
                        githubUsername: githubUser.login,
                        githubConnected: true,
                        githubRepos: githubUser.public_repos,
                    }
                });

                await createSession(user.id, user.role);
                await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

                return NextResponse.redirect(new URL("/talent", req.url));
            }
        }

        // STEP 3: Completely new user → create account
        if (!githubEmail) {
            return NextResponse.redirect(new URL("/login?error=Could not retrieve email from GitHub. Please ensure your GitHub email is public or verified.", req.url));
        }

        // Check if username already taken and generate a unique one
        let username = githubUser.login;
        const existingUsername = await prisma.user.findFirst({ where: { username } });
        if (existingUsername) {
            username = `${githubUser.login}${Math.floor(Math.random() * 10000)}`;
        }

        user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: githubEmail,
                    username,
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

        await createSession(user.id, user.role);
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

        return NextResponse.redirect(new URL("/talent", req.url));

    } catch (e: any) {
        console.error("Github Auth Error:", e);
        if (action === 'connect') {
            return new NextResponse(`<script>window.opener.postMessage({ type: 'github_callback', error: 'Server error' }, '*'); window.close();</script>`, { headers: { "Content-Type": "text/html" } });
        }
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(e.message || 'Authentication failed')}`, req.url));
    }
}
