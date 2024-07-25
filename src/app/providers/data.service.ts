import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private registros: any = {};

    constructor() {

    }

    set(keyOrObj, value?) {

        // Null delete key
        if (value == null) {
            if (typeof this.registros[keyOrObj] === 'undefined') { return; }

            delete this.registros[keyOrObj];

            return;
        }


        if (typeof keyOrObj === 'object') {
            for (const i in keyOrObj) {
                if (1 || keyOrObj.hasOwnProperty(i)) {
                    this.registros[i] = keyOrObj[i];
                }
            }
        } else {
            this.registros[keyOrObj] = value;
        }

        return this;

    }

    get(key?) {

        if (typeof key === 'undefined') {
            return this.registros;
        }

        if (typeof this.registros[key] === 'undefined') {
            return null;
        }

        return this.registros[key];

    }

}
