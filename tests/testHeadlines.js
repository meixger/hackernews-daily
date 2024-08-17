import { getHeadlines } from "../utils/getHeadlines.js";

const headlines = await getHeadlines(new Date(), 25);
console.log(headlines);
 