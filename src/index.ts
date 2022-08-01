require('dotenv').config();

import { Cosmic } from './Cosmic';
Cosmic.start();

import { Answer } from './interop';

process.stdin.on('data', d => {
    try {
        const j = JSON.parse(d.toString());
        const a = {
            number: j.number,
            roman: "easd",
            words: 'easdeasd'
        }

        process.stdout.write(JSON.stringify(a));
    } catch (err) {

    }
});
