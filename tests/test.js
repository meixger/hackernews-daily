const getHeadlines = require('../utils/getHeadlines');
(async () => {
  const headlines = await getHeadlines(new Date('2020-09-06'));
  console.log(headlines);
})();