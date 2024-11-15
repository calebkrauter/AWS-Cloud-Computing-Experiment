"use strict";
//File to store the transform operations - in typescript
//Project structure: When using other langauges, make new file of the same name.
//Ensure code in new file does the ~exact same~ thing as this file
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Most of this code is made from LLM generated responses from chatGPT and modified by Caleb Krauter
const promises_1 = require("fs/promises");
const fs = require('fs');
const csv = require('csv-parser');
const parseCSV = (filePath) => {
    const results = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
        const { Region, Country, 'Sales Channel': salesChannel, 'Ship Date': shipDate } = row, filteredElement = __rest(row, ["Region", "Country", 'Sales Channel', 'Ship Date']);
        results.push(filteredElement);
    }).on('end', () => {
        (0, promises_1.writeFile)('data/100 Sales Records.csv', JSON.stringify(results, null, 2));
        // Do parsing here.
    });
};
parseCSV('../data/100 Sales Records.csv');
