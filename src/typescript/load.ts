// import fs from 'fs';
// import path from 'path';
// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();


const loadJSONtoDB = async () => {
  // Step 1: Read the transformed JSON file
  const jsonFilePath = path.resolve(__dirname, '../../data/transformed_100_ts.json');
  const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
  
  // Parse the JSON data
  const records = JSON.parse(jsonData); // Expects an array of objects

  // Step 2: Connect to the AWS RDS MySQL/MariaDB database
  console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);
console.log(process.env.DB_PORT);

  const connection = await mysql.createConnection({ //This is causing the issue ECONNREFUSED
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  try {
    // Step 3: Insert records into the database
    
    const createQuery = `
      CREATE DATABASE IF NOT EXISTS db;
      USE db;
      `;
    //await connection.execute(createQuery);

    const createTableQuery = `
      CREATE TABLE sales (
        item_type         VARCHAR(32)     NOT NULL        PRIMARY KEY,
        order_priority    VARCHAR(1)      NOT NULL,
        order_date        VARCHAR(32)     NOT NULL,
        order_id          BIGINT          NOT NULL,
        units_sold        BIGINT          NOT NULL,
        unit_price        DECIMAL(10,2)   NOT NULL,
        unit_cost         DECIMAL(10,2)   NOT NULL,
        total_revenue     DECIMAL(10,2)     NOT NULL,
        total_cost        DECIMAL(10,2)     NOT NULL,
        total_profit      DECIMAL(10,2)     NOT NULL
      );`;
    //await connection.execute(createTableQuery);

    for (let record of records) {
      const query = `
        INSERT INTO sales (
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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
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

