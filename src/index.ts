#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import {
  initializeFileManager,
} from './utils/fileOperations';
import { displayHeader } from './utils/display';
import {
  handleCreateFolder,
  handleCreateFile
} from './commands/create';
import {
  handleDeleteFolder,
  handleDeleteFile
} from './commands/delete';
import {
  handleListFolders,
  handleListContents
} from './commands/list';
import {
  handleRenameFolder,
  handleRenameFile
} from './commands/rename';

const program = new Command();

program
  .name('fman')
  .description('A CLI file manager application')
  .version('1.0.0');

initializeFileManager();

async function mainMenu(): Promise<void> {
  displayHeader();
  
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'List Folders', value: 'listFolders' },
        { name: 'View Folder Contents', value: 'viewContents' },
        { name: 'Create New Folder', value: 'createFolder' },
        { name: 'Delete Folder', value: 'deleteFolder' },
        { name: 'Rename Folder', value: 'renameFolder' },
        { name: 'Create New File', value: 'createFile' },
        { name: 'Delete File', value: 'deleteFile' },
        { name: 'Rename File', value: 'renameFile' },
        { name: 'Exit', value: 'exit' }
      ]
    }
  ]);
  
  switch (action) {
    case 'listFolders':
      await handleListFolders();
      break;
    case 'viewContents':
      await handleListContents();
      break;
    case 'createFolder':
      await handleCreateFolder();
      break;
    case 'deleteFolder':
      await handleDeleteFolder();
      break;
    case 'renameFolder':
      await handleRenameFolder();
      break;
    case 'createFile':
      await handleCreateFile();
      break;
    case 'deleteFile':
      await handleDeleteFile();
      break;
    case 'renameFile':
      await handleRenameFile();
      break;
    case 'exit':
      console.log('Goodbye!');
      process.exit(0);
      break;
    default:
      console.log('Invalid option');
      break;
  }
  
  if (action !== 'exit') {
    const { continue: shouldContinue } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: 'Would you like to perform another action?',
        default: true
      }
    ]);
    
    if (shouldContinue) {
      console.clear();
      await mainMenu();
    } else {
      console.log('Goodbye!');
      process.exit(0);
    }
  }
}

if (require.main === module) {
  mainMenu().catch(error => {
    console.error('An error occurred:', error);
    process.exit(1);
  });
}

export {
  handleListFolders,
  handleListContents,
  handleCreateFolder,
  handleCreateFile,
  handleDeleteFolder,
  handleDeleteFile,
  handleRenameFolder,
  handleRenameFile
};