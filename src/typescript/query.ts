import mysql from 'mysql2/promise'; // Using promise-based API for async/await
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Database configuration (using .env values)
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined, // Convert to number
};

// Function to fetch all data (joined from both Order and Item tables)
export async function fetchData() {
  let connection;
  try {
    // Establish connection to the database
    connection = await mysql.createConnection(dbConfig);

    // Query to select all data from both tables
    const [results, fields] = await connection.execute(`
      SELECT * 
      FROM \`Order\` 
      JOIN Item ON \`Order\`.Item_Type = Item.Item_Type;
    `);

    // Log the retrieved data (optional)
    console.log('Data retrieved:', results);

    // Return the data in JSON format
    return { success: true, data: results };

  } catch (err) {
    console.error('Error executing query', err);

    // Return an error message in JSON format
    return { success: false, error: err };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Function to fetch aggregated data (e.g., total revenue by item type)
export async function fetchAggregatedData() {
  let connection;
  try {
    // Establish connection to the database
    connection = await mysql.createConnection(dbConfig);

    // Execute the query to aggregate data
    const [results, fields] = await connection.execute(`
      SELECT Item.Item_Type, SUM(Item.Total_Revenue) AS Total_Revenue
      FROM Item
      GROUP BY Item.Item_Type;
    `);

    // Log the aggregated data (optional)
    console.log('Aggregated Data:', results);

    // Return the aggregated data as JSON
    return { success: true, data: results };

  } catch (err) {
    console.error('Error executing query', err);

    // Return an error message in JSON format
    return { success: false, error: err };

  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
