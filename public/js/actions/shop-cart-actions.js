import AppConstants from '../constants/app-constants';
import { dispatch } from '../dispathers/app-dispatcher';

export default {
    addProductToCart(product) {
        dispatch({
            actionType: AppConstants.shopCart.ADD_TO_CART,
            data: {
                product
            }
        });
    }
};
