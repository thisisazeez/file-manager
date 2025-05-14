import inquirer from 'inquirer';
import { listFolders, listItems, BASE_DIR } from '../utils/fileOperations';
import { SortType } from '../types';
import { displayItems } from '../utils/display';
import path from 'path';

export async function handleListFolders(): Promise<void> {
  const folders = listFolders();
  
  if (folders.length === 0) {
    console.log('No folders available');
    return;
  }
  
  displayItems(folders, BASE_DIR);
}

export async function handleListContents(): Promise<void> {
  const folders = listFolders();
  
  if (folders.length === 0) {
    console.log('No folders available');
    return;
  }
  
  const { folderName, sortBy } = await inquirer.prompt([
    {
      type: 'list',
      name: 'folderName',
      message: 'Select a folder to view contents:',
      choices: folders.map(folder => ({
        name: folder.name,
        value: folder.name
      }))
    },
    {
      type: 'list',
      name: 'sortBy',
      message: 'Sort items by:',
      choices: [
        { name: 'Name (A-Z)', value: SortType.NAME_ASC },
        { name: 'Name (Z-A)', value: SortType.NAME_DESC },
        { name: 'Date Modified (Oldest First)', value: SortType.DATE_ASC },
        { name: 'Date Modified (Newest First)', value: SortType.DATE_DESC }
      ]
    }
  ]);
  
  const folderPath = path.join(BASE_DIR, folderName);
  const items = listItems(folderPath, sortBy as SortType);
  
  displayItems(items, folderPath);
}
