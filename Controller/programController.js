const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fs = require('fs');
const { spawn } = require('child_process');
const CodeSnippet = require('../Models/codeSnippetsModel');

exports.runProgram = catchAsync(async (req, res, next) => {
  const language = req.params.language;
  const qNumber = req.params.qNumber;

  const main = await CodeSnippet.findOne({
    contestNumber: req.params.contestNumber,
    [`staterFiles.${language}.${qNumber}`]: {
      $exists: true,
    },
  });

  const starter = await CodeSnippet.findOneAndUpdate(
    {
      contestNumber: req.params.contestNumber,
      [`staterFiles.${language}.${qNumber}`]: {
        $exists: true,
      },
    },
    {
      $set: {
        [`staterFiles.${language}.${qNumber}`]: req.body.q1,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!starter) {
    return next(new AppError('File not found', 404));
  }

  const codeSnippet = req.body.q1;

  const match = codeSnippet.match(/class (\w+)/);
  const className = match[1];
  const filePath = `C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java\\${className}.java`;
  const mainFilePath =
    'C:\\Users\\Asus\\OneDrive\\Desktop\\Aptitude-DSA\\Java\\Main.java';

  try {
    fs.writeFileSync(mainFilePath, main.mainFiles[language][qNumber]);
    fs.writeFileSync(filePath, starter.staterFiles[language][qNumber], 'utf-8');

    const javacProcess = spawn('javac', [mainFilePath, filePath]);

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
