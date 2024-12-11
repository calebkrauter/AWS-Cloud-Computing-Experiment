package java_aws;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class query {

    private static final String DB_HOST = "db1.cpuaoc8mi90.us-east-1.rds.amazonaws.com";
    private static final String DB_USER = "admin";
    private static final String DB_PASSWORD = "PassCode1";
    private static final String DB_NAME = "db1";
    private static final String DB_PORT = "3306";
    // JDBC URL format for MySQL
    private static final String DB_URL = "jdbc:mysql://" + DB_HOST + "/" + DB_NAME;

    // Method to fetch all data (joined from both Order and Item tables)
    public static void fetchData() {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String query = "SELECT * FROM `Order` JOIN Item ON `Order`.Item_Type = Item.Item_Type";

            try (Statement stmt = connection.createStatement();
                 ResultSet rs = stmt.executeQuery(query)) {

                System.out.println("Data Retrieved:");
                while (rs.next()) {
                    System.out.println("Order ID: " + rs.getInt("Order_ID"));
                    System.out.println("Item Type: " + rs.getString("Item_Type"));
                    // Add more columns as needed
                }
            }
        } catch (SQLException e) {
            System.err.println("Error executing query: " + e.getMessage());
        }
    }

    // Method to fetch aggregated data (e.g., total revenue by item type)
    public static void fetchAggregatedData() {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String query = """
                    SELECT Item.Item_Type, SUM(Item.Total_Revenue) AS Total_Revenue
                    FROM Item
                    GROUP BY Item.Item_Type
                    """;

            try (Statement stmt = connection.createStatement();
                 ResultSet rs = stmt.executeQuery(query)) {

                System.out.println("Aggregated Data:");
                while (rs.next()) {
                    String itemType = rs.getString("Item_Type");
                    double totalRevenue = rs.getDouble("Total_Revenue");
                    System.out.println("Item Type: " + itemType + " | Total Revenue: " + totalRevenue);
                }
            }
        } catch (SQLException e) {
            System.err.println("Error executing query: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        System.out.println("Fetching All Data...");
        fetchData();

        System.out.println("\nFetching Aggregated Data...");
        fetchAggregatedData();
    }
}
