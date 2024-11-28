//File to store the transform operations - in typescript
//Project structure: When using other langauges, make new file of the same name.
//Ensure code in new file does the ~exact same~ thing as this file

// Most of this code is made from LLM generated responses from chatGPT and modified by Caleb Krauter
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { loadJSONtoDB } from './load';
import { fetchData } from './query';
import { fetchAggregatedData } from './query';
// index.ts
// Get the file dynamically
const filePath = path.resolve(__dirname, '../../data/100_Sales_Records.csv');

// Use this code to connect the lambda function to our project.
export const handler = async (event: any, context: any) => {
  console.log("Event: ", event);
    parseCSV(filePath);  // Call your modular code
    loadJSONtoDB();  // Call your modular code
    const result = fetchData();
    // Put some sort of switch in here to change between the results.
    // const result = fetchAggregatedData();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

  


const parseCSV = (filePath: string) => {
    const fs = require('fs');
    const csv = require('csv-parser');  
    const results: any[] = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row: any) => {
            const { Region, Country, 'Sales Channel': salesChannel, 'Ship Date': shipDate, ...filteredElement } = row;
            results.push(filteredElement);

        }).on('end', () => {
            writeFile('src/typescript/transformed_100_TS.json', JSON.stringify(results, null, 2));
            // Do parsing here.
        });

};



parseCSV(filePath);
