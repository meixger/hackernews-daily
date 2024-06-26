import { Octokit } from "@octokit/core";
import { createActionAuth } from "@octokit/auth-action";

export const openIssue = async ({ owner, repo, title, body }) => {
  const octokit = new Octokit({
    authStrategy: createActionAuth
  });
  try {
    console.log('opening issue');
    const res = await octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner,
      repo,
      title,
      body,
    });
    console.log('opened');
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const GetIssues = async ({ owner, repo }) => {
  const octokit = new Octokit();
  console.log('getting issue');
  const res = await octokit.request('GET /repos/{owner}/{repo}/issues', {
    owner,
    repo,
    per_page: 1
  });
  console.log('got issue', res);
}

// const lock = async ({owner, repo, issueNumber}) => {
//   console.log('locking issue');
//   await octokit.request('PUT /repos/{owner}/{repo}/issues/{issue_number}/lock', {
//     owner: owner,
//     repo: repo,
//     issue_number: issueNumber,
//     lock_reason: 'resolved'
//   });
//   console.log('locked');
// }

// lock({
//   owner: 'headllines',
//   repo: 'hackernews-daily',
//   issueNumber: 39,
// });