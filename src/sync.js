import fs from 'fs/promises';
import { 
  getDataFile,
  getFolders,
  getOnlyFolders,
  generateJSONFile,
  year,
  dataFilePath,
  networkFolderPath
} from './utils.js';

if (!year) {
  console.error('Please provide a year using the --year argument. Example: npm run sync -- --year 2024');
  process.exit(1);
}

(async () => {
  const foldersAndFiles = await getFolders();
  const folders = getOnlyFolders(foldersAndFiles);
  const jsonFromFolders = await generateJSONFile(folders);
  const dataJSON = await getDataFile();
  const missingFolders = [];

  for(const folder of jsonFromFolders) {
    const hasItem = dataJSON.find(item => item.id == folder.id);
    if(!hasItem) {
      missingFolders.push(folder);
    } else {
      const files = await getFolders(`${networkFolderPath}\\${folder.name}`);
      const onlyVideos = files.filter(file => file.name.match(/\.(mkv|mp4|avi|mov|wmv|flv|webm|m4v)$/i));
      const totalLength = onlyVideos.length;
      if (totalLength > 0 && hasItem.files !== totalLength) {
        const folderIndex = dataJSON.findIndex(item => item.id == folder.id);
        if (folderIndex !== -1) {
          dataJSON[folderIndex].files = totalLength;
        }
      }
    }
  }

  if(missingFolders.length) {
    missingFolders.forEach(folder => {
      console.log(`Added: ${folder.name}`)
      dataJSON.push(folder);
    });
    const sortDataJSON = dataJSON.sort((a, b) => a.name.localeCompare(b.name));
    const humanReadableDate = new Date().toLocaleString('en-GB', { dateStyle: 'short' }).replace(/\//g, '-');
    try {
      const backupFilePath = dataFilePath + '-' + humanReadableDate + '.bak';
      await fs.rename(dataFilePath, backupFilePath);
      console.log('Backup created', backupFilePath);
    } catch (error) {
      console.log(error);
    }

    try {
      await fs.writeFile(dataFilePath, JSON.stringify(sortDataJSON, null, 2));
      console.log(dataFilePath, 'updated');
    } catch (error) {
      console.log(error)
    }
  }

  await fs.writeFile(dataFilePath, JSON.stringify(dataJSON, null, 2));
})()

