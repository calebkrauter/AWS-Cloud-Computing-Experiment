//File to store the load operations - in typescript
//Project structure: When using other langauges, make new file of the same name.
//Ensure code in new file does the ~exact same~ thing as this file

//load data into a db

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const loadJSONtoDB = async () => {
  // Step 1: Read the transformed JSON file
  const jsonFilePath = path.resolve(__dirname, '../../data/transformed100ts.json');
  const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
  
  // Parse the JSON data
  const records = JSON.parse(jsonData); // Expects an array of objects

  // Step 2: Connect to the AWS RDS MySQL/MariaDB database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Step 3: Insert records into the database
    for (let record of records) {
      const query = `
        INSERT INTO TableNameTBD (
          item_type, 
          order_priority, 
          order_date, 
          order_id, 
          units_sold, 
          unit_price, 
          unit_cost, 
          total_revenue, 
          total_cost, 
          total_profit
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      // Extract values from the record
      const values = [
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
      await connection.execute(query, values);
    }
    console.log('Data loaded successfully!');
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    await connection.end();
  }
};

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