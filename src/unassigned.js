import { getFolders } from './utils.js';

const folders = await getFolders();

for (const folder of folders) {
  if(!folder.name.match(/\{\d+\}$/)) {
    console.log(folder)
  }
}