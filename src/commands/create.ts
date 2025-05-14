import inquirer from 'inquirer';
import path from 'path';
import { createFolder, createFile, BASE_DIR } from '../utils/fileOperations';

/**
 * Handle the creation of a new folder
 */
export async function handleCreateFolder(): Promise<void> {
  const { folderName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'folderName',
      message: 'Enter the name of the new folder:',
      validate: (input) => {
        if (!input.trim()) {
          return 'Folder name cannot be empty';
        }
        return true;
      }
    }
  ]);
  
  createFolder(folderName.trim());
}

/**
 * Handle the creation of a new file
 */
export async function handleCreateFile(): Promise<void> {
    // First, select a folder
    const folders = await inquirer.prompt([
      {
        type: 'input',
        name: 'folderName',
        message: 'Enter the folder name where you want to create the file:',
        validate: (input) => {
          const folderPath = path.join(BASE_DIR, input.trim());
          if (!input.trim()) {
            return 'Folder name cannot be empty';
          }
          try {
            return require('fs').existsSync(folderPath) ? true : 'Folder does not exist';
          } catch (error) {
            return 'Invalid folder name';
          }
        }
      }
    ]);
    
    // Then, get the file name and content
    const { fileName, content } = await inquirer.prompt([
      {
        type: 'input',
        name: 'fileName',
        message: 'Enter the name of the new file:',
        validate: (input) => {
          if (!input.trim()) {
            return 'File name cannot be empty';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'content',
        message: 'Enter the content of the file (or leave empty for no content):',
        default: ''
      }
    ]);
    
    createFile(folders.folderName.trim(), fileName.trim(), content);
  }