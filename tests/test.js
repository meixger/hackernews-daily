const getHeadlines = require('../utils/getHeadlines');
(async () => {
  const headlines = await getHeadlines(new Date(), 25);
  console.log(headlines);
})();