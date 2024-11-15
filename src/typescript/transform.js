"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//File to store the transform operations - in typescript
//Project structure: When using other langauges, make new file of the same name.
//Ensure code in new file does the ~exact same~ thing as this file
// import fs from 'fs';
// import csv from 'csv-parser';
var promises_1 = require("fs/promises");
// From ChatGPT modfied by Caleb Kruter
var fs = require('fs');
var csv = require('csv-parser');
var parseCSV = function (filePath) {
    var results = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', function (row) { return results.push(row); })
        .on('end', function () {
        console.log('Parsed CSV:', results);
        // Do parsing here.
        (0, promises_1.writeFile)('output.txt', results[0]);
    });
};
parseCSV('../data/100 Sales Records 2.csv');
