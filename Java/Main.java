import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(new File("C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java\\input.txt"));

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
        }
    }
}

