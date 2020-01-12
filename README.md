# FuzzerApp

FuzzerApp is a NodeJs application to generate a set of characters configured by standard input

### Config

FuzzerApp has a config file at ./config.js

| Variable | Meaning |
| ------ | ------ |
| maximumWords | The muximum number of words generated when user selects this option |
| maximumLength | The maximum length of each word generated |
| maximumSeconds | The muximum time when user selects this option |
| fileName | The output file name of the program |

### Installation
FuzzerApp requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and start the server.
```sh
$ cd fuzzerApp
$ npm install
$ npm start
```