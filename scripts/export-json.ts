import { writeFileSync, existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { permisssionSets } from '../lib/data';

/**
 * Run locally to export the configured policies to JSON.
 * Will export to the 'exports' folder (created if necessary).
 * npx ts-node scripts/export-json
 */
(function main(): void {
    try {
        const exportDir = path.join(__dirname, '../exports');
        if (!existsSync(exportDir)) { mkdirSync(exportDir); }
        permisssionSets.forEach((set) => {
            const { name, inlinePolicy } = set;
            const filename = `${name}.json`;
            const outputPath = path.join(exportDir, filename);
            if (inlinePolicy) {
                writeFileSync(outputPath, JSON.stringify(inlinePolicy, null, 2));
            }
            console.log('Exported: ', filename);
        });
    } catch (err) {
        console.error(err);
        throw err;
    }
}());
