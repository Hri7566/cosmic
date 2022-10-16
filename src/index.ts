/**
 *   .    .     *       .      *    * .       *        .  *
 * .    *        .   *           .    *     .    .         
 *   .     *   __|   _ \    __|   \  | _ _|   __|     *   .
 * .          (     (   | \__ \  |\/ |   |   (     *    .  
 *     . *   \___| \___/  ____/ _|  _| ___| \___|    .    *
 *   .       .  *       . *        *    .     *        .   
 * .   .   *     .  *      .     *    .         .  *   .  *
 * 
 * COSMIC PROJECT
 *
 * AUTHOR: Hri7566
 * START DATE: Sun Jul 31 06:17:45 2022 -0400
 * DESCRIPTION: Bot as a service for multiple platforms
 */

process.stdout.write('\x1b[35m\n\n');
process.stdout.write('  .    .     *       .      *    * .       *        .  *     \n');
process.stdout.write('.    *        .   *           .    *     .    .              \n');
process.stdout.write('  .     *   __|   _ \\    __|   \\  | _ _|   __|     *   .   \n');
process.stdout.write('.          (     (   | \\__ \\  |\\/ |   |   (     *    .    \n');
process.stdout.write('    . *   \\___| \\___/  ____/ _|  _| ___| \\___|    .    *  \n');
process.stdout.write('  .       .  *       . *        *    .     *        .        \n');
process.stdout.write('.   .   *     .  *      .     *    .         .  *   .  *     \n');
process.stdout.write('\x1b[0m\n\n');

console.log('Loading Cosmic...');

require('dotenv').config();

import { CosmicLogger, white } from './CosmicLogger';

const logger = new CosmicLogger('Cosmic Root', white);

// let logger = new CosmicLogger('Cosmic Root', white);
// logger.log("This class works.");
// logger.error("This is an error.");
// logger.warn("This is a warning.");
// logger.debug("This is a debug message.");

import { Cosmic } from './Cosmic';
// process.stdout.write("Starting Cosmic...\n");

logger.log('Cosmic loaded, initializing services...');
Cosmic.start();

// setTimeout(() => {
//     Cosmic.stop();
// });

// TODO fix sigint handle
process.on('SIGINT', () => {
    process.stdout.write('\n');
    Cosmic.stop();
    process.exit(0);
});

process.stdin.on('data', d => {
    let str = d.toString().split('\n').join(' ').trim();
    // console.log(str);
    
    if (str.toLowerCase() == 'stop') {
        Cosmic.stop();
        process.exit(0);
    }
});
