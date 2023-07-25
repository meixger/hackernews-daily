const core = require('@actions/core');
const axios = require('axios');
const { EOL } = require('os');
const { exit } = require('process');
const { Z_NO_COMPRESSION } = require('zlib');

function githubReplaceRenovatebotRedirector(value) {
    // avoid creating a GitHub issue reference by using renovatebot redirector
    // ref: https://github.com/renovatebot/renovate/blob/main/lib/modules/platform/github/index.ts
    return value.replace(/https?:\/\/(www\.)?github.com\//g, 'https://togithub.com/');
}

const getHeadlines = async (date, take) => {
    try {
        // end of the date
        const endTime = Math.round(new Date(date).getTime() / 1000);
        // 1 hour before start of the date (save missed posts)
        const startTime = endTime - (25 * 60 * 60);
        core.notice(`date range from ${new Date(startTime * 1000)} to ${new Date(endTime * 1000)}`);
        const url = `https://hn.algolia.com/api/v1/search?hitsPerPage=${take}&numericFilters=created_at_i>${startTime},created_at_i<${endTime}`;
        let res;
        try {
            res = await axios.get(url)
        } catch (error) {
            core.info(url);
            core.error(`request failed: ${error.message}`);
            exit(1);
        }

        const count = res.data?.hits?.length;
        if (!(count > 0)) {
            core.info(url);
            core.error('no results from api');
            exit(1);
        }

        const headlines = res.data.hits.slice(0, take);
        const contents = headlines
            .map((obj, i) => {
                let { title, url, points, objectID, num_comments } = obj;
                const ycombinatorUrl = `https://news.ycombinator.com/item?id=${objectID}`;
                if (!url) url = ycombinatorUrl;
                const domain = url ? `<code>${new URL(url).hostname}</code>` : '';
                url = githubReplaceRenovatebotRedirector(url);
                const titleAndDomain = `[**${title}** ${domain}](${url})`;
                const commentsAndPoints = `[${num_comments} comments ${points} points](${ycombinatorUrl})`;
                return `${i + 1}. ${titleAndDomain} - ${commentsAndPoints}`;
            })
            .join(EOL);

        return contents;
    } catch (error) {
        console.log(error);
        throw error
    }

}

module.exports = getHeadlines;
