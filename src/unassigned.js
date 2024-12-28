import { getFolders, networkFolderPath } from './utils.js';
import fs from 'fs/promises'

const folders = await getFolders();

for (const folder of folders) {
  if(!folder.name.match(/\{\d+\}$/)) {
    console.log(folder)
  }
}