import 'dotenv/config'

import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));
export const year = args.year;

export const baseMyAnimeList = process.env.BASE_ANIMELIST;
export const networkFolderPath = process.env.NETWORK_PATH + year;
export const dataFilePath = `${networkFolderPath}\\data.json`;
export const ignoreFilePath = `${networkFolderPath}\\ignore.json`;

export const fetchHTML = async (url) => {
  try {
    const response = await fetch(baseMyAnimeList + url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    return html;
  } catch (error) {
    console.error('Error fetching HTML:', error);
  }
};

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const getNextLink = (document, url) => {
  const searchParams = new URLSearchParams(url);
  const show = searchParams.get('show') ?? parseInt(searchParams.get('show'));
  let nextLink;

  if(!show) {
    nextLink = document.querySelector('.list .spaceit a[href*="show=50"]');
  } else {
    nextLink = document.querySelector(`.list .spaceit a[href*="show=${parseInt(show) + 50}"]`);
  }

  return nextLink;
}

export const getMyAnimeListTitles = async (url, rows = []) => {
  const html = await fetchHTML(url);
  const dom = new JSDOM(html);
  const document = dom.window.document;
  let nextLink = getNextLink(document, url);
  const currentRows = document.querySelectorAll('.list table tbody tr .title .hoverinfo_trigger');

  for (const row of currentRows) {
    const id = row.getAttribute('href').match(/anime\/(\d+)/)[1];
    const date = row.closest('tr').querySelector('td:last-child').textContent;
    const dateYear = new Date(date).getFullYear();
    if(dateYear == year) {
      rows.push({ 
        id: id,
        url: `${baseMyAnimeList}/anime/${id}`,
        name: row.textContent,
      });
    } else if(dateYear > year) {
      // Because MyAnimeList lists all the titles from the start year untill the current year... no logic, so we return earlier here
      console.log('No more titles from this year');
      return rows;
    }
  }
 
  if(nextLink) {
    await sleep(2000);
    await getMyAnimeListTitles(nextLink.getAttribute('href'), rows)
  }

  return rows;
}

export const generateJSONFile = async (folders) => {
  const dataJSON = [];
  for (const folder of folders) {
    const id = folder.match(/\{([^}]+)\}$/)?.[1];
    if(id) {
      const files = await getFolders(`${networkFolderPath}\\${folder}`);
      dataJSON.push({
          id: id,
          files: files.length,
          name: folder,
          episodes: null,
      })
    }
  }
  return dataJSON;
}

export const getFolders = async (path = networkFolderPath) => {
  let folders = [];
  try {
    folders = await fs.readdir(path, { withFileTypes: true });
  } catch (error) {
    console.error('Error reading directory:', error);
  }
  return folders;
}

export const getOnlyFolders = (paths) => {
  return paths
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

export const getIgnoreFile = async () => {
  let ignore = [];

  try {
    const ignoreResponse = await fs.readFile(ignoreFilePath, 'utf8');
    ignore = JSON.parse(ignoreResponse);
    ignore = ignore.ids.map(entry => parseInt(entry));
  } catch (error) {
    console.log('No ignore file found');
  }

  return ignore;
}

export const getDataFile = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const dataJSON = JSON.parse(data);
    return dataJSON;
  } catch (error) {
    console.error('Data.json file not found.');
  }
}