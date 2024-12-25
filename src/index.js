import { 
  getMyAnimeListTitles,
  year, 
  getIgnoreFile,
  getDataFile,
  searchPath
} from './utils.js';

if (!year) {
  console.error('Please provide a year using the --year argument. Example: npm run missing -- --year 2024');
  process.exit(1);
}

(async () => {
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

