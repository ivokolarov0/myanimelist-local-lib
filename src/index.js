import { 
  getMyAnimeListTitles,
  year, 
  getIgnoreFile,
  getDataFile
} from './utils.js';

if (!year) {
  console.error('Please provide a year using the --year argument. Example: npm run missing -- --year 2024');
  process.exit(1);
}

(async () => {
  const searchPath = process.env.SEARCH_PATH.replace('${year}', year);
  const websiteItems = await getMyAnimeListTitles(searchPath);

  const dataJSON = await getDataFile();
  
  const ignore = await getIgnoreFile();
  const getIDs = dataJSON.map(entry => parseInt(entry.id));
  const missingTitles = websiteItems.filter(item => {
    const id = parseInt(item.id);
    return !getIDs.includes(id) && !ignore.includes(id);
  });

  console.log('Missing Titles:', missingTitles);
})()

