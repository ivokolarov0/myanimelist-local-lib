import fs from 'fs/promises'
import { getMyAnimeListTitles, searchPath, year } from "./utils.js";

if (!year) {
  console.error('Please provide a year using the --year argument. Example: npm run list -- --year 2024');
  process.exit(1);
}

const websiteItems = await getMyAnimeListTitles(searchPath);

websiteItems.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFile('./temp/list.json', JSON.stringify(websiteItems, null, 2))

console.log('List created in ./temp/list.json')