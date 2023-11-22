// const APIFeatures = require('../utils/apiFeatures');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// const fs = require('fs');
// const { spawn } = require('child_process');
// const CodeSnippet = require('../Models/codeSnippetsModel');
// const TestCases = require('../Models/testModel');

// exports.runProgram = catchAsync(async (req, res, next) => {
//   const language = req.params.language;
//   const qNumber = req.params.qNumber;

//   const main = await CodeSnippet.findOne({
//     contestNumber: req.params.contestNumber,
//     [`starterCode.${qNumber - 1}.${language}`]: {
//       $exists: true,
//     },
//   });

//   if (!main) {
//     return next(new AppError('File not found', 404));
//   }

//   const solutionfilePath = `C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java\\Solution.java`;
//   const mainFilePath =
//     'C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java\\Main.java';

//   try {
//     fs.writeFileSync(mainFilePath, main.starterCode[qNumber - 1][language]);
//     fs.writeFileSync(solutionfilePath, req.body.solution, 'utf-8');

//     const javacProcess = spawn('javac', [mainFilePath, solutionfilePath]);

//     javacProcess.stdout.on('data', (data) => {
//       console.log(`Compilation output: ${data}`);
//     });

//     javacProcess.stderr.on('data', (data) => {
//       console.error(`Compilation error: ${data}`);
//     });

//     javacProcess.on('close', (code) => {
//       if (code === 0) {
//         console.log('Compilation completed successfully.');

//         const mainClass = 'Main';
//         const classpath =
//           'C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java';
//         const javaProcess = spawn('java', ['-cp', classpath, mainClass]);

//         javaProcess.stdout.on('data', (data) => {
//           console.log(`Java program output: ${data}`);
//         });

//         javaProcess.stderr.on('data', (data) => {
//           console.error(`Error running Java program: ${data}`);
//         });

//         javaProcess.on('close', (code) => {
//           if (code === 0) {
//             console.log('Java program execution complete.');
//           } else {
//             console.error(`Java program execution exited with code ${code}`);
//           }
//         });
//       } else {
//         console.error(`Compilation exited with code ${code}`);
//       }
//     });
//     res.status(200).json({
//       status: 'success',
//       message: 'File successfully updated.',
//     });
//   } catch (error) {
//     console.error(error);
//     return next(new AppError('Error writing to file', 500));
//   }
// });

const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fs = require('fs');
const { spawn } = require('child_process');
const CodeSnippet = require('../Models/codeSnippetsModel');
const TestCases = require('../Models/testModel');

// Run Java program and test
exports.runProgram = catchAsync(async (req, res, next) => {
  const language = req.params.language;
  const qNumber = req.params.qNumber;

  const main = await CodeSnippet.findOne({
    contestNumber: req.params.contestNumber,
    [`starterCode.${qNumber - 1}.${language}`]: {
      $exists: true,
    },
  });

  if (!main) {
    return next(new AppError('File not found', 404));
  }

  const test = await TestCases.findOne({
    questionNumber: qNumber,
  });

  const solutionFilePath = __dirname + '\\..\\Java\\Solution.java';
  // 'C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java\\Solution.java';
  const mainFilePath = __dirname + '\\..\\Java\\Main.java';
  // 'C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java\\Main.java';
  const inputFilePath = __dirname + '\\..\\Java\\input.txt';
  // 'C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java\\input.txt';

  try {
    fs.writeFileSync(mainFilePath, main.starterCode[qNumber - 1][language]);
    fs.writeFileSync(solutionFilePath, req.body.solution, 'utf-8');
    createInputFile(inputFilePath, test.testCases);
    compileAndRunJava(
      mainFilePath,
      solutionFilePath,
      inputFilePath,
      test.testCases,
      res
    );
  } catch (error) {
    console.error(error);
    return next(new AppError('Error writing to file', 500));
  }
});

function createInputFile(inputFilePath, testCases) {
  let inputContent = '';

  testCases.forEach((testCase) => {
    const testInput = testCase.testInput
      .map((input) => input.toString())
      .join(' ');
    inputContent += `${testInput}\n`;
  });

  fs.writeFileSync(inputFilePath, inputContent, 'utf-8');
  console.log('Input file created:', inputFilePath);
}

function compileAndRunJava(
  mainFilePath,
  solutionFilePath,
  inputFilePath,
  testCases,
  res
) {
  const mainClass = 'Main';
  // const classpath = 'C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java';
  // const classpath = `${__dirname}/../../Java`;
  const classpath = __dirname + '\\..\\Java';

  console.log(classpath);
  const javaProcess = spawn('java', ['-cp', classpath, mainClass]);

  let output = '';
  let testResults = [];

  javaProcess.stdout.on('data', (data) => {
    output += data.toString();

    while (output.includes('\n')) {
      const index = output.indexOf('\n');
      const line = output.slice(0, index);
      output = output.slice(index + 1);

      const testResult = compareOutputWithTestCase(
        line,
        testCases[testResults.length]
      );

      testResults.push(testResult);

      if (testResults.length === testCases.length) {
        // All test cases processed, stop reading
        javaProcess.stdout.removeAllListeners('data');
        break;
      }
    }
  });

  javaProcess.stderr.on('data', (data) => {
    console.error(`Error running Java program: ${data}`);
    res.status(500).json({
      status: 'error',
      message: 'Error running Java program',
    });
    javaProcess.kill();
  });

  javaProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Java program execution complete.');
    } else {
      console.error(`Java program execution exited with code ${code}`);
    }

    if (testResults.length < testCases.length) {
      console.error('Not all test cases were processed.');
    }

    if (testResults.every((result) => result.passed)) {
      res.status(200).json({
        status: 'success',
        message: 'File successfully updated.',
      });
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'Some test cases failed.',
        results: testResults,
      });
    }
  });

  const inputReadStream = fs.createReadStream(inputFilePath);

  inputReadStream.on('end', () => {
    inputReadStream.close();
  });

  inputReadStream.pipe(javaProcess.stdin);
}

function compareOutputWithTestCase(output, testCase) {
  if (!testCase || !testCase.testOutput) {
    console.error(
      'Invalid test case structure or undefined testCase:',
      testCase
    );
    return {
      passed: false,
      expected: 'Invalid test case structure',
      actual: output,
    };
  }

  const expectedOutput = testCase.testOutput
    .map((output) => output.toString())
    .join(' ');

  if (output.trim() === expectedOutput.trim()) {
    console.log(
      `Test case passed. Expected: ${expectedOutput}, Actual: ${output}`
    );
    return { passed: true };
  } else {
    console.error(
      `Test case failed. Expected: ${expectedOutput}, Actual: ${output}`
    );
    return { passed: false, expected: expectedOutput, actual: output };
  }
}
