const concurrently = require('concurrently');
const path = require("path")
const { result } = concurrently(
  [
    'npm:watch-*',
    { command: 'echo Starting...', name: 'server' },
    { command: 'cd ./Routes-Controllers', name: 'server' },
    { command: 'npm start', name: 'deploy'},
  ],
  {
    prefix: 'name',
    killOthers: ['failure', 'success'],
    restartTries: 3,
    cwd: path.resolve(__dirname, 'scripts'),
  },
);
// result.then(success, failure);
console.log(result);