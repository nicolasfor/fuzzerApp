const fs = require('fs');
const config = require('./config')
var marked = require('marked');
var TerminalRenderer = require('marked-terminal');

marked.setOptions({
    // Define custom renderer
    renderer: new TerminalRenderer()
});


const { maximumWords, maximumLength, maximumSeconds, fileName } = config
const question = require('./util/asyncQuestion')

const questionMaxLength = async () => {
    return new Promise(async (resolve, reject) => {
        const answer = await question(`What maximum length of string do you prefer (less than ${maximumLength} and greater than 0)?`);
        const number = Number(answer)
        if (number && number <= maximumLength && number > 0) {
            resolve(number)
        }
        else {
            reject(`Invalid time, must be greater than 0 and less than ${maximumLength}`)
        }
    })
}
const questionTimeOrWords = async () => {
    return new Promise(async (resolve, reject) => {
        const answer = await question("What do you prefer?: \n [1] Set a given timeout \n [2] Set a number of words");
        let option = Number(answer);
        switch (option) {
            case 1:
                resolve(1)
                break;
            case 2:
                resolve(2)
                break;

            default: {
                console.log(`Invalid input. Taking option [1] by default`)
                resolve(1)
                break;
            }
        }
    })
}

const questionTime = async () => {
    return new Promise(async (resolve, reject) => {
        const answer = await question(`For how long do you want to generate words in seconds (less than ${maximumSeconds} and greater than 0)?`);
        let option = Number(answer);
        if (option > 0 && option <= maximumSeconds) {
            resolve(option);
        }
        else
            reject(`Invalid time, must be greater than 0 and less than ${maximumSeconds} seconds`)
    })
}

const questionNumWords = async () => {
    return new Promise(async (resolve, reject) => {
        const answer = await question(`How many words do you want (less than ${maximumWords} and greater than 0)?`);
        let option = Number(answer);
        if (option > 0 && option < maximumWords) {
            resolve(option);
        }
        else
            reject(`Invalid number of words, must be greater than 0 and less than ${maximumWords}`)
    })
}

const generateWord = (maxLength) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~';
    const charactersLength = characters.length;
    for (var i = 0; i < maxLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const generateFile = (words) => {
    fs.writeFile(`${fileName}.txt`, words.join('\n'), (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(`Successfuly created file ${fileName} in ${__dirname}/${fileName}.txt`);
        }
    })
}

const timeWord = (time, maxLength) => {

    let running = true;
    const words = [];
    let startDate = new Date();
    console.log(`Running for ${time} seconds`);
    while (running) {
        let currentDate = new Date()
        words.push(generateWord(maxLength));
        if (((currentDate.getTime() - startDate.getTime()) / 1000) >= time) {
            running = false;
        }
    }
    console.log("Finished");
    generateFile(words)
};
const wordsNumber = (number, maxLength) => {
    const words = [];
    console.log("Running...");
    for (var i = 0; i < number; i++) {
        words.push(generateWord(maxLength));
    }
    console.log("Finished");
    generateFile(words);
};



const init = async () => {
    try {
        const maxLength = await questionMaxLength();
        const timerOrNumWords = await questionTimeOrWords();
        if (timerOrNumWords === 1) {
            const time = await questionTime();
            timeWord(time, maxLength);
        }
        else {
            const numberOfWords = await questionNumWords();
            wordsNumber(numberOfWords, maxLength);
        }
    }
    catch (error) {
        console.log('error: ', error);
        console.log("----------------------------------------------------------------");
        console.log("Restarting program");
        console.log("----------------------------------------------------------------");
        init();
    }

}

// Show the parsed data
fs.readFile('./README.md', "utf8", (err, data) => {
    if (err) throw err;
    console.log(marked(data));
    console.log("----------------------------------------------------------------");
    console.log("Let's start!");
    console.log("----------------------------------------------------------------");
    init();
});