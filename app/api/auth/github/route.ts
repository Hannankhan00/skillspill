import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const sharePrivate = searchParams.get('private') === 'true';
    const action = searchParams.get('action') || 'login';

    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        return NextResponse.json({ error: "GitHub OAuth not configured" }, { status: 500 });
    }

    // Determine scopes
    let scope = "read:user user:email";
    if (sharePrivate) {
        scope += " repo";
    }

    const stateObj = {
        action,
        sharePrivate
    };
    const state = Buffer.from(JSON.stringify(stateObj)).toString('base64');

    const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
    githubAuthUrl.searchParams.append("client_id", clientId);
    githubAuthUrl.searchParams.append("redirect_uri", redirectUri);
    githubAuthUrl.searchParams.append("scope", scope);
    githubAuthUrl.searchParams.append("state", state);

    return NextResponse.redirect(githubAuthUrl.toString());
}
