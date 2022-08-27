/**
 *   .    .     *       .      *    * .       *        .  *
 * .    *        .   *           .    *     .    .         
 *   .     *   __|   _ \    __|   \  | _ _|   __|     *   .
 * .          (     (   | \__ \  |\/ |   |   (     *    .  
 *     . *   \___| \___/  ____/ _|  _| ___| \___|    .    *
 *   .       .  *       . *        *    .     *        .   
 *     .   *     .  *      .     *    .         .  *   .  *
 * 
 * COSMIC PROJECT
 * Conceptual Objectified Sustainable Management-level Information Controller
 * 
 * AUTHOR: Hri7566
 * START DATE: Sun Jul 31 06:17:45 2022 -0400
 */

require('dotenv').config();

import { CosmicLogger, white } from './CosmicLogger';

process.stdin.on('data', d => {
    let str = d.toString().split('\n').join(' ').trim();
    // console.log(str);
});

// let logger = new CosmicLogger('Cosmic Root', white);
// logger.log("This class works.");
// logger.error("This is an error.");
// logger.warn("This is a warning.");
// logger.debug("This is a debug message.");

import { Cosmic } from './Cosmic';
// process.stdout.write("Starting Cosmic...\n");

const logger = new CosmicLogger('Cosmic Root', white);

logger.log("Loading Cosmic...");
Cosmic.start();

setTimeout(() => {
    Cosmic.stop();
});
