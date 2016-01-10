import AppConstants from '../constants/app-constants';
import { dispatch } from '../dispathers/app-dispatcher';

export default {
    searchProducts(searchTerm) {
        dispatch({
            actionType: AppConstants.catalog.SEARCH_PRODUCTS,
            data: {
                searchTerm
            }
        });
    },

    filterProducts(filter) {
        dispatch({
            actionType: AppConstants.catalog.FILTER_PRODUCTS,
            data: {
                filter
            }
        });
    }
};
