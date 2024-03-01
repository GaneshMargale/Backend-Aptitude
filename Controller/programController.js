const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fs = require('fs');
const { spawn } = require('child_process');
// const CodeSnippet = require('../Models/codeSnippetsModel');
const TestCases = require('../Models/testModel');
const path = require('path');

function compareOutput(test, output) {
  if (!test.testCases || !test.testCases.length) {
    throw new Error('Invalid test object or empty test array.');
  }
  let outputResponse = [];
  const testInputs = test.testCases.map((testInput) => testInput.testInput);
  const testOutputs = test.testCases.map((testCase) => testCase.testOutput);
  for (let index = 0; index < testOutputs.length; index++) {
    const expected = testOutputs[index];
    const inputs = testInputs[index];
    const actual = output[index];

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

async function compileAndRun(mainFilePath, test, res) {
  // const javaExecutablePath = `${__dirname}/../jdk-19/bin`;
  // const javaExecutablePath = path.join(__dirname, '..', 'jdk-19', 'bin');
  let responseSent = false;

  // const javacProcess = spawn(`${javaExecutablePath}/javac`, [mainFilePath]);
  // const javacProcess = spawn(path.join(javaExecutablePath, 'javac'), [
  //   mainFilePath,
  // ]);
  const javacProcess = spawn('javac', [mainFilePath]);

  javacProcess.stderr.on('data', (data) => {
    if (!responseSent) {
      res.status(500).json({
        status: 'error',
        message: `Compilation Error: ${data.toString()}`,
      });
      responseSent = true;
    }
  });

  javacProcess.on('close', async (code) => {
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
        // const classPath = `${__dirname}/../Java`;
        const classPath = path.join(__dirname, '..', 'Java');
        // const javaProcess = spawn(`${javaExecutablePath}/java`,
        // const javaProcess = spawn(path.join(javaExecutablePath, 'java'), [
        //   '-cp',
        //   classPath,
        //   'Main',
        // ]);
        const javaProcess = spawn('java', ['-cp', classPath, 'Main']);

        javaProcess.stdout.on('data', (data) => {
          const newData = data.toString().trim().split('\n');
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
            fs.unlinkSync(mainFilePath);
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
    console.error('Test case not found');
    return res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }

  // const mainFilePath = __dirname + '/../Java/Main.java';
  // const inputFilePath = __dirname + '/../Java/input.txt';

  const mainFilePath = path.join(__dirname, '..', 'Java', 'Main.java');
  const inputFilePath = path.join(__dirname, '..', 'Java', 'input.txt');
  try {
    fs.writeFileSync(mainFilePath, req.body.code);

    createInputFile(test, inputFilePath);
    await compileAndRun(mainFilePath, test, res);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
  // finally {
  //   try {
  //     // fs.unlinkSync(inputFilePath);
  //     // fs.unlinkSync(mainFilePath);
  //   } catch (error) {
  //     console.error('Error cleaning up files:', error);
  //   }
  // }
});

function compileAndRunCpp(mainFilePath, test, res) {
  // const cppCompilerPath = `${__dirname}/../MinGW/bin/g++`;
  let responseSent = false;

  // const compileProcess = spawn(cppCompilerPath, [
  //   mainFilePath,
  //   '-o',
  //   `${__dirname}/../Cpp/compiledProgram`,
  // ]);
  const compileProcess = spawn('g++', [
    mainFilePath,
    '-o',
    path.join(__dirname, '..', 'Cpp', 'compiledProgram'),
  ]);

  compileProcess.stderr.on('data', (data) => {
    if (!responseSent) {
      res.status(500).json({
        status: 'error',
        message: `Compilation Error: ${data.toString()}`,
      });
    }
    responseSent = true;
  });

  compileProcess.on('close', (code) => {
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

    // const cppExecutablePath = `${__dirname}/../Cpp/compiledProgram`;
    const cppExecutablePath = path.join(
      __dirname,
      '..',
      'Cpp',
      'compiledProgram'
    );
    const cppProcess = spawn(cppExecutablePath, []);

    cppProcess.stdout.on('data', (data) => {
      const newData = data.toString().trim().split('\n');
      output.push(...newData);
      output = output.map((line) => line.replace(/\r?\n|\r/g, ''));
      result = compareOutput(test, output);
    });

    cppProcess.stderr.on('data', (data) => {
      res.status(500).json({
        status: 'error',
        message: `Execution Error: ${data.toString()}`,
      });
    });

    cppProcess.on('close', (code) => {
      if (code === 0) {
        fs.unlinkSync(mainFilePath);
        // fs.unlinkSync(solutionFilePath);
        // fs.unlinkSync(inputFilePath);
        if (!responseSent) {
          res.status(200).json({
            status: 'success',
            message: 'C++ program execution complete.',
            results: result,
          });
        }
        responseSent = true;
      } else {
        if (!responseSent) {
          res.status(404).json({
            status: 'fail',
            message: `C++ program execution exited with code ${code}`,
          });
        }
        responseSent = true;
      }
    });
  });
}

exports.runProgramCpp = catchAsync(async (req, res, next) => {
  // const main = await CodeSnippet.findOne({
  //   contestNumber: req.params.contestNumber,
  // });

  // if (!main) {
  //   return next(new AppError('Contest not found', 404));
  // }

  const test = await TestCases.findOne({
    questionNumber: req.params.qNumber,
  });

  if (!test) {
    console.error('Test case not found');
    return res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }

  // const solutionFilePath = __dirname + '/../Cpp/Solution.cpp';
  // const mainFilePath = __dirname + '/../Cpp/Main.cpp';
  // const inputFilePath = __dirname + '/../Cpp/input.txt';

  const mainFilePath = path.join(__dirname, '..', 'Cpp', 'Main.cpp');
  const inputFilePath = path.join(__dirname, '..', 'Cpp', 'input.txt');

  try {
    // fs.writeFileSync(
    //   mainFilePath,
    //   main.starterCode[req.params.qNumber - 1][req.params.language]
    // );
    fs.writeFileSync(mainFilePath, req.body.code);

    // fs.writeFileSync(solutionFilePath, req.body.solution);

    createInputFile(test, inputFilePath);

    await compileAndRunCpp(mainFilePath, test, res);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
});

function runPythonProgram(mainFilePath, test, res) {
  let responseSent = false;

  // const pythonProcess = spawn(`${__dirname}/../iPython/python`, [mainFilePath]);
  const pythonProcess = spawn('python', [mainFilePath]);

  pythonProcess.stdout.on('data', (data) => {
    const output = data.toString().trim().split('\n');
    const result = compareOutput(test, output);

    if (!responseSent) {
      res.status(200).json({
        status: 'success',
        message: 'Python program execution complete.',
        results: result,
      });
    }
    responseSent = true;
  });

  pythonProcess.stderr.on('data', (data) => {
    if (!responseSent) {
      res.status(500).json({
        status: 'error',
        message: `Execution Error: ${data.toString()}`,
      });
    }
    responseSent = true;
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      fs.unlinkSync(mainFilePath);
      if (!responseSent) {
        res.status(404).json({
          status: 'fail',
          message: `Python program execution exited with code ${code}`,
        });
      }
      responseSent = true;
    }

    // fs.unlinkSync(mainFilePath);
    // fs.unlinkSync(solutionFilePath);
    // fs.unlinkSync(inputFilePath);
  });
}

exports.runProgramPython = catchAsync(async (req, res, next) => {
  // const main = await CodeSnippet.findOne({
  //   contestNumber: req.params.contestNumber,
  // });

  // if (!main) {
  //   return next(new AppError('Contest not found', 404));
  // }

  const test = await TestCases.findOne({
    questionNumber: req.params.qNumber,
  });

  if (!test) {
    console.error('Test case not found');
    return res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }

  // const solutionFilePath = `${__dirname}/../Python/Solution.py`;
  // const mainFilePath = `${__dirname}/../Python/Main.py`;
  // const inputFilePath = `${__dirname}/../Python/input.txt`;

  const mainFilePath = path.join(__dirname, '..', 'Python', 'Main.py');
  const inputFilePath = path.join(__dirname, '..', 'Python', 'input.txt');

  try {
    // fs.writeFileSync(
    //   mainFilePath,
    //   main.starterCode[req.params.qNumber - 1][req.params.language]
    // );
    fs.writeFileSync(mainFilePath, req.body.code);
    // fs.writeFileSync(solutionFilePath, req.body.solution);

    createInputFile(test, inputFilePath);

    runPythonProgram(mainFilePath, test.testCases, res);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
});
