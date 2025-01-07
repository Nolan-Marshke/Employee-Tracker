const { mainMenu } = require('./menu');

const startApp = async () => {
  console.log('Welcome to Employee Tracker!');
  await mainMenu();
};

startApp();
