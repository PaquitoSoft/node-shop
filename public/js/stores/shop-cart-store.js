import * as dispatcher from '../dispatchers/app-dispatcher';
import AppConstants from '../constants/app-constants';
import BaseStore from './base-store';

const CHANGE_EVENT = 'change';

const ShopCartStore = Object.assign({}, BaseStore, {
    
    dispatcherIndex: dispatcher.register(action => {
        switch (action.actionType) {
            case AppConstants.ADD_TO_CART:
                console.log('TODO: Implement add to cart');
                break;
        }

        ShopCartStore.emitChange();
    })
});

export default ShopCartStore;
