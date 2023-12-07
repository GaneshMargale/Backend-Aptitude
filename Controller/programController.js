const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fs = require('fs');
const { spawn } = require('child_process');
const CodeSnippet = require('../Models/codeSnippetsModel');
const TestCases = require('../Models/testModel');

function compareOutput(test, output) {
  if (!test || !test.length) {
    throw new Error('Invalid test object or empty test array.');
  }

  let outputResponse = [];
  const testInputs = test.map((testInput) => testInput.testInput);
  const testOutputs = test.map((testCase) => testCase.testOutput);

  for (let index = 0; index < testOutputs.length; index++) {
    const expected = testOutputs[index];
    const inputs = testInputs[index];
    const actual = Number(output[index]);

    const isTestCaseCorrect = expected[0] === actual;
    const response = {
      TestCase: index + 1,
      Input: inputs,
      Expected: expected[0],
      Actual: actual,
      Result: isTestCaseCorrect ? 'Pass' : 'Fail',
    };

    outputResponse.push(response);
  }

  return outputResponse;
}

function createInputFile(test, inputFilePath) {
  const testInputs = test.testCases.map((testCase) => testCase.testInput);

  fs.writeFileSync(
    inputFilePath,
    testInputs.map((input) => input.join(' ')).join('\n')
  );
}

function complieAndRun(
  mainFilePath,
  solutionFilePath,
  inputFilePath,
  test,
  res
) {
  const javaExecutablePath = `${__dirname}/../lib/Java/jdk-1.8/bin`;
  let responseSent = false;

  const javacProcess = spawn(`${javaExecutablePath}/javac`, [
    mainFilePath,
    solutionFilePath,
  ]);

  javacProcess.stderr.on('data', (data) => {
    if (!responseSent) {
      res.status(500).json({
        status: 'error',
        message: `Compilation Error: ${data.toString()}`,
      });
    }
    responseSent = true;
  });

  javacProcess.on('close', (code) => {
    if (code !== 0) {
      if (!responseSent) {
        return res.status(500).json({
          status: 'error',
          message: `Compilation failed with code ${code}`,
        });
      }
      responseSent = true;
    }

    let output = [];
    let result;
    const classPath = `${__dirname}/../Java`;
    const javaProcess = spawn(`${javaExecutablePath}/java`, [
      '-cp',
      classPath,
      'Main',
    ]);

    javaProcess.stdout.on('data', (data) => {
      const newData = data.toString().trim().split('\n');
      output.push(...newData);
      output = output.map((line) => line.replace(/\r?\n|\r/g, ''));
      result = compareOutput(test, output);
    });

    javaProcess.stderr.on('data', (data) => {
      res.status(500).json({
        status: 'error',
        message: `Execution Error: ${data.toString()}`,
      });
    });

    javaProcess.on('close', (code) => {
      if (code === 0) {
        fs.unlinkSync(mainFilePath);
        fs.unlinkSync(solutionFilePath);
        fs.unlinkSync(inputFilePath);
        if (!responseSent) {
          res.status(200).json({
            status: 'success',
            message: 'Java program execution complete.',
            results: result,
          });
        }
        responseSent = true;
      } else {
        if (!responseSent) {
          res.status(404).json({
            status: 'fail',
            message: `Java program execution exited with code ${code}`,
          });
        }
        responseSent = true;
      }
    });
  });
}

exports.runProgram = catchAsync(async (req, res, next) => {
  const main = await CodeSnippet.findOne({
    contestNumber: req.params.contestNumber,
  });

  if (!main) {
    return next(new AppError('Contest not found', 404));
  }

  const test = await TestCases.findOne({
    questionNumber: req.params.qNumber,
  });

  const solutionFilePath = __dirname + '/../Java/Solution.java';
  const mainFilePath = __dirname + '/../Java/Main.java';
  const inputFilePath = __dirname + '/../Java/input.txt';

  try {
    fs.writeFileSync(
      mainFilePath,
      main.starterCode[req.params.qNumber - 1][req.params.language]
    );

    fs.writeFileSync(solutionFilePath, req.body.solution);

    createInputFile(test, inputFilePath);
    complieAndRun(
      mainFilePath,
      solutionFilePath,
      inputFilePath,
      test.testCases,
      res
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
});
