import inquirer from 'inquirer';
import { renameFolder, renameFile, listFolders, listItems, BASE_DIR } from '../utils/fileOperations';
import path from 'path';

/**
 * Handle renaming a folder
 */
export async function handleRenameFolder(): Promise<void> {
  const folders = listFolders();
  
  if (folders.length === 0) {
    console.log('No folders available to rename');
    return;
  }
  
  const { folderToRename } = await inquirer.prompt([
    {
      type: 'list',
      name: 'folderToRename',
      message: 'Select a folder to rename:',
      choices: folders.map(folder => ({
        name: folder.name,
        value: folder.name
      }))
    }
  ]);
  
  const { newFolderName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'newFolderName',
      message: `Enter a new name for folder '${folderToRename}':`,
      validate: (input) => {
        if (!input.trim()) {
          return 'Folder name cannot be empty';
        }
        return true;
      }
    }
  ]);
  
  renameFolder(folderToRename, newFolderName.trim());
}

/**
 * Handle renaming a file
 */
export async function handleRenameFile(): Promise<void> {
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
  
  // Then, select a file to rename
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
      message: `Select a file to rename from '${folderName}':`,
      choices: files.map(file => ({
        name: file.name,
        value: file.name
      }))
    }
  ]);
  
  const { newFileName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'newFileName',
      message: `Enter a new name for file '${fileName}':`,
      validate: (input) => {
        if (!input.trim()) {
          return 'File name cannot be empty';
        }
        return true;
      }
    }
  ]);
  
  renameFile(folderName, fileName, newFileName.trim());
}