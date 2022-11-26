const axios = require('axios');
const { EOL } = require('os');

const getHeadlines = async (date, take) => {
    try {
        // end of the date
        const endTime = Math.round(new Date(date).getTime() / 1000);
        // 1 hour before start of the date (save missed posts)
        const startTime = Math.round(new Date(date).getTime() / 1000) - (25 * 60 * 60);
        const res = await axios.get(`https://hn.algolia.com/api/v1/search?hitsPerPage=${take}&numericFilters=created_at_i>${startTime},created_at_i<${endTime}`);
        const headlines = res.data.hits.slice(0, take);
        const contents = headlines
            .map((obj, i) => {
                let { title, url, points, objectID, num_comments } = obj;
                const ycombinatorUrl = `https://news.ycombinator.com/item?id=${objectID}`;
                if (!url) url = ycombinatorUrl;
                const domain = url ? `<code>${new URL(url).hostname}</code>` : '';
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
