import * as core from '@actions/core';
import { getHeadlines } from './utils/getHeadlines.js';
import { openIssue } from './utils/issue.js';
const takeHeadlines = 30;

// run every day at 00:01 UTC
const run = async (date) => {
    const contents = await getHeadlines(date, takeHeadlines);
    if (!contents) {
        core.warning("no content - skip issue creation")
        return;
    }
    core.info(contents);
    const res = await openIssue({
        owner: 'meixger',
        repo: 'hackernews-daily',
        title: `Hacker News Daily Top ${takeHeadlines} @${new Date(date).toISOString().slice(0, 10)}`,
        body: contents
    });

    //   const issueNumber = res.data.number;

    //   await issue.lock({
    //     owner: 'headllines',
    //     repo: 'hackernews-daily', 
    //     issueNumber,
    //   });
}

run(new Date())
    .catch(err => { throw err });