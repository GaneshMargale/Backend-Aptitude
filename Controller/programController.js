const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fs = require('fs');
const { spawn } = require('child_process');
const CodeSnippet = require('../Models/codeSnippetsModel');
const TestCases = require('../Models/testModel');
const javaPath = `${__dirname}/../lib/Java/jdk-1.8/bin`;

function compareOutput(test, output) {
  if (!test || !test.length) {
    console.error('Invalid test object or empty test array.');
    return;
  }

  let outputResponse = [];
  const testOutputs = test.map((testCase) => testCase.testOutput);

  for (let index = 0; index < testOutputs.length; index++) {
    const expected = testOutputs[index];
    const actual = Number(output[index]);

    const isTestCaseCorrect = expected[0] === actual;
    const response = {
      TestCase: index + 1,
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
  const javacProcess = spawn(`${javaPath}/javac`, [
    mainFilePath,
    solutionFilePath,
  ]);

  javacProcess.on('close', (code) => {
    if (code !== 0) {
      return next(new AppError('Compliation failed: ' + code));
    }

    let output = [];
    let result;
    const classPath = `${__dirname}/../Java`;
    const javaProcess = spawn(`${javaPath}/java`, ['-cp', classPath, 'Main']);

    javaProcess.stdout.on('data', (data) => {
      const newData = data.toString().trim().split('\n');
      output.push(...newData);
      output = output.map((line) => line.replace(/\r?\n|\r/g, ''));
      result = compareOutput(test, output);
    });

    javaProcess.on('close', (code) => {
      if (code === 0) {
        res.status(200).json({
          status: 'success',
          message: 'Java program execution complete.',
          results: result,
        });
      } else {
        res.status(404).json({
          status: 'fail',
          message: `Java program execution exited with code ${code}`,
        });
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
  } catch (e) {}
});
