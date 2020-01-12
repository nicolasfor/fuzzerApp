const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const asyncQuestion = async (question) => {
    return new Promise(resolve => {
        rl.question(`${question}\n`, function (answer) {
            resolve(answer);
        })
    });
}

module.exports = asyncQuestion;