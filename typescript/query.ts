import mysql from 'mysql2/promise'; // Using promise-based API for async/await

// Define the database connection configuration once
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Function to fetch all data using SELECT *
export async function fetchData() {
  let connection;
  try {
    // Establish connection
    connection = await mysql.createConnection(dbConfig);

    // Execute the SELECT query
    const [results, fields] = await connection.execute('SELECT * FROM sales_data');

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
      // Close the connection
      await connection.end();
    }
  }
}

// Function to fetch filtered data (e.g., by Item Type)
export async function fetchFilteredData(itemType: string) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [results, fields] = await connection.execute('SELECT * FROM sales_data WHERE Item_Type = ?', [itemType]);
    console.log(`Filtered Data (Item_Type = ${itemType}):`);
    console.log(results);
  } catch (err) {
    console.error('Error executing query', err);
  } finally {
    if (connection) await connection.end();
  }
}

// Function to fetch aggregated data (e.g., total revenue by Item Type)
export async function fetchAggregatedData() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [results, fields] = await connection.execute(
      'SELECT Item_Type, SUM(Total_Revenue) AS Total_Revenue FROM sales_data GROUP BY Item_Type'
    );
    console.log('Aggregated Data (Total Revenue by Item Type):');
    console.log(results);
  } catch (err) {
    console.error('Error executing query', err);
  } finally {
    if (connection) await connection.end();
  }
}
