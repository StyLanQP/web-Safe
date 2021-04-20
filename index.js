const app = require('./app/app.js');
const hack = require('./hack/app.js');

const chalk = require('chalk');

app.listen(4000, () => {
    console.log(chalk.yellow('正常网站启动成功' + 4000))
})

hack.listen(5000, () => {
    console.log(chalk.red('黑客网站启动成功' + 5000))
})