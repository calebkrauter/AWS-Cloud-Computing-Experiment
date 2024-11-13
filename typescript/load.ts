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

const loadCSVtoDB = async () => {
  // Step 1: Read the transformed CSV file
  const csvFilePath = path.resolve(__dirname, 'transformedData.csv');
  const csvData = fs.readFileSync(csvFilePath, 'utf-8');
  
  // Parse CSV data (basic splitting; consider using a CSV parser library for complex files)
  const rows = csvData.split('\n').map(row => row.split(','));

  // Step 2: Connect to the AWS RDS MySQL/MariaDB database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Step 3: Insert rows into the database
    for (let row of rows) {
      const query = `INSERT INTO your_table_name (column1, column2, ...) VALUES (?, ?, ...)`;
      await connection.execute(query, row);
    }
    console.log('Data loaded successfully!');
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    await connection.end();
  }
};

loadCSVtoDB().catch(console.error);