import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(new File("Java/input.txt"));
            Solution q = new Solution();

            int[] output = new int[10];

            for (int i = 0; i < 10; i++) {
                int num1 = scanner.nextInt();
                int num2 = scanner.nextInt();

                int sum = q.addition(num1, num2);

                output[i] = sum;
            }

            for (int i = 0; i < 10; i++) {
                System.out.println(output[i]);
            }

            scanner.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }
}
