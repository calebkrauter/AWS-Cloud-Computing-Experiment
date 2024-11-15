"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchData = fetchData;
exports.fetchAggregatedData = fetchAggregatedData;
const promise_1 = __importDefault(require("mysql2/promise")); // Using promise-based API for async/await
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Database configuration (using .env values)
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
// Function to fetch all data (joined from both Order and Item tables)
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        let connection;
        try {
            // Establish connection to the database
            connection = yield promise_1.default.createConnection(dbConfig);
            // Query to select all data from both tables
            const [results, fields] = yield connection.execute(`
      SELECT * 
      FROM \`Order\` 
      JOIN Item ON \`Order\`.Item_Type = Item.Item_Type;
    `);
            // Log the retrieved data
            console.log('Data retrieved:');
            console.log(results);
            // Log the field names
            console.log('Field Names:');
            fields.forEach(field => console.log(field.name));
        }
        catch (err) {
            console.error('Error executing query', err);
        }
        finally {
            if (connection) {
                yield connection.end();
            }
        }
    });
}
// Function to fetch aggregated data (e.g., total revenue by item type)
function fetchAggregatedData() {
    return __awaiter(this, void 0, void 0, function* () {
        let connection;
        try {
            connection = yield promise_1.default.createConnection(dbConfig);
            const [results, fields] = yield connection.execute(`
      SELECT Item.Item_Type, SUM(Item.Total_Revenue) AS Total_Revenue
      FROM Item
      GROUP BY Item.Item_Type;
    `);
            console.log('Aggregated Data (Total Revenue by Item Type):');
            console.log(results);
        }
        catch (err) {
            console.error('Error executing query', err);
        }
        finally {
            if (connection)
                yield connection.end();
        }
    });
}
