#include <iostream>
#include <fstream>
#include "Solution.cpp"

int main() {
    try {
        std::ifstream inputFile("Cpp/input.txt");  // Adjust the path based on your project structure
        Solution calculator; // Create an instance of the Solution class

        int output[10];

        for (int i = 0; i < 10; i++) {
            int num1, num2;
            inputFile >> num1 >> num2;

            int sum = calculator.addition(num1, num2);

            output[i] = sum;
        }

        for (int i = 0; i < 10; i++) {
            std::cout << output[i] << std::endl;
        }

        inputFile.close();
    } catch (const std::ifstream::failure& e) {
        std::cerr << "Exception opening/reading input file" << std::endl;
        return 1; // Exit with an error code
    }

    return 0; // Exit with success code
}
