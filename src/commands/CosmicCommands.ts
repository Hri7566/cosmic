/**
 * COSMIC PROJECT
 * 
 * Cosmic commands
 * 
 * Command logic for entire innards (complexity warning)
 */

/**
 * Global module imports
 */

const crypto = require('crypto');
import { evaluate, i } from 'mathjs';

/**
 * Local module imports
*/

import { CosmicCakeFactory } from '../cakes/CosmicCakeFactory';
import { CosmicShop } from '../shop/CosmicShop';
import { CosmicUtil } from '../util/CosmicUtil';
import { CosmicColor } from '../CosmicColor';
import { CosmicSeasonDetection } from '../util/CosmicSeasonDetection';
import { AnyItem, CommandMessage, Inventory, Item, ShopListing, User } from '../util/CosmicTypes';
import { CosmicData } from '../CosmicData';
import { ITEMS } from "../CosmicItems";
import { CosmicClient, CosmicClientAny } from '../CosmicClient';
import { CosmicFFI } from '../foreign/CosmicFFI';
import { CosmicWork } from '../work';
import { Command, CosmicCommandHandler } from '../CosmicCommandHandler';
import { Cosmic } from '../Cosmic';
import { CosmicExperience } from '../exp/CosmicExperience';

/**
 * Module-level declarations
 */

import './help';
import './about';
import './id';
import './color';
import './magic8ball';
import './groups';
import './bake';
import './stopbaking';
import './inventory';
import './balance';
import './wipeinv';
import './rcake';
import './addbal';
import './setbal';
import './breatheonnose';
import './js';
import './follow';
import './unfollow';
import './michael';
import './hellothere';
import './sh';
import './uptime';
import './eat';
import './eatallcakes';
import './removeitem';
import './memory';
import './season';
import './holiday';
import './shop';
import './buy';
import './sell';
import './leaderboard';
import './description';
import './math';
import './knockknockjoke';
import './addgroup';
import './removegroup';
import './additemcount';
import './screamdownears';
import './chandle';
import './work';
// import './level';
