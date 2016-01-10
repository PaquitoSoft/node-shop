import * as dispatcher from '../dispatchers/app-dispatcher';
import AppConstants from '../constants/app-constants';
import BaseStore from './base-store';
import * as catalogApi from '../api/catalog';

const CHANGE_EVENT = 'change';

const CatalogStore = Object.assign({}, BaseStore, {

    getCategories() {
        return catalogApi.getCategories();
    },

    dispatcherIndex: dispatcher.register(action => {
        switch (action.actionType) {
            case AppConstants.SEARCH_PRODUCTS:
                console.log('TODO: Implement search products');
                break;
        }

        CatalogStore.emitChange();
    })

});

export default CatalogStore;
