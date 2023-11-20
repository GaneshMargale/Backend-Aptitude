const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fs = require('fs');
const { spawn } = require('child_process');
const CodeSnippet = require('../Models/codeSnippetsModel');
const TestCases = require('../Models/testModel');

exports.runProgram = catchAsync(async (req, res, next) => {
  const language = req.params.language;
  const qNumber = req.params.qNumber;

  const main = await CodeSnippet.findOne({
    contestNumber: req.params.contestNumber,
    [`starterCode.${qNumber - 1}.${language}`]: {
      $exists: true,
    },
  });

  console.log(main.starterCode[qNumber - 1][language]);
  // if (main) {
  //   // Code snippet exists
  //   console.log('Code snippet found:', main);
  // } else {
  //   // Code snippet does not exist
  //   console.log('Code snippet not found');
  // }

  if (!main) {
    return next(new AppError('File not found', 404));
  }

  const solutionfilePath = `C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java\\Solution.java`;
  const mainFilePath =
    'C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java\\Main.java';

  try {
    fs.writeFileSync(mainFilePath, main.starterCode[qNumber - 1][language]);
    fs.writeFileSync(solutionfilePath, req.body.solution, 'utf-8');

    const javacProcess = spawn('javac', [mainFilePath, solutionfilePath]);

    javacProcess.stdout.on('data', (data) => {
      console.log(`Compilation output: ${data}`);
    });

    javacProcess.stderr.on('data', (data) => {
      console.error(`Compilation error: ${data}`);
    });

    javacProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Compilation completed successfully.');

        const mainClass = 'Main';
        const classpath =
          'C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java';
        const javaProcess = spawn('java', ['-cp', classpath, mainClass]);

        javaProcess.stdout.on('data', (data) => {
          console.log(`Java program output: ${data}`);
        });

        javaProcess.stderr.on('data', (data) => {
          console.error(`Error running Java program: ${data}`);
        });

        javaProcess.on('close', (code) => {
          if (code === 0) {
            console.log('Java program execution complete.');
          } else {
            console.error(`Java program execution exited with code ${code}`);
          }
        });
      } else {
        console.error(`Compilation exited with code ${code}`);
      }
    });
    res.status(200).json({
      status: 'success',
      message: 'File successfully updated.',
    });
  } catch (error) {
    console.error(error);
    return next(new AppError('Error writing to file', 500));
  }
});

// const APIFeatures = require('../utils/apiFeatures');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// const fs = require('fs');
// const { spawn } = require('child_process');
// const CodeSnippet = require('../Models/codeSnippetsModel');
// const TestCases = require('../Models/testModel');

// // Run Java program and test
// exports.runProgram = catchAsync(async (req, res, next) => {
//   const language = req.params.language;
//   const qNumber = req.params.qNumber;

//   // Find the code snippet for the specified contest, question, and language
//   const main = await CodeSnippet.findOne({
//     contestNumber: req.params.contestNumber,
//     [`starterCode.${qNumber - 1}.${language}`]: {
//       $exists: true,
//     },
//   });

//   if (!main) {
//     return next(new AppError('File not found', 404));
//   }

//   // Find the test cases for the specified question
//   const test = await TestCases.findOne({
//     questionNumber: qNumber,
//   });

//   // Paths for Java files and input file
//   const solutionFilePath =
//     'C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java\\Solution.java';
//   const mainFilePath =
//     'C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java\\Main.java';
//   const inputFilePath =
//     'C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java\\input.txt';

//   try {
//     // Write the code snippet to the Main.java file
//     fs.writeFileSync(mainFilePath, main.starterCode[qNumber - 1][language]);

//     // Write the user solution to the Solution.java file
//     fs.writeFileSync(solutionFilePath, req.body.solution, 'utf-8');

//     // Create the input file for test cases
//     createInputFile(inputFilePath, test.testCases);

//     // Compile and run the Java program
//     compileAndRunJava(
//       mainFilePath,
//       solutionFilePath,
//       inputFilePath,
//       test.testCases,
//       res
//     );
//   } catch (error) {
//     console.error(error);
//     return next(new AppError('Error writing to file', 500));
//   }
// });

// // Create input file based on test cases
// function createInputFile(inputFilePath, testCases) {
//   let inputContent = '';

//   testCases.forEach((testCase) => {
//     const testInput = testCase.testInput
//       .map((input) => input.toString())
//       .join(' ');
//     inputContent += `${testInput}\n`;
//   });

//   fs.writeFileSync(inputFilePath, inputContent, 'utf-8');

//   console.log('Input file created:', inputFilePath);
// }

// // Compile and run the Java program
// // ...

// // Compile and run the Java program
// // ...
// // ...

// // Compile and run the Java program
// function compileAndRunJava(
//   mainFilePath,
//   solutionFilePath,
//   inputFilePath,
//   testCases,
//   res
// ) {
//   const mainClass = 'Main';
//   const classpath = 'C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java';
//   const javaProcess = spawn('java', ['-cp', classpath, mainClass]);

//   let output = '';
//   let testCaseIndex = 0;

//   javaProcess.stdout.on('data', (data) => {
//     output += data.toString();

//     // Check if the current output contains a newline character
//     if (output.includes('\n')) {
//       // Split the output by newline characters
//       const outputLines = output.split('\n');

//       // Iterate through each output line
//       outputLines.forEach((line) => {
//         // Compare the output with the current test case
//         const testFailed = compareOutputWithTestCase(
//           line,
//           testCases[testCaseIndex],
//           res
//         );

//         // Increment the test case index only if the test case hasn't failed
//         if (!testFailed) {
//           testCaseIndex++;
//         }
//       });

//       // Reset the output variable
//       output = '';
//     }
//   });

//   javaProcess.stderr.on('data', (data) => {
//     console.error(`Error running Java program: ${data}`);
//     // Respond with a failure status to the client
//     res.status(500).json({
//       status: 'error',
//       message: 'Error running Java program',
//     });

//     // Kill the Java process
//     javaProcess.kill();
//   });

//   javaProcess.on('close', (code) => {
//     if (code === 0) {
//       console.log('Java program execution complete.');
//     } else {
//       console.error(`Java program execution exited with code ${code}`);
//     }

//     // Respond with a success status to the client only if no test case has failed
//     if (testCaseIndex === testCases.length) {
//       res.status(200).json({
//         status: 'success',
//         message: 'File successfully updated.',
//       });
//     }
//   });

//   // Pipe input file to the Java process
//   const inputReadStream = fs.createReadStream(inputFilePath);

//   // Handle the end of the input stream
//   inputReadStream.on('end', () => {
//     // Close the input stream, which should trigger the 'close' event on the Java process
//     inputReadStream.close();
//   });

//   inputReadStream.pipe(javaProcess.stdin);
// }

// // ...

// // Compare Java program output with the current test case
// function compareOutputWithTestCase(output, testCase, res) {
//   const expectedOutput = testCase.testOutput
//     .map((output) => output.toString())
//     .join(' ');

//   if (output.trim() === expectedOutput.trim()) {
//     console.log(
//       `Test case passed. Expected: ${expectedOutput}, Actual: ${output}`
//     );
//     return false; // Test case passed
//   } else {
//     console.error(
//       `Test case failed. Expected: ${expectedOutput}, Actual: ${output}`
//     );

//     // Respond with a failure status to the client
//     res.status(400).json({
//       status: 'fail',
//       message: `Test case failed. Expected: ${expectedOutput}, Actual: ${output}`,
//     });

//     return true; // Test case failed
//   }
// }
