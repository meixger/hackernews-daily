import { callWithRetry } from "./retry.js";
import { buildOctokit } from "./octokitBuilder.js";

export const openIssue = async ({ owner, repo, title, body }) => {
  const octokit = await buildOctokit();
  const res =  await callWithRetry(() => {
    console.log('opening issue');
    return octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner,
      repo,
      title,
      body,
    });
  });
  console.log('opened');
  return res;
}

export const getIssues = async ({ owner, repo, take }) => {
  const octokit = await buildOctokit();
  const res =  await callWithRetry(() => {
    return octokit.request('GET /repos/{owner}/{repo}/issues', {
      owner,
      repo,
      per_page: take
    });
  });
  const issues = res.data;
  return issues
}

export const lockIssue = async ({owner, repo, issueNumber}) => {
  const octokit = await buildOctokit();
  await callWithRetry(() => {
    return octokit.request('PUT /repos/{owner}/{repo}/issues/{issue_number}/lock', {
      owner: owner,
      repo: repo,
      issue_number: issueNumber,
      lock_reason: 'resolved'
    });
  });
}
