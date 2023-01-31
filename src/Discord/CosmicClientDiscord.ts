import { CosmicClientToken } from "../CosmicClient";
import { CosmicForeignMessageHandler } from "../foreign/CosmicForeignMessageHandler";
import * as Discord from "discord.js";

// ANCHOR Discord client
export class CosmicClientDiscord extends CosmicClientToken {
    public platform: string = 'discord';
    public previousChannel: string;

    public client: Discord.Client;
    public cmapi;
    public rest: Discord.REST;

    constructor() {
        super();

        this.client = new Discord.Client({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.MessageContent,
                Discord.GatewayIntentBits.GuildMembers
            ]
        });

        this.bindEventListeners();
    }

    /**
     * Start Discord client
     * @param token Discord token
     */
    public start(token: string) {
        this.client.login(token);

        // setup REST for slash commands
        this.rest = new Discord.REST({ version: '10' }).setToken(token);
    }
    
    /**
     * Stop Discord client
     */
    public stop() {
        this.client.destroy();
    }

    /**
     * Send a chat message in the last channel (or desired channel by passing an ID)
     * @param str Message
     * @param channel Optional channel ID
     */
    public async sendChat(str: string, channel?: string, interaction?: Discord.ChatInputCommandInteraction): Promise<void> {
        if (!str) return;

        let special_chars = [
            '/',
            '\\',
            '*',
            '_',
            '>',
            '-'
        ];
        
        for (const char of special_chars) {
            str = str.split(char).join(`\\${char}`);
        }

        if (interaction) {
            if (interaction.isChatInputCommand()) {
                interaction.reply(`\u034f${str}`);
            }
        } else {
            try {
                if (channel) {
                    (await this.client.channels.cache.get(channel) as any).send(`\u034f${str}`);
                } else {
                    if (this.previousChannel) {
                        (await this.client.channels.cache.get(this.previousChannel) as any).send(`\u034f${str}`);
                    }
                }
            } catch (err) {
                this.logger.error('Unable to send chat message:', err);
            }
        }
    }

    protected bindEventListeners(): void {
        super.bindEventListeners();

        this.client.on('ready', () => {
            this.logger.log('Online on Discord');
        });

        this.client.on('messageCreate', msg => {
            let newmsg = CosmicForeignMessageHandler.convertMessage('chat', {
                a: msg.content,
                p: {
                    name: msg.author.username,
                    _id: msg.author.id,
                    color: msg.member.displayHexColor
                },
                original_channel: {
                    id: msg.channel.id,
                    _id: (msg.channel as any).name
                }
            });
            
            this.previousChannel = msg.channel.id;
            this.emit('chat', newmsg);
        });

        this.on('send chat message', msg => {
            let channel = this.previousChannel;
            if (msg.channel) channel = msg.channel;

            // console.log(msg);
            this.sendChat(msg.message, channel);
        });
    }
}
