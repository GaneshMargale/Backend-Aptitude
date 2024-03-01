const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fs = require('fs'); // Use synchronous file operations
const { spawn } = require('child_process');
const TestCases = require('../Models/testModel');
const path = require('path');

const ProgramFilePath = path.join(__dirname, 'programs');

if (!fs.existsSync(ProgramFilePath)) {
  fs.mkdirSync(ProgramFilePath, { recursive: true });
}

function generateFile(format, name, content) {
  const filename = `${name}.${format}`;
  const filepath = path.join(ProgramFilePath, filename);
  fs.writeFileSync(filepath, content);
  return filepath;
}

function compareOutput(test, output) {
  if (!test.testCases || !test.testCases.length) {
    console.error('Invalid test object or empty test array.');
    throw new AppError('Internal server error', 500);
  }

  const testInputs = test.testCases.map((testInput) => testInput.testInput);
  const testOutputs = test.testCases.map((testCase) => testCase.testOutput);

  for (let index = 0; index < testOutputs.length; index++) {
    const expected = testOutputs[index];
    const inputs = testInputs[index];
    const actual = parseInt(output[index], 10); // Ensure to specify the radix (base 10)
    console.log(output);
    console.log(expected);
    const isTestCaseCorrect = expected.includes(actual);
    if (!isTestCaseCorrect) {
      const response = {
        Input: inputs,
        Expected: expected[0],
        Actual: actual,
        Result: isTestCaseCorrect,
      };

      return response;
    }
  }
  return 'Pass';
}

function createInputFile(test) {
  const testInputs = test.testCases.map((testCase) => testCase.testInput);

  const inputFilePath = generateFile(
    'txt',
    'Input',
    testInputs.map((input) => input.join(' ')).join('\n')
  );
  return inputFilePath;
}

function compileAndRun(mainFilePath, test, res) {
  const javaExecutablePath = path.join(__dirname, '..', 'jdk-19', 'bin');
  let responseSent = false;

  const javacProcess = spawn(path.join(javaExecutablePath, 'javac'), [
    mainFilePath,
  ]);

  javacProcess.stderr.on('data', (data) => {
    if (!responseSent) {
      res.status(500).json({
        status: 'error',
        message: `Compilation Error: ${data.toString()}`,
      });
      responseSent = true;
    }
  });

  javacProcess.on('close', (code) => {
    if (code !== 0) {
      if (!responseSent) {
        res.status(500).json({
          status: 'error',
          message: `Compilation failed with code ${code}`,
        });
        responseSent = true;
      }
    } else {
      try {
        let output = [];
        let result;
        const classPath = path.join(__dirname, '..', 'Java');
        const javaProcess = spawn(path.join(javaExecutablePath, 'java'), [
          '-cp',
          classPath,
          'Main',
        ]);

        javaProcess.stdout.on('data', (data) => {
          const newData = data.toString().trim().split('\n');
          console.log(newData);
          output.push(...newData);
          output = output.map((line) => line.replace(/\r?\n|\r/g, ''));

          result = compareOutput(test, output);
        });

        javaProcess.stderr.on('data', (data) => {
          if (!responseSent) {
            res.status(500).json({
              status: 'error',
              message: `Execution Error: ${data.toString()}`,
            });
            responseSent = true;
          }
        });

        javaProcess.on('close', (code) => {
          if (code === 0) {
            if (!responseSent) {
              res.status(200).json({
                status: 'success',
                message: 'Java program execution complete.',
                results: result,
              });
              responseSent = true;
            }
          } else {
            if (!responseSent) {
              res.status(404).json({
                status: 'fail',
                message: `Java program execution exited with code ${code}`,
              });
              responseSent = true;
            }
          }
        });
      } catch (e) {
        console.error(e);
        res.status(500).json({
          status: 'error',
          message: 'Internal Server Error',
        });
      }
    }
  });
}

exports.runProgram = catchAsync(async (req, res, next) => {
  const test = await TestCases.findOne({
    questionNumber: req.params.qNumber,
  });

  if (!test) {
    return res.status(404).json({
      status: 'fail',
      message: 'Test cases not found for the given question number.',
    });
  }

  let mainFilePath = '';
  let inputFilePath = '';

  try {
    mainFilePath = generateFile('java', 'Main', req.body.code);
    inputFilePath = createInputFile(test); // Await the result
    compileAndRun(mainFilePath, test, res);
  } catch (e) {
    console.error(e); // Log the error for debugging
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  } finally {
    try {
      // Delete temporary files after execution
      // fs.unlinkSync(mainFilePath);
      // fs.unlinkSync(inputFilePath);
    } catch (error) {
      console.error('Error cleaning up files:', error);
    }
  }
});
