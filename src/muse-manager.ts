import { Muses } from "./muses";

export class MusesManager {
    private _muses: { [key: string]: Muses } = {};

    addMuses(muses: Muses) {

        if(this._muses[muses.name]){
            throw new Error(`Shader ${muses.name} already exists`);
        }
        this._muses[muses.name] = muses;
    }

    getMuses(name: string) {
        return this._muses[name] || null;
    }

    constructor() {
    }
}