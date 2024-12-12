package java_awt;

import com.amazonaws.services.lambda.runtime.Context;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

public class Transform {

    public void handleRequest(String input, Context context) {
        Transform.main(new String[]{input});
    }

    public static void main(String[] args) {
        System.out.println("1");
        try {
            String filePath = Paths.get("dist/100_Sales_Records.csv").toAbsolutePath().toString();
            parseCSV(filePath);
            Load.loadJSONtoDB(); // Assuming this is from your previous Java file
            List<Map<String, Object>> result = fetchData();

            // Uncomment if you want aggregated data instead
            // List<Map<String, Object>> result = fetchAggregatedData();

            System.out.println("Result: " + result);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void parseCSV(String filePath) {
        List<Map<String, String>> results = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String headerLine = reader.readLine(); // Read the header row
            if (headerLine == null) {
                throw new IOException("CSV file is empty");
            }

            String[] headers = headerLine.split(",");
            String line;

            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",");
                Map<String, String> record = new HashMap<>();

                for (int i = 0; i < headers.length; i++) {
                    String header = headers[i].trim();
                    String value = values[i].trim();

                    // Skip unwanted fields
                    if (!header.equals("Region") && !header.equals("Country") && !header.equals("Sales Channel") && !header.equals("Ship Date")) {
                        record.put(header, value);
                    }
                }
                results.add(record);
            }

            Path outputPath = Paths.get("/tmp/transformed_100_TS.json").toAbsolutePath();
            Files.writeString(outputPath, toJSONString(results));

        } catch (IOException e) {
            System.err.println("Error while parsing CSV: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static String toJSONString(List<Map<String, String>> data) {
        StringBuilder json = new StringBuilder();
        json.append("[");

        for (int i = 0; i < data.size(); i++) {
            json.append("{\n");
            Map<String, String> record = data.get(i);
            List<String> fields = record.entrySet().stream()
                .map(entry -> String.format("  \"%s\": \"%s\"", entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
            json.append(String.join(",\n", fields));
            json.append("\n}");
            if (i < data.size() - 1) {
                json.append(",");
            }
        }

        json.append("\n]");
        return json.toString();
    }

    public static List<Map<String, Object>> fetchData() {
        // Mock implementation
        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> sample = new HashMap<>();
        sample.put("Key", "Value");
        result.add(sample);
        return result;
    }

    public static List<Map<String, Object>> fetchAggregatedData() {
        // Mock implementation
        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> sample = new HashMap<>();
        sample.put("AggregatedKey", "AggregatedValue");
        result.add(sample);
        return result;
    }
}

