import fs from 'fs/promises'
import { getMyAnimeListTitles, year } from "./utils.js";

if (!year) {
  console.error('Please provide a year using the --year argument. Example: npm run list -- --year 2024');
  process.exit(1);
}


const websiteItems = await getMyAnimeListTitles(`/anime.php?cat=anime&q=&type=0&score=0&status=0&p=0&r=6&sm=0&sd=0&sy=${year}&em=0&ed=0&ey=0&c%5B%5D=a&c%5B%5D=b&c%5B%5D=c&c%5B%5D=d`);

fs.writeFile('./temp/list.json', JSON.stringify(websiteItems, null, 2))

console.log('List created in ./temp/list.json')