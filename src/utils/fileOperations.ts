import fs from 'fs';
import path from 'path';
import { FileInfo, SortType } from '../types';

// Base directory for the file manager
export const BASE_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '', 'file-manager');

// Default folders
export const DEFAULT_FOLDERS = ['pictures', 'music', 'videos', 'documents'];

/**
 * Initialize the file manager by creating the base directory and default folders
 */
export function initializeFileManager(): void {
  try {
    // Create base directory if it doesn't exist
    if (!fs.existsSync(BASE_DIR)) {
      fs.mkdirSync(BASE_DIR, { recursive: true });
      console.log(`Created base directory at ${BASE_DIR}`);
    }

    // Create default folders if they don't exist
    DEFAULT_FOLDERS.forEach(folder => {
      const folderPath = path.join(BASE_DIR, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Created default folder: ${folder}`);
      }
    });
  } catch (error) {
    console.error('Error initializing file manager:', error);
    process.exit(1);
  }
}

/**
 * List all folders in the base directory
 */
export function listFolders(): FileInfo[] {
  try {
    const items = fs.readdirSync(BASE_DIR);
    
    return items
      .map(item => {
        const itemPath = path.join(BASE_DIR, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          return {
            name: item,
            path: itemPath,
            isDirectory: true,
            size: 0, // Directories are shown as 0 size
            created: stats.birthtime,
            modified: stats.mtime
          };
        }
        return null;
      })
      .filter((item): item is FileInfo => item !== null);
  } catch (error) {
    console.error('Error listing folders:', error);
    return [];
  }
}

/**
 * List all files and folders in a given directory
 */
export function listItems(dirPath: string, sortType: SortType = SortType.NAME_ASC): FileInfo[] {
  try {
    if (!fs.existsSync(dirPath)) {
      console.error(`Directory ${dirPath} does not exist`);
      return [];
    }

    const items = fs.readdirSync(dirPath);
    
    const fileInfos = items.map(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      return {
        name: item,
        path: itemPath,
        isDirectory: stats.isDirectory(),
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    });

    // Sort the items based on sortType
    return sortItems(fileInfos, sortType);
  } catch (error) {
    console.error(`Error listing items in ${dirPath}:`, error);
    return [];
  }
}

/**
 * Sort items based on the provided sort type
 */
export function sortItems(items: FileInfo[], sortType: SortType): FileInfo[] {
  switch (sortType) {
    case SortType.NAME_ASC:
      return items.sort((a, b) => a.name.localeCompare(b.name));
    case SortType.NAME_DESC:
      return items.sort((a, b) => b.name.localeCompare(a.name));
    case SortType.DATE_ASC:
      return items.sort((a, b) => a.modified.getTime() - b.modified.getTime());
    case SortType.DATE_DESC:
      return items.sort((a, b) => b.modified.getTime() - a.modified.getTime());
    default:
      return items;
  }
}

/**
 * Create a new folder
 */
export function createFolder(folderName: string): boolean {
  try {
    const folderPath = path.join(BASE_DIR, folderName);
    
    if (fs.existsSync(folderPath)) {
      console.error(`Folder '${folderName}' already exists`);
      return false;
    }
    
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Folder '${folderName}' created successfully`);
    return true;
  } catch (error) {
    console.error(`Error creating folder '${folderName}':`, error);
    return false;
  }
}

/**
 * Delete a folder
 */
export function deleteFolder(folderName: string): boolean {
  try {
    const folderPath = path.join(BASE_DIR, folderName);
    
    if (!fs.existsSync(folderPath)) {
      console.error(`Folder '${folderName}' does not exist`);
      return false;
    }
    
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`Folder '${folderName}' deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Error deleting folder '${folderName}':`, error);
    return false;
  }
}

/**
 * Rename a folder
 */
export function renameFolder(oldName: string, newName: string): boolean {
  try {
    const oldPath = path.join(BASE_DIR, oldName);
    const newPath = path.join(BASE_DIR, newName);
    
    if (!fs.existsSync(oldPath)) {
      console.error(`Folder '${oldName}' does not exist`);
      return false;
    }
    
    if (fs.existsSync(newPath)) {
      console.error(`Folder '${newName}' already exists`);
      return false;
    }
    
    fs.renameSync(oldPath, newPath);
    console.log(`Folder renamed from '${oldName}' to '${newName}' successfully`);
    return true;
  } catch (error) {
    console.error(`Error renaming folder from '${oldName}' to '${newName}':`, error);
    return false;
  }
}

/**
 * Create a new file with content
 */
export function createFile(folderName: string, fileName: string, content: string = ''): boolean {
  try {
    const folderPath = path.join(BASE_DIR, folderName);
    
    if (!fs.existsSync(folderPath)) {
      console.error(`Folder '${folderName}' does not exist`);
      return false;
    }
    
    const filePath = path.join(folderPath, fileName);
    
    if (fs.existsSync(filePath)) {
      console.error(`File '${fileName}' already exists in folder '${folderName}'`);
      return false;
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`File '${fileName}' created successfully in folder '${folderName}'`);
    return true;
  } catch (error) {
    console.error(`Error creating file '${fileName}' in folder '${folderName}':`, error);
    return false;
  }
}

/**
 * Delete a file
 */
export function deleteFile(folderName: string, fileName: string): boolean {
  try {
    const filePath = path.join(BASE_DIR, folderName, fileName);
    
    if (!fs.existsSync(filePath)) {
      console.error(`File '${fileName}' does not exist in folder '${folderName}'`);
      return false;
    }
    
    fs.unlinkSync(filePath);
    console.log(`File '${fileName}' deleted successfully from folder '${folderName}'`);
    return true;
  } catch (error) {
    console.error(`Error deleting file '${fileName}' from folder '${folderName}':`, error);
    return false;
  }
}

/**
 * Rename a file
 */
export function renameFile(folderName: string, oldFileName: string, newFileName: string): boolean {
  try {
    const folderPath = path.join(BASE_DIR, folderName);
    const oldFilePath = path.join(folderPath, oldFileName);
    const newFilePath = path.join(folderPath, newFileName);
    
    if (!fs.existsSync(oldFilePath)) {
      console.error(`File '${oldFileName}' does not exist in folder '${folderName}'`);
      return false;
    }
    
    if (fs.existsSync(newFilePath)) {
      console.error(`File '${newFileName}' already exists in folder '${folderName}'`);
      return false;
    }
    
    fs.renameSync(oldFilePath, newFilePath);
    console.log(`File renamed from '${oldFileName}' to '${newFileName}' successfully in folder '${folderName}'`);
    return true;
  } catch (error) {
    console.error(`Error renaming file from '${oldFileName}' to '${newFileName}' in folder '${folderName}':`, error);
    return false;
  }
}