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
  const wrongEpisodes = websiteItems.filter(item => {
    const id = parseInt(item.id);
    const hasItem = dataJSON.find(entry => entry.id == id);
    return hasItem && hasItem.files != item.files && item.files > 0;
  });

  console.log('Missing Titles:', missingTitles);
  console.log('Wrong episodes:', wrongEpisodes);
})()

