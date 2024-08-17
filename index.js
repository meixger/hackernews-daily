import * as core from '@actions/core';
import { getHeadlines } from './utils/getHeadlines.js';
import { openIssue } from './utils/issue.js';
import { updateFeed } from './utils/feed.js';

const date = new Date();
const takeHeadlines = 30;

const contents = await getHeadlines(date, takeHeadlines);
if (!contents) {
    core.warning("no content - skip issue creation");
    process.exit(1);
}
core.info(contents);

if (process.env.BRANCH_NAME === 'main') {
    const res = await openIssue({
        owner: 'meixger',
        repo: 'hackernews-daily',
        title: `Hacker News Daily Top ${takeHeadlines} @${date.toISOString().slice(0, 10)}`,
        body: contents
    });

    const issueNumber = res.data.number;
    core.info(`created issue ${issueNumber}`);
}

await updateFeed();

//   await issue.lock({
//     owner: 'headllines',
//     repo: 'hackernews-daily', 
//     issueNumber,
//   });
