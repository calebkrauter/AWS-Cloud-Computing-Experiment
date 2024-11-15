//File to store the transform operations - in typescript
//Project structure: When using other langauges, make new file of the same name.
//Ensure code in new file does the ~exact same~ thing as this file

// Most of this code is made from LLM generated responses from chatGPT and modified by Caleb Krauter
import { writeFile } from 'fs/promises';

const fs = require('fs');
const csv = require('csv-parser');

const parseCSV = (filePath: string) => {
    const results: any[] = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row: any) => {
            const { Region, Country, 'Sales Channel': salesChannel, 'Ship Date': shipDate, ...filteredElement } = row;
            results.push(filteredElement);

        }).on('end', () => {
            writeFile('../../data/transformed_100_TS.json', JSON.stringify(results, null, 2));
            // Do parsing here.
        });

};



parseCSV('../../data/100 Sales Records.csv');
