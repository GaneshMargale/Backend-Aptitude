import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;

public class Main {
    public static void main(String[] args) {
        try {
            // Read input from the file
            Scanner scanner = new Scanner(new File("Java/input.txt"));

            // Create an array to store the output
            int[] output = new int[3]; // Assuming 3 lines of output based on your example

            // Loop through each line of input and perform the required logic
            for (int i = 0; i < 3; i++) {
                int num1 = scanner.nextInt();
                int num2 = scanner.nextInt();

                // Perform the required logic (in this case, addition)
                int sum = num1 + num2;

                // Store the result in the output array
                output[i] = sum;
            }

 for (int i = 0; i < 3; i++) {
                System.out.println(output[i]);
            }

            // Close the scanner
            scanner.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }
}
