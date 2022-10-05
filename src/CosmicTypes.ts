/**
 * COSMIC PROJECT
 * 
 * Type definitions
 */

/**
 * Module-level declarations
 */

type NoteStringOctave = -1 | -2 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type NoteStringTone = 'a' | 'b' | 'c' | 'd' | 'e' | 'f';
type NoteString = `${NoteStringTone}${NoteStringOctave}`;

export interface Note {
    n: NoteString;
    s?: 0 | 1;
    d?: number;
    v?: number;
}

export interface Participant {
    _id: string;
    name: string;
    id?: string;
    color?: string;
}

export interface User extends Participant {
    //? pass
}

export interface Item {
    id: string;
    displayName: string;
    count: number;
    description?: string;
    emoji?: string;
    value?: number;
    sellable?: boolean;
}

export interface ShopListing {
    item: AnyItem;
    overridePrice?: number;
    season?: string;
}

export interface FoodItem extends Item {
    edible: true;
}

export interface UpgradeItem extends Item {
    cake_bonus?: number;
}

export type AnyItem = Item | FoodItem | UpgradeItem;

export interface Inventory {
    _id: string; //* this should be the user id
    items: Item[];
    balance: number;
}

export interface ChannelSettings {
    color: string;
    color2?: string;
    chat: boolean;
    visible: boolean;
    lobby?: boolean;
    crownsolo?: boolean;
    owner_id?: string;
    'no cussing'?: boolean;
    'lyrical notes'?: boolean;
}

export interface Channel {
    _id: string;
    count: number;
    settings: ChannelSettings;
    ppl: Participant[];
}

export type Token = string | number;

export type Timestamp = string | number;

export namespace Cosmic {
    export interface Message {
        type: string;
        timestamp?: number;
    }

    export interface ChatMessage extends Message {
        type: 'chat';
        sender: Participant;
        message: string;
        platform: string;
        original_channel?: string; //* for discord
        prefix?: Prefix;
    }

    export interface HeartbeatMessage extends Message {
        type: 'heartbeat';
        timestamp: number;
        foreign_timestamp?: number;
    }

    export interface ConnectionMessage extends Message {
        type: 'connection';
        received_user: User;
        motd: string;
        version: string | number;
    }

    export interface ChannelUpdateMessage extends Message {
        type: 'channel_update';
        channel: Channel;
    }

    export interface ChannelSettingsMessage extends Message {
        type: 'channel_settings';
        set: ChannelSettings;
    }

    export interface ChannelListMessage extends Message {
        type: 'channel_list';
        complete: boolean;
        channels: Channel[];
    }

    export interface ChannelListSubscribeMessage extends Message {
        type: 'channel_list_subscribe';
    }

    export interface ChannelListUnsubscribeMessage extends Message {
        type: 'channel_list_unsubscribe';
    }
    
    export interface LogMessage extends Message {
        type: 'log';
        args: any[];
    }

    export interface Flags {
        [key: string]: string | number | boolean;
    }

    export interface Vector2 {
        x: number;
        y: number;
    }

    export interface Vector3 extends Vector2 {
        z: number;
    }

    export interface CursorMessage extends Message {
        type: 'cursor';
        position: Vector2;
    }

    export interface NoteMessage extends Message {
        type: 'note';
        notes: Note[];
    }

    export interface ChatDirectMessage extends Message {
        type: 'direct_message';
        message: string;
        _id: string;
    }

    //? maybe use this as "admin"-only message type?
    export interface RootMessage extends Message {
        type: 'root';
        message: Message;
    }

    export interface CommandMessage extends Message {
        type: 'command';
        argv: string[];
        sender: User;
    }

    export interface ChannelConfig {
        _id: string;
        settings: ChannelSettings;
    }

    export interface Prefix {
        prefix: string;
    }

    export interface PrefixMPP extends Prefix {
        channels: Array<string | ChannelConfig>;
    }

    export interface PrefixConfig {
        global: Array<string | Prefix>;
        mpp: PrefixMPP[];
    }

    export type Permission = string;

    export type PermissionGroupIdentifier = string;

    export interface PermissionGroup {
        id: PermissionGroupIdentifier;
        permissions: Permission[];
    }

    export interface Cake extends FoodItem {
        icing: string;
        filling: string;
        topping?: string;
    }
    
    export interface Season {
        displayName: string;
        emoji: string;
    }

    export interface SeasonMessage extends Message, Season {
        type: 'season';
    }

    export interface Holiday {
        displayName: string;
        emoji: string;
        timestamp: Timestamp;
    }

    export interface RangeHoliday extends Omit<Holiday, 'timestamp'> {
        start: Timestamp;
        end: Timestamp;
    }
}
