//File to store the load operations - in typescript
//Project structure: When using other langauges, make new file of the same name.
//Ensure code in new file does the ~exact same~ thing as this file
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
//load data into a db
// import fs from 'fs';
// import path from 'path';
// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';
var fs = require('fs');
var path = require('path');
var mysql = require('mysql2/promise');
var dotenv = require('dotenv');
// Load environment variables
dotenv.config();
var loadJSONtoDB = function () { return __awaiter(_this, void 0, void 0, function () {
    var jsonFilePath, jsonData, records, connection, _i, records_1, record, query, values, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jsonFilePath = path.resolve(__dirname, '../../data/transformed100ts.json');
                jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
                records = JSON.parse(jsonData);
                return [4 /*yield*/, mysql.createConnection({
                        host: process.env.DB_HOST,
                        user: process.env.DB_USER,
                        password: process.env.DB_PASSWORD,
                        database: process.env.DB_NAME,
                    })];
            case 1:
                connection = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 7, 8, 10]);
                _i = 0, records_1 = records;
                _a.label = 3;
            case 3:
                if (!(_i < records_1.length)) return [3 /*break*/, 6];
                record = records_1[_i];
                query = "\n        INSERT INTO TableNameTBD (\n          item_type, \n          order_priority, \n          order_date, \n          order_id, \n          units_sold, \n          unit_price, \n          unit_cost, \n          total_revenue, \n          total_cost, \n          total_profit\n        ) \n        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n      ";
                values = [
                    record["Item Type"],
                    record["Order Priority"],
                    record["Order Date"],
                    record["Order ID"],
                    record["Units Sold"],
                    record["Unit Price"],
                    record["Unit Cost"],
                    record["Total Revenue"],
                    record["Total Cost"],
                    record["Total Profit"],
                ];
                // Execute the query
                //Assumes no malicious SQL Injection
                return [4 /*yield*/, connection.execute(query, values)];
            case 4:
                // Execute the query
                //Assumes no malicious SQL Injection
                _a.sent();
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                console.log('Data loaded successfully!');
                return [3 /*break*/, 10];
            case 7:
                error_1 = _a.sent();
                console.error('Error loading data:', error_1);
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, connection.end()];
            case 9:
                _a.sent();
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); };
loadJSONtoDB().catch(console.error);
// CSV version
// const loadCSVtoDB = async () => {
//   // Step 1: Read the transformed CSV file
//   const csvFilePath = path.resolve(__dirname, 'transformedData.csv');
//   const csvData = fs.readFileSync(csvFilePath, 'utf-8');
//   // Parse CSV data (basic splitting; consider using a CSV parser library for complex files)
//   const rows = csvData.split('\n').map(row => row.split(','));
//   // Step 2: Connect to the AWS RDS MySQL/MariaDB database
//   const connection = await mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   });
//   try {
//     // Step 3: Insert rows into the database
//     for (let row of rows) {
//       const query = `INSERT INTO your_table_name (column1, column2, ...) VALUES (?, ?, ...)`;
//       await connection.execute(query, row);
//     }
//     console.log('Data loaded successfully!');
//   } catch (error) {
//     console.error('Error loading data:', error);
//   } finally {
//     await connection.end();
//   }
// };
// loadCSVtoDB().catch(console.error);
