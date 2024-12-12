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


export const loadJSONtoDB = async () => {
  // Step 1: Read the transformed JSON file
  //const jsonFilePath = path.resolve(__dirname, '../../data/transformed_100_TS.json');
  const jsonFilePath = path.resolve(__dirname, 'transformed_100_TS.json');
  const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
  //const jsonData = fs.readFileSync('/Users/corey/Documents/School/462/project/AWS-Cloud-Computing-Experiment/data/transformed_100_TS.json', 'utf-8');

  // Parse the JSON data
  const records = JSON.parse(jsonData); // Expects an array of objects

  // Step 2: Connect to the AWS RDS MySQL/MariaDB database
  console.log(process.env.DB_HOST);
  console.log(process.env.DB_USER);
  console.log(process.env.DB_PASSWORD);
  console.log(process.env.DB_NAME);
  console.log(process.env.DB_PORT);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
  
  console.log("connected to db successfully");

  try {
    // Step 3: Insert records into the database
    
    // Forcefully restart the DB (MUST USE ON LAMBDA FOR TESTING A FRESH STATE)
    const refresh = `
    DROP DATABASE db
    ;`;
    await connection.execute(refresh);

    const createQuery = `
      CREATE DATABASE IF NOT EXISTS db;
      `;
    await connection.execute(createQuery);
    await connection.changeUser({ database: 'db' }); // Preferred over `USE` in application code

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS sales (
        item_type         VARCHAR(32)     NOT NULL,
        order_priority    VARCHAR(1)      NOT NULL,
        order_date        VARCHAR(32)     NOT NULL,
        order_id          BIGINT          NOT NULL    PRIMARY KEY,
        units_sold        BIGINT          NOT NULL,
        unit_price        DECIMAL(10,2)   NOT NULL,
        unit_cost         DECIMAL(10,2)   NOT NULL,
        total_revenue     DECIMAL(10,2)     NOT NULL,
        total_cost        DECIMAL(10,2)     NOT NULL,
        total_profit      DECIMAL(10,2)     NOT NULL
      );`;
    await connection.execute(createTableQuery);

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

