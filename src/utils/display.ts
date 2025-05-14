import chalk from 'chalk';
import figlet from 'figlet';
import { FileInfo } from '../types';
import path from 'path';

/**
 * Display the application header
 */
export function displayHeader(): void {
  console.log(
    chalk.blue(
      figlet.textSync('File Manager', { horizontalLayout: 'full' })
    )
  );
  console.log(chalk.yellow('A CLI file manager application\n'));
}

/**
 * Format size to be human-readable
 */
export function formatSize(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let formattedSize = size;
  let unitIndex = 0;
  
  while (formattedSize >= 1024 && unitIndex < units.length - 1) {
    formattedSize /= 1024;
    unitIndex++;
  }
  
  return `${formattedSize.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Format date to be human-readable
 */
export function formatDate(date: Date): string {
  return date.toLocaleString();
}

/**
 * Display a list of items
 */
export function displayItems(items: FileInfo[], currentPath: string): void {
  console.log(chalk.green(`\nContents of ${currentPath}:`));
  console.log(chalk.yellow('='.repeat(50)));
  
  if (items.length === 0) {
    console.log(chalk.yellow('No items found in this directory'));
    console.log(chalk.yellow('='.repeat(50)));
    return;
  }
  
  // Display folders first, then files
  const folders = items.filter(item => item.isDirectory);
  const files = items.filter(item => !item.isDirectory);
  
  // Display folders
  if (folders.length > 0) {
    console.log(chalk.blue('\nFolders:'));
    folders.forEach((folder, index) => {
      console.log(chalk.blue(`${index + 1}. ${folder.name}`));
    });
  }
  
  // Display files
  if (files.length > 0) {
    console.log(chalk.green('\nFiles:'));
    files.forEach((file, index) => {
      console.log(
        chalk.green(`${index + 1}. ${file.name}`) +
        chalk.gray(` (${formatSize(file.size)}) - Modified: ${formatDate(file.modified)}`)
      );
    });
  }
  
  console.log(chalk.yellow('='.repeat(50)));
}