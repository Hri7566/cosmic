declare namespace MPP {
    let client: Client;
    let chat: any;
    let piano: any;
    let noteQuota: any;
    let soundSelector: any;
    let Notification: any;
    let cmapi: any;

    function press(): unknown;
    function release(): unknown;
    function pressSustain(): unknown;
    function releaseSustain(): unknown;
}

declare class Client extends require('events').EventEmitter {
    uri: string;
    ws: WebSocket | undefined;
    serverTimeOffset: number;
    channel: undefined | any;
    ppl: Record<string, any>;
    connectionTime: number | undefined;
    connectionAttempts: number;
    desiredChannelId: string | undefined;
    desiredChannelSettings: Record<string, string | number | boolean>;
    pingInterval: ReturnType<typeof setInterval> | undefined;
    canConnect: boolean;
    noteBuffer: any[];
    noteBufferTime: number;
    noteFlushInterval: ReturnType<typeof setInterval> | undefined;
    permissions: any;
    ['🐈']: number;
    loginInfo: any | undefined;
    offlineChannelSettings: Record<string, string | number | boolean>;
    offlineParticipant: any;

    public isSupported(): boolean;
    public isConnected(): boolean;
    public isConnecting(): boolean;
    public start(): void;
    public stop(): void;
    private connect(): void;
    private bindEventListeners(): void;
    public send(raw: string): void;
    public sendArray(arr: any[]): void;
    public setChannel(id: string, set: Record<string, string | number | boolean>): void;
    public getChannelSetting(key: string): string | number | boolean;
    public setChannelSettings(settings: Record<string, string | number | boolean>): void;
    public setParticipants(ppl: Record<string, any>): void;
    public countParticipants(): number;
    public participantUpdate(update: any): void;
    public participantMouseMove(update: any): void;
    public removeParticipant(id: string): void;
    public findParticipantById(id: string): void;
    public isOwner(): boolean;
    public preventsPlaying(): boolean;
    public receiveServerTime(time: number, echo: number): boolean;
    public startNote(note: any, vel: number): void;
    public stopNote(note: any): void;
    public sendPing(): void;
    public setLoginInfo(loginInfo: any): void;
}
