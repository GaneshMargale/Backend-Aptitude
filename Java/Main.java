import java.nio.file.Paths;
import java.nio.file.Path;
import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;

public class Main {
    public static void main(String[] args) {
        try {
            // Get the path to the current class file
            Path currentClassPath = Paths.get(Main.class.getProtectionDomain().getCodeSource().getLocation().toURI()).toAbsolutePath();

            // Construct the full path to the input.txt file
            Path inputFilePath = currentClassPath.getParent().resolve("Java").resolve("input.txt");

            // Create a File object from the path
            File inputFile = inputFilePath.toFile();

            // Use Scanner to read from the file
            Scanner scanner = new Scanner(inputFile);

            while (scanner.hasNext()) {
                // Read each line from the input file
                String line = scanner.nextLine();

                // Split the line into individual inputs
                String[] inputs = line.split(" ");

                // Convert inputs to integers or appropriate data types
                int input1 = Integer.parseInt(inputs[0]);
                int input2 = Integer.parseInt(inputs[1]);

                // Use the inputs in your solution
                Solution q = new Solution();
                int result = q.addition(input1, input2);
                System.out.println(result);
            }

            scanner.close();
        } catch (FileNotFoundException e) {
            System.err.println("Input file not found.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
