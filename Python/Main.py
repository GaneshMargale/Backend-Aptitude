from Solution import Solution

if __name__ == "__main__":
    try:
        with open("Python/input.txt", "r") as file:
            q = Solution()

            output = [0] * 3

            for i in range(3):
                num1, num2 = map(int, file.readline().split())
                sum_result = q.addition(num1, num2)
                output[i] = sum_result

            for result in output:
                print(result)

    except FileNotFoundError as e:
        print(e)
