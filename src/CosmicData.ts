/**
 * COSMIC PROJECT
 * 
 * Data module
 */

import { ObjectID } from "bson";
import { Collection } from "mongodb";
import { CosmicAPI } from "./CosmicAPI";
import { Cosmic, Inventory } from "./CosmicTypes";

/**
 * Global module imports
 */
const { MongoClient } = require('mongodb');

/**
 * Local module imports
 */
const { CosmicLogger, green } = require('./CosmicLogger');
const { User, Inventory, Item } = require('./CosmicTypes');

/**
 * Module-level declarations
 */

const MONGODB_CONNECTION_URI = process.env.MONGODB_CONNECTION_URI;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

const DEFAULT_BALANCE = 10;
const DEFAULT_INVENTORY = [];

class CosmicData {
    public static client = new MongoClient(MONGODB_CONNECTION_URI);
    public static logger = new CosmicLogger('Cosmic Data', green);

    public static db;
    public static users: Collection;
    public static permissions: Collection;
    public static inventories: Collection;
    public static items: Collection;
    public static util: Collection;
    public static apiKeyProfiles: Collection<Cosmic.APIKeyProfile>;

    public static async start(): Promise<void> {
        this.logger.log("Connecting to database...");

        try {
            await this.client.connect();
            this.db = await this.client.db(MONGODB_DATABASE);
            
            await this.db.command({
                ping: 1
            });

            this.users = await this.db.collection("users");
            this.inventories = await this.db.collection("inventories");
            this.items = await this.db.collection("items");
            this.permissions = await this.db.collection("permissions");
            this.util = await this.db.collection("util");
            this.apiKeyProfiles = await this.db.collection("apikeyprofiles");

            this.logger.log(`Connected to database '${MONGODB_DATABASE}'`);
        } catch(err) {
            this.logger.error(err);
        } finally {
            // await this.client.close();
        }
    }

    public static async stop() {
        this.logger.log("Stopping...");
        await this.client.close();
        this.logger.log("Stopped.");
    }

    public static async purgeUsers() {
        this.logger.warn("Purging all users...");
        await this.users.deleteMany(undefined);
    }

    public static async purgeInventories() {
        this.logger.warn("Purging all inventories...");
        await this.inventories.deleteMany(undefined);
    }

    public static async insertUser(user: typeof User) {
        try {
            const result = await this.users.insertOne(user);

            return result;
        } catch(err) {
            return err;
        }
    }

    public static async updateUser(_id: string, user: typeof User) {
        try {
            const result = await this.users.updateOne({ _id }, {
                $set: user
            });

            return result;
        } catch(err) {
            return err;
        }
    }

    public static async replaceUser(_id: string, user: typeof User) {
        try {
            const result = await this.users.replaceOne({ _id }, user);

            return result;
        } catch(err) {
            return err;
        }
    }

    public static async deleteUser(_id: string) {
        try {
            const result = await this.users.deleteOne({ _id: _id });

            return result;
        } catch(err) {
            return err;
        }
    }

    public static async getUser(_id: string) {
        try {
            const result = await this.users.findOne({ _id: _id });

            return result;
        } catch(err) {
            return err;
        }
    }

    public static async createGroupProfile(_id: string, groups?: string[]) {
        try {
            const result = await this.permissions.insertOne({
                _id: _id as unknown as ObjectID,
                groups: groups || [ 'default' ]
            });

            return result;
        } catch(err) {
            return err;
        }
    }

    public static async addGroup(_id: string, group: string) {
        try {
            const result = await this.permissions.updateOne({ _id }, {
                $push: { "groups": group }
            });

            return result;
        } catch(err) {
            return err;
        }
    }

    public static async removeGroup(_id: string, group: string) {
        try {
            const result = await this.permissions.updateOne({ _id }, {
                $pull: { "groups": group }
            });

            return result;
        } catch(err) {
            return err;
        }
    }

    public static async getGroups(_id: string) {
        return await this.permissions.findOne({ _id });
    }

    public static async createInventory(_id: string, balance?: number, items?: Array<typeof Item>) {
        try {
            const result = await this.inventories.insertOne({
                _id: _id as unknown as ObjectID,
                balance: balance || DEFAULT_BALANCE,
                items: items || DEFAULT_INVENTORY
            });

            return result;
        } catch(err) {
            return err;
        }
    }

    public static async hasItem(_id: string, item_id: string) {
        try {
            const response = await this.inventories.findOne({
                _id
            });

            if (response) {
                for (let it of response.items) {
                    if (it.id == item_id) {
                        return true;
                    }
                }
            } else {
                return false;
            }
        } catch(err) {
            this.logger.error(err);
            return err;
        }
    }

    public static async findItem(_id: string, item_id: string) {
        try {
            const response = await this.inventories.findOne({
                _id
            });

            if (response) {
                for (let it of response.items) {
                    if (it.id == item_id) {
                        return it;
                    }
                }
            }
        } catch(err) {
            this.logger.error(err);
            return err;
        }
    }

    public static async addItem(_id: string, item: typeof Item) {
        try {
            if (await this.hasItem(_id, item.id)) {
                // console.debug('already has item');
                let res = await this.inventories.updateOne({
                    _id,
                    "items.id": item.id
                }, {
                    $inc: {
                        'items.$.count': item.count
                    }
                });
                return res;
            }
            const result = await this.inventories.updateOne({ _id }, {
                $push: {
                    items: item
                }
            });

            return result;
        } catch(err) {
            this.logger.error(err);
            return err;
        }
    }

    public static async removeItem(_id: string, item_id: string) {
        try {
            let result = await this.inventories.updateOne({
                _id
            }, {
                $pull: {
                    items: {
                        id: item_id
                    }
                }
            });

            return result;
        } catch(err) {
            return err;
        }
    }

    public static async removeOneItem(_id: string, item_id: string, amount: number = 1) {
        try {
            if (await this.hasItem(_id, item_id)) {
                let it = await this.findItem(_id, item_id);
                if (it.count > 1) {
                    let res = await this.inventories.updateOne({
                        _id,
                        "items.id": item_id
                    }, {
                        $inc: {
                            'items.$.count': -amount
                        }
                    });

                    return res;
                } else {
                    let res = await this.removeItem(_id, item_id);
                    return res;
                }
            } else {
                throw new Error(`Inventory does not have item`);
            }
        } catch(err) {
            return err;
        }
    }

    public static async getInventory(_id: string): Promise<typeof Inventory> {
        try {
            const result = await this.inventories.findOne({ _id: _id });
            return result;
        } catch(err) {
            return err;
        }
    }

    public static formatBalance(bal: number, currency: string = " star bits", before: boolean = false, fixate: number = 0) {
        if (before) {
            return `${currency}${bal.toFixed(fixate)}`;
        } else {
            return `${bal.toFixed(fixate)}${currency}`;
        }
    }
    
    public static async getBalance(_id: string) {
        try {
            let inv: Inventory = await this.getInventory(_id);
            return inv.balance;
        } catch(err) {
            return err;
        }
    }

    public static addBalance(_id: string, amount: number) {
        try {
            this.inventories.updateOne({ _id }, {
                $inc: {
                    balance: amount
                }
            })
        } catch(err) {
            return err;
        }
    }

    public static setBalance(_id: string, amount: number) {
        try {
            let res = this.inventories.updateOne({ _id }, {
                $set: {
                    balance: amount
                }
            });
            return res;
        } catch(err) {
            return err;
        }
    }

    public static async utilSet(key: string, value: any, _id: string = 'util') {
        try {
            try {
                await this.util.insertOne({
                    _id: _id as unknown as ObjectID,
                    [key]: value
                });
            } catch(err) {};
            let res = await this.util.updateOne({ _id }, {
                $set: {
                    [key]: value,
                    lastUpdated: Date.now()
                }
            });
            return res;
        } catch(err) {
            return err;
        }
    }

    public static async utilGet(key: string, _id: string = 'util') {
        try {
            let res = await this.util.findOne({ _id });
            return res[key];
        } catch(err) {
            return undefined;
        }
    }

    public static async getTopBalances() {
        try {
            let res = await (this.inventories.find().sort({ 'balance': -1 }));
            return res;
        } catch(err) {
            return undefined;
        }
    }

    public static async createAPIKeyProfile(ip: string, keys: string[] = [], permissions: string[] = [], permissionGroups: string[] = [ 'default' ], user_id?: string): Promise<boolean> {
        try {
            let profile: Cosmic.APIKeyProfile = { ip, keys, permissions, user_id, permissionGroups };
            this.apiKeyProfiles.insertOne(profile);
            return true;
        } catch(err) {
            return false;
        }
    }

    public static async getAPIKeyProfile(ip: string): Promise<Cosmic.APIKeyProfile> {
        try {
            let res = await this.apiKeyProfiles.findOne({ ip });
            if (!res) {
                await this.createAPIKeyProfile(ip);
                return await this.apiKeyProfiles.findOne({ ip });
            }
            return res;
        } catch(err) {
            return undefined;
        }
    }

    public static async addAPIKey(ip: string, key: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne({ ip }, {
                $push: { keys: key }
            });

            return true;
        } catch(err) {
            return false;
        }
    }

    public static async getAPIKeyProfileByUserID(_id: string) {
        try {
            let res = await this.apiKeyProfiles.findOne({ user_id: _id });
            return res;
        } catch(err) {
            return;
        }
    }

    public static async removeAPIKey(ip: string, key: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne({ ip }, {
                $pull: {
                    keys: key
                }
            });
        } catch(err) {
            return false;
        }
    }

    public static async removeAllAPIKeys(ip: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne({ ip }, {
                $set: {
                    keys: []
                }
            });

            return true;
        } catch(err) {
            return false;
        }
    }

    public static async getAPIKeys(ip: string): Promise<string[]> {
        try {
            let res = await this.apiKeyProfiles.findOne({ ip });
            return res.keys;
        } catch(err) {
            return;
        }
    }

    public static async addAPIPermission(ip: string, permission: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne({ ip }, {
                $push: {
                    permissions: permission
                }
            });
            
            return true;
        } catch(err) {
            return false;
        }
    }

    public static async removeAPIPermission(ip: string, permission: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne({ ip }, {
                $pull: {
                    permissions: permission
                }
            });

            return true;
        } catch(err) {
            return false;
        }
    }

    public static async removeAllAPIPermissions(ip: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne({ ip }, {
                $set: {
                    permissions: []
                }
            });

            return true;
        } catch(err) {
            return false;
        }
    }

    public static async addAPIPermissionGroup(ip: string, permissionGroupID: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne({ ip }, {
                $push: {
                    permissionGroups: permissionGroupID
                }
            });

            return true;
        } catch(err) {
            return false;
        }
    }

    public static async removeAPIPermissionGroup(ip: string, permissionGroupID: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne({ ip }, {
                $pull: {
                    permissionGroups: permissionGroupID
                }
            });
            
            return true;
        } catch(err) {
            return false;
        }
    }

    public static async removeAllAPIPermissionGroups(ip: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne({ ip }, {
                $set: {
                    permissionGroups: []
                }
            });
            
            return true;
        } catch(err) {
            return false;
        }
    }

    public static async getAPIPermissionGroups(ip: string): Promise<string[]> {
        try {
            let res = await this.apiKeyProfiles.findOne({ ip });
            return res.permissionGroups;
        } catch(err) {
            return;
        }
    }

    public static async getAPIPermissions(ip: string): Promise<string[]> {
        try {
            let res = await this.apiKeyProfiles.findOne({ ip });
            return res.permissions;
        } catch(err) {
            return;
        }
    }

    public static async setAPIUserID(ip: string, userID: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne({ ip }, {
                $set: {
                    user_id: userID
                }
            });

            return true;
        } catch(err) {
            return false;
        }
    }

    public static async getAPIUserID(ip: string): Promise<string> {
        try {
            let res = await this.apiKeyProfiles.findOne({ ip });
            return res.user_id;
        } catch(err) {
            return;
        }
    }

    public static async removeAPIUserID(ip: string): Promise<boolean> {
        try {
            let res = this.apiKeyProfiles.updateOne({ ip }, {
                $unset: {
                    user_id: ''
                }
            });
            return true;
        } catch(err) {
            return false;
        }
    }

    public static async setAPIIP(ip: string, new_ip: string): Promise<boolean> {
        try {
            let res = this.apiKeyProfiles.updateOne({ ip }, {
                $set: {
                    ip: new_ip
                }
            });

            return true;
        } catch (err) {
            return false;
        }
    }
}

/**
 * Module-level exports
 */

export {
    CosmicData
}
