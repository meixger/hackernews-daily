import core from "@actions/core";
import { EOL } from "os";
import { exit } from "process";

function githubAvoidingBacklinksToLinkedReferences(value) {
    // Avoiding backlinks to linked references
    // ref: https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls#avoiding-backlinks-to-linked-references
    return value.replace(/https?:\/\/(www\.)?github.com\//g, 'https://redirect.github.com/');
}

function escapeHTML(value) {
    return (value?.replace(
        /[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)) ?? ""
    );
}

export const getHeadlines = async (date, take) => {
    try {
        // end of the date
        const endTime = Math.round(date.getTime() / 1000);
        // 1 hour before start of the date (save missed posts)
        const startTime = endTime - (25 * 60 * 60);
        core.notice(`date range from ${new Date(startTime * 1000)} to ${new Date(endTime * 1000)}`);
        const url = `https://hn.algolia.com/api/v1/search?hitsPerPage=${take}&numericFilters=created_at_i>${startTime},created_at_i<${endTime}`;
        let data;
        try {
            data = await fetch(url).then(res => res.json());
        } catch (error) {
            core.info(url);
            core.error(`request failed: ${error.message}`);
            exit(1);
        }

        const count = data?.hits?.length;
        if (!(count > 0)) {
            core.info(url);
            core.error('no results from api');
            exit(1);
        }

        const headlines = data.hits.slice(0, take);
        const contents = headlines
            .map((obj, i) => {
                let { title, url, points, objectID, num_comments } = obj;
                const ycombinatorUrl = `https://news.ycombinator.com/item?id=${objectID}`;
                if (!url) url = ycombinatorUrl;
                const domain = url ? `<code>${new URL(url).hostname}</code>` : '';
                url = githubAvoidingBacklinksToLinkedReferences(url);
                const titleAndDomain = `[**${escapeHTML(title)}** ${domain}](${url})`;
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
