import { EventEmitter } from 'events';
import * as dispatcher from '../dispatchers/app-dispatcher';

const CHANGE_EVENT = 'change';

const BaseStore = Object.assign(EventEmitter.prototype, {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },

    on(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    off(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

export default BaseStore;
