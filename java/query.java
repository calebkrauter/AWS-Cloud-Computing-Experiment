//Should follow the algorithmic idea of query.ts AS CLOSELY AS POSSIBLE

package java;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import io.github.cdimascio.dotenv.Dotenv;

public class query {
        // Load environment variables from .env file
    private static final Dotenv dotenv = Dotenv.load();
    
    // Database configuration (using .env values)
    private static final String DB_HOST = dotenv.get("DB_HOST");
    private static final String DB_USER = dotenv.get("DB_USER");
    private static final String DB_PASSWORD = dotenv.get("DB_PASSWORD");
    private static final String DB_NAME = dotenv.get("DB_NAME");

    // JDBC URL format for MySQL
    private static final String DB_URL = "jdbc:mysql://" + DB_HOST + "/" + DB_NAME;

    // Method to fetch all data (joined from both Order and Item tables)
    public static void fetchData() {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            // SQL query to fetch data
            String query = "SELECT * FROM `Order` JOIN Item ON `Order`.Item_Type = Item.Item_Type";
            
            try (Statement stmt = connection.createStatement()) {
                ResultSet rs = stmt.executeQuery(query);
                
                // Process the results
                while (rs.next()) {
                    System.out.println("Order ID: " + rs.getInt("Order_ID"));
                    System.out.println("Item Type: " + rs.getString("Item_Type"));
                    // Add other columns as needed
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Method to fetch aggregated data (e.g., total revenue by item type)
    public static void fetchAggregatedData() {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            // SQL query to fetch aggregated data
            String query = "SELECT Item.Item_Type, SUM(Item.Total_Revenue) AS Total_Revenue " +
                           "FROM Item GROUP BY Item.Item_Type";
            
            try (Statement stmt = connection.createStatement()) {
                ResultSet rs = stmt.executeQuery(query);
                
                // Process the results
                while (rs.next()) {
                    String itemType = rs.getString("Item_Type");
                    double totalRevenue = rs.getDouble("Total_Revenue");
                    System.out.println("Item Type: " + itemType + " | Total Revenue: " + totalRevenue);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        // Fetch all data
        fetchData();
        
        // Fetch aggregated data
        fetchAggregatedData();
    }
}
