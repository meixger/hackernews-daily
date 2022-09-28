const getHeadlines = require('./utils/getHeadlines');
const issue = require('./utils/issue');
const takeHeadlines = 30;

// run every day at 00:01 UTC
const run = async (date) => {
    const contents = await getHeadlines(date, takeHeadlines);
    console.log(contents)
    const res = await issue.open({
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