import fs from 'fs/promises';
import { 
  getDataFile,
  getFolders,
  getOnlyFolders,
  generateJSONFile,
  year,
  dataFilePath
} from './utils.js';

if (!year) {
  console.error('Please provide a year using the --year argument. Example: npm run generate -- --year 2024');
  process.exit(1);
}

(async () => {
  const foldersAndFiles = await getFolders();
  const folders = getOnlyFolders(foldersAndFiles);
  const jsonFromFolders = await generateJSONFile(folders);

  const dataJSON = await getDataFile();

  if(dataJSON) {
    console.error('There is already a data.json file. Please delete it before running this script.');
    process.exit(1);
  }
 
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(jsonFromFolders, null, 2));
    console.log('data.json file created in ', dataFilePath);
  } catch (error) {
    console.log(error)
  }
})()

