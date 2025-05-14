import inquirer from 'inquirer';
import { deleteFolder, deleteFile, listFolders, listItems, BASE_DIR } from '../utils/fileOperations';
import path from 'path';

/**
 * Handle the deletion of a folder
 */
export async function handleDeleteFolder(): Promise<void> {
  const folders = listFolders();
  
  if (folders.length === 0) {
    console.log('No folders available to delete');
    return;
  }
  
  const { folderToDelete } = await inquirer.prompt([
    {
      type: 'list',
      name: 'folderToDelete',
      message: 'Select a folder to delete:',
      choices: folders.map(folder => ({
        name: folder.name,
        value: folder.name
      }))
    }
  ]);
  
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to delete the folder '${folderToDelete}'? This cannot be undone.`,
      default: false
    }
  ]);
  
  if (confirm) {
    deleteFolder(folderToDelete);
  } else {
    console.log('Folder deletion cancelled');
  }
}

/**
 * Handle the deletion of a file
 */
export async function handleDeleteFile(): Promise<void> {
  // First, select a folder
  const folders = listFolders();
  
  if (folders.length === 0) {
    console.log('No folders available');
    return;
  }
  
  const { folderName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'folderName',
      message: 'Select a folder:',
      choices: folders.map(folder => ({
        name: folder.name,
        value: folder.name
      }))
    }
  ]);
  
  // Then, select a file to delete
  const folderPath = path.join(BASE_DIR, folderName);
  const files = listItems(folderPath).filter(item => !item.isDirectory);
  
  if (files.length === 0) {
    console.log(`No files available in folder '${folderName}'`);
    return;
  }
  
  const { fileName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'fileName',
      message: `Select a file to delete from '${folderName}':`,
      choices: files.map(file => ({
        name: file.name,
        value: file.name
      }))
    }
  ]);
  
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to delete the file '${fileName}'? This cannot be undone.`,
      default: false
    }
  ]);
  
  if (confirm) {
    deleteFile(folderName, fileName);
  } else {
    console.log('File deletion cancelled');
  }
}