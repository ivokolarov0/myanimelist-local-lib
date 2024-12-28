import { getFolders, networkFolderPath } from './utils.js';
import fs from 'fs/promises'
import websiteItems from '../temp/list.json' with { type: "json" };

const folders = await getFolders();
const folderNames = folders.map(folder => ({
  ...folder,
  handledName: folder.name.toLowerCase().replace(/[^a-z0-9]/g, '')
}));


for (const item of websiteItems) {
  const handleName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const regex = new RegExp('^' + handleName, 'i');
  const hasItem = folderNames.find(folder => {
    if(folder.handledName.toLowerCase().match(regex)) {
      return folder;
    }
  });

  if(hasItem) {
    await fs.rename(networkFolderPath + '\\' + hasItem.name, networkFolderPath + '\\' + hasItem.name + item.id);
  } else {
    console.log('Missing:', item.name + ' ' + item.id);
  }
}

