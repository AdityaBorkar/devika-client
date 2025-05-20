import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

/**
 * Calculates the total number of characters in all files of a folder
 * @param folderPath - Path to the folder to scan
 * @returns Promise resolving to the total character count
 */
export async function countCharactersInFolder(
	folderPath: string,
): Promise<number> {
	// Ensure the folder path exists
	if (!fs.existsSync(folderPath)) {
		throw new Error(`Folder does not exist: ${folderPath}`);
	}

	let totalCharacters = 0;
	const items = await readdir(folderPath);

	for (const item of items) {
		const itemPath = path.join(folderPath, item);
		const stats = await stat(itemPath);

		if (stats.isFile()) {
			// Read file content and add to total character count
			const content = await readFile(itemPath, 'utf8');
			totalCharacters += content.length;
		} else if (stats.isDirectory()) {
			// Recursively process subdirectories
			const subDirCharacters = await countCharactersInFolder(itemPath);
			totalCharacters += subDirCharacters;
		}
	}

	return totalCharacters;
}

// Example usage:
// countCharactersInFolder('/path/to/folder')
//   .then(count => console.log(`Total characters: ${count}`))
//   .catch(err => console.error(`Error: ${err.message}`));
