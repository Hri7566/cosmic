require('dotenv').config();

import { Cosmic } from './Cosmic';
process.stdout.write("Starting Cosmic...");
Cosmic.start();

process.stdin.on('data', d => {
    console.log(d.toString());
});
