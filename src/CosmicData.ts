/**
 * COSMIC PROJECT
 * 
 * Data module
 */

const { MongoClient } = require('mongodb');

const { CosmicLogger, green } = require('./CosmicLogger');
const { User, Inventory } = require('./CosmicTypes');

const MONGODB_CONNECTION_URI = process.env.MONGODB_CONNECTION_URI;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

class CosmicData {
    public static client = new MongoClient(MONGODB_CONNECTION_URI);
    public static logger = new CosmicLogger('Cosmic Data', green);

    public static db;
    public static users;
    public static permissions;
    public static inventories;
    public static items;

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

            this.logger.log(`Connected to database '${MONGODB_DATABASE}'`);
        } catch (err) {
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
        await this.users.deleteMany();
    }

    public static async purgeInventories() {
        this.logger.warn("Purging all inventories...");
        await this.inventories.deleteMany();
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
        } catch (err) {
            return err;
        }
    }

    public static async replaceUser(_id: string, user: typeof User) {
        try {
            const result = await this.users.replaceOne({ _id }, user);

            return result;
        } catch (err) {
            return err;
        }
    }

    public static async deleteUser(_id: string) {
        try {
            const result = await this.users.deleteOne({ _id: _id });

            return result;
        } catch (err) {
            return err;
        }
    }

    public static async createGroupProfile(_id: string, groups?: string[]) {
        try {
            const result = await this.permissions.insertOne({
                _id: _id,
                groups: groups || [ 'default' ]
            });

            return result;
        } catch(err) {
            return err;
        }
    }

    public static async addGroup(_id: string, group: string) {
        try {
            const result = await this.permissions.updateOne({
                $push: { "groups": group }
            });

            return result;
        } catch (err) {
            return err;
        }
    }

    public static async removeGroup(_id: string, group: string) {
        try {
            const result = await this.permissions.updateOne({
                $pull: { "groups": group }
            });

            return result;
        } catch (err) {
            return err;
        }
    }

    public static async getGroups(_id: string) {
        return await this.permissions.findOne({ _id });
    }
}

export {
    CosmicData
}
