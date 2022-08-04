require('dotenv').config();

import { Cosmic } from './Cosmic';
console.log("Starting Cosmic...");
Cosmic.start();

process.stdin.on('data', d => {
    console.log(d.toString());
});
