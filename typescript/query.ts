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

    // Log the retrieved data
    console.log('Data retrieved:');
    console.log(results);

    // Log the field names
    console.log('Field Names:');
    fields.forEach(field => console.log(field.name));

  } catch (err) {
    console.error('Error executing query', err);
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
    connection = await mysql.createConnection(dbConfig);
    const [results, fields] = await connection.execute(`
      SELECT Item.Item_Type, SUM(Item.Total_Revenue) AS Total_Revenue
      FROM Item
      GROUP BY Item.Item_Type;
    `);
    console.log('Aggregated Data (Total Revenue by Item Type):');
    console.log(results);
  } catch (err) {
    console.error('Error executing query', err);
  } finally {
    if (connection) await connection.end();
  }
}
