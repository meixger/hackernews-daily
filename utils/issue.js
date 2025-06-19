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

export const getIssues = async ({ owner, repo, take }) => {
  const octokit = new Octokit({
    authStrategy: createActionAuth
  });
  const res = await octokit.request('GET /repos/{owner}/{repo}/issues', {
    owner,
    repo,
    per_page: take
  });
  const issues = res.data;
  return issues
}

export const lockIssue = async ({owner, repo, issueNumber}) => {
  const octokit = new Octokit({
    authStrategy: createActionAuth
  });
  await octokit.request('PUT /repos/{owner}/{repo}/issues/{issue_number}/lock', {
    owner: owner,
    repo: repo,
    issue_number: issueNumber,
    lock_reason: 'resolved'
  });
}
