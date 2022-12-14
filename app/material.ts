import EventEmitter from "events";
import { Muses } from "../src";

export class Material extends EventEmitter {
    private _url?: string;
    private _source?: string;
    private _muses?: Muses;
    constructor(code: string) {
        super();
        if(isUrl(code)) {
            this._url = code;
        } else {
            this._source = code;
        }
        this.init();
    }

    async init() {
        if(this._source === undefined && this._url !== undefined) {
            const response = await fetch(this._url);
            this._source = await response.text();
        }
        if(this._source === undefined) {
            throw new Error("Material source is undefined.");
        }
        this._muses = new Muses(this._source);
        this.emit('ready', this._muses!);
    }

    get muses() {
        if(!this._muses) {
            throw new Error('Material is not initialized.');
        }
        return this._muses;
    }

    set source(source: string) {
        if(isUrl(source)) {
            this._url = source;
            this._source = undefined;
        } else {
            this._source = source;
        }
        this.init();
    }

    addListener(eventName: 'ready', listener: (muses: Muses) => void): this;
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return super.addListener(eventName, listener);
    }

    removeListener(eventName: 'ready', listener: (muses: Muses) => void): this;
    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return super.removeListener(eventName, listener);
    }

    on(eventName: 'ready', listener: (muses: Muses) => void): this;
    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(eventName, listener);
    }

    emit(eventName: 'ready', muses: Muses): boolean;
    emit(eventName: string | symbol, ...args: any[]): boolean {
        return super.emit(eventName, ...args);
    }
}