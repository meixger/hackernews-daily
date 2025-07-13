import { createActionAuth } from "@octokit/auth-action";
import { createTokenAuth } from "@octokit/auth-token";
import { Octokit } from "@octokit/core";

export const buildOctokit = async () => {

    let options = {};
    var ghp = process.env.ghp;
    if (ghp) {
        const auth = createTokenAuth(ghp);
        const authentication = await auth();
        options.auth = authentication.token;
    } else {
        options.authStrategy = createActionAuth;
    }
    return new Octokit(options);
}