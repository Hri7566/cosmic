/**
 * COSMIC PROJECT
 *
 * Data module
 *
 * Database connection loader and data interface
 */

import { ObjectID } from "bson";
import { Collection, Db } from "mongodb";
import { CosmicAPI } from "./api/CosmicAPI";

/**
 * Global module imports
 */

import { MongoClient, Document } from "mongodb";

/**
 * Local module imports
 */

import { CosmicLogger, green } from "./CosmicLogger";
import { APIKeyProfile, Inventory, User, Item } from "./util/CosmicTypes";
import { env } from "./util/env";

/**
 * Module-level declarations
 */

const { MONGODB_CONNECTION_URI, MONGODB_DATABASE } = env;

const DEFAULT_BALANCE = 10;
const DEFAULT_EXPERIENCE = 0;
const DEFAULT_INVENTORY = [];

class CosmicData {
    public static client = new MongoClient(MONGODB_CONNECTION_URI);
    public static logger = new CosmicLogger("Cosmic Data", green);

    public static db: Db;
    public static users: Collection<User>;
    public static permissions: Collection;
    public static inventories: Collection<Inventory>;
    public static items: Collection<Item>;
    public static util: Collection;
    public static apiKeyProfiles: Collection<APIKeyProfile>;

    /**
     * Connect to database services and initialize
     */
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
        } catch (err) {
            this.logger.error(`Unable to connect to database:`, err);
            process.exit();
        } finally {
            // await this.client.close();
        }
    }

    /**
     * Disconnect from database
     */
    public static async stop() {
        this.logger.log("Stopping...");
        await this.client.close();
        this.logger.log("Stopped.");
    }

    /**
     * Remove all users from collection
     */
    public static async purgeUsers() {
        this.logger.warn("Purging all users...");
        await this.users.deleteMany(undefined);
    }

    /**
     * Remove all inventories from collection
     */
    public static async purgeInventories() {
        this.logger.warn("Purging all inventories...");
        await this.inventories.deleteMany(undefined);
    }

    /**
     * Insert a user into collection
     * @param user User to insert
     * @returns Operation result or error
     */
    public static async insertUser(user: User) {
        try {
            const result = await this.users.insertOne(user);

            return result;
        } catch (err) {
            return err;
        }
    }

    /**
     * Update a user's data
     * @param _id User ID
     * @param user User data to modify
     * @returns Operation result or error
     */
    public static async updateUser(_id: string, user: User) {
        try {
            const result = await this.users.updateOne(
                { _id },
                {
                    $set: user
                }
            );

            return result;
        } catch (err) {
            return err;
        }
    }

    /**
     * Replace a user's data
     * @param _id User ID
     * @param user User data to replace with
     * @returns Operation result or error
     */
    public static async replaceUser(_id: string, user: User) {
        try {
            const result = await this.users.replaceOne({ _id }, user);

            return result;
        } catch (err) {
            return err;
        }
    }

    /**
     * Delete a user from collection
     * @param _id User ID
     * @returns Operation result or error
     */
    public static async deleteUser(_id: string) {
        try {
            const result = await this.users.deleteOne({ _id: _id });

            return result;
        } catch (err) {
            return err;
        }
    }

    /**
     * Get a user's data
     * @param _id User ID
     * @returns Operation result or error
     */
    public static async getUser(_id: string) {
        try {
            const result = await this.users.findOne({ _id: _id });

            return result;
        } catch (err) {
            return err;
        }
    }

    /**
     * Create a group profile for a user
     * @param _id User ID
     * @param groups List of initialized groups
     * @returns Operation result or error
     */
    public static async createGroupProfile(_id: string, groups?: string[]) {
        try {
            const result = await this.permissions.insertOne({
                _id: _id as unknown as ObjectID,
                groups: groups || ["default"]
            });

            return result;
        } catch (err) {
            return err;
        }
    }

    /**
     * Add a user to a group
     * @param _id User ID
     * @param group Group ID
     * @returns Operation result or error
     */
    public static async addGroup(_id: string, group: string) {
        try {
            const result = await this.permissions.updateOne(
                { _id },
                {
                    $push: { groups: group }
                }
            );

            return result;
        } catch (err) {
            return err;
        }
    }

    /**
     * Remove a user from a group
     * @param _id User ID
     * @param group Group ID
     * @returns Operation result or error
     */
    public static async removeGroup(_id: string, group: string) {
        try {
            const result = await this.permissions.updateOne(
                { _id },
                {
                    $pull: { groups: group }
                }
            );

            return result;
        } catch (err) {
            return err;
        }
    }

    /**
     * Get groups that a user is in
     * @param _id User ID
     * @returns List of groups
     */
    public static async getGroups(_id: string) {
        return await this.permissions.findOne({ _id });
    }

    /**
     * Create an inventory document for a user
     * @param _id User ID
     * @param balance Starting balance
     * @param items Starting inventory
     * @returns Operation result or error
     */
    public static async createInventory(
        _id: string,
        balance?: number,
        items?: Array<Item>
    ) {
        try {
            const result = await this.inventories.insertOne({
                _id: _id,
                balance: balance || DEFAULT_BALANCE,
                items: items || DEFAULT_INVENTORY,
                experience: DEFAULT_EXPERIENCE
            });

            return result;
        } catch (err) {
            return err;
        }
    }

    /**
     * Test if a user has an item
     * @param _id User ID
     * @param item_id Item ID
     * @returns Boolean or operation error
     */
    public static async hasItem(
        _id: string,
        item_id: string
    ): Promise<boolean | Error> {
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
        } catch (err) {
            this.logger.error(err);
            return err;
        }
    }

    /**
     * Find an item in a user's inventory
     * @param _id User ID
     * @param item_id Item ID
     * @returns Item or operation error
     */
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
        } catch (err) {
            this.logger.error(err);
            return err;
        }
    }

    /**
     * Add an item to a user's inventory
     * @param _id User ID
     * @param item Item
     * @returns Operation result or error
     */
    public static async addItem(_id: string, item: Item) {
        try {
            if (await this.hasItem(_id, item.id)) {
                // console.debug('already has item');
                let res = await this.inventories.updateOne(
                    {
                        _id,
                        "items.id": item.id
                    },
                    {
                        $inc: {
                            "items.$.count": item.count
                        }
                    }
                );
                return res;
            }
            const result = await this.inventories.updateOne(
                { _id },
                {
                    $push: {
                        items: item
                    }
                }
            );

            return result;
        } catch (err) {
            this.logger.error(err);
            return err;
        }
    }

    /**
     * Remove an item from a user's inventory
     * @param _id User ID
     * @param item_id Item ID
     * @returns Operation result or error
     */
    public static async removeItem(_id: string, item_id: string) {
        try {
            let result = await this.inventories.updateOne(
                {
                    _id
                },
                {
                    $pull: {
                        items: {
                            id: item_id
                        }
                    }
                }
            );

            return result;
        } catch (err) {
            return err;
        }
    }

    /**
     * Remove a specific amount of an item from a user's inventory
     * @param _id User ID
     * @param item_id Item ID
     * @param amount Amount to remove
     * @returns Operation result or error
     */
    public static async removeOneItem(
        _id: string,
        item_id: string,
        amount: number = 1
    ) {
        try {
            if (await this.hasItem(_id, item_id)) {
                let it = await this.findItem(_id, item_id);
                if (it.count > 1) {
                    let res = await this.inventories.updateOne(
                        {
                            _id,
                            "items.id": item_id
                        },
                        {
                            $inc: {
                                "items.$.count": -amount
                            }
                        }
                    );

                    return res;
                } else {
                    let res = await this.removeItem(_id, item_id);
                    return res;
                }
            } else {
                throw new Error(`Inventory does not have item`);
            }
        } catch (err) {
            return err;
        }
    }

    /**
     * Get a user's inventory profile
     * @param _id User ID
     * @returns Operation result or error
     */
    public static async getInventory(_id: string): Promise<Inventory> {
        try {
            const result = await this.inventories.findOne({ _id: _id });
            return result;
        } catch (err) {
            return err;
        }
    }

    /**
     * Set the sellability of an item in a user's inventory
     * @param item_id Item ID
     * @param sellable Whether item should be sold or not
     * @returns Operation result as boolean
     */
    public static async setExistingItemSellable(
        item_id: string,
        sellable: boolean
    ): Promise<boolean> {
        try {
            let res = await this.inventories.updateMany(
                { "items.id": item_id },
                { $set: { "item.$.sellable": sellable } } as any
            );

            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Format balance information into a string
     * @param bal Balance amount
     * @param currency Currency sign
     * @param before Whether or not the sign is placed before or after the amount
     * @param fixate Number of decimal places
     * @returns Formatted balance string
     */
    // public static formatBalance(bal: number, currency: string = " star bits", before: boolean = false, fixate: number = 0) {
    public static formatBalance(
        bal: number,
        currency: string = " star bits",
        before: boolean = false,
        fixate: number = 0
    ) {
        if (before) {
            return `${currency}${bal.toFixed(fixate)}`;
        } else {
            return `${bal.toFixed(fixate)}${currency}`;
        }
    }

    /**
     * Get a user's balance
     * @param _id User ID
     * @returns Balance or operation error
     */
    public static async getBalance(_id: string) {
        try {
            let inv: Inventory = await this.getInventory(_id);
            return inv.balance;
        } catch (err) {
            return err;
        }
    }

    /**
     * Add to a user's balance (or remove with negative)
     * @param _id User ID
     * @param amount Amount to add to balance
     * @returns Operation error
     */
    public static addBalance(_id: string, amount: number) {
        try {
            this.inventories.updateOne(
                { _id },
                {
                    $inc: {
                        balance: amount
                    }
                }
            );
        } catch (err) {
            return err;
        }
    }

    /**
     * Set a user's balance to a specific amount
     * @param _id User ID
     * @param amount Amount to set balance to
     * @returns Operation result or error
     */
    public static async setBalance(_id: string, amount: number) {
        try {
            let res = await this.inventories.updateOne(
                { _id },
                {
                    $set: {
                        balance: amount
                    }
                }
            );
            return res;
        } catch (err) {
            return err;
        }
    }

    public static async getExperience(_id: string) {
        try {
            let inv: Inventory = await this.getInventory(_id);

            if (!inv.experience) {
                this.setExperience(_id, DEFAULT_EXPERIENCE);
            }

            return inv.experience;
        } catch (err) {
            return err;
        }
    }

    public static async setExperience(_id: string, amount: number) {
        try {
            let res = await this.inventories.updateOne(
                { _id },
                {
                    $set: {
                        experience: amount
                    }
                }
            );

            return res;
        } catch (err) {
            return err;
        }
    }

    /**
     * Set a utility value
     * @param key Utility key
     * @param value Utility value
     * @param _id Document ID
     * @returns Operation result or error
     */
    public static async utilSet(key: string, value: any, _id: string = "util") {
        try {
            try {
                await this.util.insertOne({
                    _id: _id as unknown as ObjectID,
                    [key]: value
                });
            } catch (err) {}
            let res = await this.util.updateOne(
                { _id },
                {
                    $set: {
                        [key]: value,
                        lastUpdated: Date.now()
                    }
                }
            );
            return res;
        } catch (err) {
            return err;
        }
    }

    /**
     * Get a utility value
     * @param key Utility key
     * @param _id Document ID
     * @returns Utility value or operation error
     */
    public static async utilGet(key: string, _id: string = "util") {
        try {
            let res = await this.util.findOne({ _id });
            return res[key];
        } catch (err) {
            return undefined;
        }
    }

    /**
     * Get the balance leaderboard object
     * @returns List of inventories sorted by highest balance
     */
    public static async getTopBalances() {
        try {
            let res = await this.inventories.find().sort({ balance: -1 });
            return res;
        } catch (err) {
            return undefined;
        }
    }

    /**
     * Create an API key profile
     * @param ip IP address
     * @param keys Initial API keys
     * @param permissions List of permissions
     * @param permissionGroups List of permission groups
     * @param user_id User ID
     * @returns Operation result as boolean
     */
    public static async createAPIKeyProfile(
        ip: string,
        keys: string[] = [],
        permissions: string[] = [],
        permissionGroups: string[] = ["default"],
        user_id?: string
    ): Promise<boolean> {
        try {
            let profile: APIKeyProfile = {
                ip,
                keys,
                permissions,
                user_id,
                permissionGroups
            };
            this.apiKeyProfiles.insertOne(profile);
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Get an API key profile
     * @param ip IP address
     * @returns API key profile
     */
    public static async getAPIKeyProfile(ip: string): Promise<APIKeyProfile> {
        try {
            let res = await this.apiKeyProfiles.findOne({ ip });
            if (!res) {
                await this.createAPIKeyProfile(ip);
                return await this.apiKeyProfiles.findOne({ ip });
            }
            return res;
        } catch (err) {
            return undefined;
        }
    }

    /**
     * Add an API key to an API key profile
     * @param ip IP address
     * @param key API key to add
     * @returns Operation result as boolean
     */
    public static async addAPIKey(ip: string, key: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne(
                { ip },
                {
                    $push: { keys: key }
                }
            );

            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Get an API key profile by a linked user ID
     * @param _id User ID
     * @returns API key profile
     */
    public static async getAPIKeyProfileByUserID(_id: string) {
        try {
            let res = await this.apiKeyProfiles.findOne({ user_id: _id });
            return res;
        } catch (err) {
            return;
        }
    }

    /**
     * Remove an API key from an API key profile
     * @param ip IP address
     * @param key API key
     * @returns Operation result as boolean
     */
    public static async removeAPIKey(
        ip: string,
        key: string
    ): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne(
                { ip },
                {
                    $pull: {
                        keys: key
                    }
                }
            );

            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Remove every API key from an API key profile
     * @param ip IP address
     * @returns Operation result as boolean
     */
    public static async removeAllAPIKeys(ip: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne(
                { ip },
                {
                    $set: {
                        keys: []
                    }
                }
            );

            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Get all API keys in an API key profile
     * @param ip IP address
     * @returns List of API keys
     */
    public static async getAPIKeys(ip: string): Promise<string[]> {
        try {
            let res = await this.apiKeyProfiles.findOne({ ip });
            return res.keys;
        } catch (err) {
            return;
        }
    }

    /**
     * Add a permission to an API key profile
     * @param ip IP address
     * @param permission Permission to add
     * @returns Operation result as boolean
     */
    public static async addAPIPermission(
        ip: string,
        permission: string
    ): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne(
                { ip },
                {
                    $push: {
                        permissions: permission
                    }
                }
            );

            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Remove a permission from an API key profile
     * @param ip IP address
     * @param permission Permission to remove
     * @returns Operation result as boolean
     */
    public static async removeAPIPermission(
        ip: string,
        permission: string
    ): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne(
                { ip },
                {
                    $pull: {
                        permissions: permission
                    }
                }
            );

            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Remove every permission from an API key profile
     * @param ip IP address
     * @returns Operation result as boolean
     */
    public static async removeAllAPIPermissions(ip: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne(
                { ip },
                {
                    $set: {
                        permissions: []
                    }
                }
            );

            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Add a permission group to an API key profile
     * @param ip IP address
     * @param permissionGroupID ID of permission group
     * @returns Operation result as boolean
     */
    public static async addAPIPermissionGroup(
        ip: string,
        permissionGroupID: string
    ): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne(
                { ip },
                {
                    $push: {
                        permissionGroups: permissionGroupID
                    }
                }
            );

            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Remove a permission group from an API key profile
     * @param ip IP address
     * @param permissionGroupID ID of permission group
     * @returns Operation result as boolean
     */
    public static async removeAPIPermissionGroup(
        ip: string,
        permissionGroupID: string
    ): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne(
                { ip },
                {
                    $pull: {
                        permissionGroups: permissionGroupID
                    }
                }
            );

            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Remove all permission groups from an API key profile
     * @param ip IP address
     * @returns Operation result as boolean
     */
    public static async removeAllAPIPermissionGroups(
        ip: string
    ): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne(
                { ip },
                {
                    $set: {
                        permissionGroups: []
                    }
                }
            );

            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Get all permission groups in an API key profile
     * @param ip IP address
     * @returns List of permission groups or undefined
     */
    public static async getAPIPermissionGroups(ip: string): Promise<string[]> {
        try {
            let res = await this.apiKeyProfiles.findOne({ ip });
            return res.permissionGroups;
        } catch (err) {
            return;
        }
    }

    /**
     * Get all permissions of an API key profile (not including groups)
     * @param ip IP address
     * @returns Permissions of API key profile
     */
    public static async getAPIPermissions(ip: string): Promise<any[]> {
        try {
            let res = await this.apiKeyProfiles.findOne({ ip });
            return res.permissions;
        } catch (err) {
            return;
        }
    }

    /**
     * Link an API key profile with a user ID
     * @param ip IP address
     * @param userID User ID
     * @returns Operation result as boolean
     */
    public static async setAPIUserID(
        ip: string,
        userID: string
    ): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne(
                { ip },
                {
                    $set: {
                        user_id: userID
                    }
                }
            );

            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Get the user ID linked with an API key profile
     * @param ip IP address
     * @returns User ID or undefined
     */
    public static async getAPIUserID(ip: string): Promise<string> {
        try {
            let res = await this.apiKeyProfiles.findOne({ ip });
            return res.user_id;
        } catch (err) {
            return;
        }
    }

    /**
     * Unlink a user ID from an API key profile
     * @param ip IP address
     * @returns Operation result as boolean
     */
    public static async removeAPIUserID(ip: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne(
                { ip },
                {
                    $unset: {
                        user_id: ""
                    }
                }
            );
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Set the IP of an API key profile
     * @param ip Old IP address
     * @param new_ip New IP address
     * @returns Operation result as boolean
     */
    public static async setAPIIP(ip: string, new_ip: string): Promise<boolean> {
        try {
            let res = await this.apiKeyProfiles.updateOne(
                { ip },
                {
                    $set: {
                        ip: new_ip
                    }
                }
            );

            return true;
        } catch (err) {
            return false;
        }
    }

    public static async getStats(): Promise<Document> {
        try {
            let res = await this.db.stats();
            return res;
        } catch (err) {
            console.error(err);
        }
    }
}

/**
 * Module-level exports
 */

export { CosmicData };
