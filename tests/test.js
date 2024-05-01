import { getHeadlines } from "../utils/getHeadlines.js";
import { GetIssues } from '../utils/issue.js';

(async () => {

  const headlines = await getHeadlines(new Date(), 25);
  console.log(headlines);

  await GetIssues({
    owner: 'meixger',
    repo: 'hackernews-daily'
  });

})();
