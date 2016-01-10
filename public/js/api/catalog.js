import * as ajax from '../plugins/ajax';

const BASE_CONTEXT = '/catalog';

export function getCategories() {
    return ajax.getJson(`${BASE_CONTEXT}/categories`);
}

export function getFeaturedProducts() {
    return ajax.getJson(`${BASE_CONTEXT}/featured-products`);
}

export function getCategoryProducts(categoryId) {
    console.warn('API::catalog::getCategoryProducts# Pending implementation...');
    return Promise.resolve([]);
}

export function getProductDetail() {
    console.warn('API::catalog::getProductDetail# Pending implementation...');
    return Promise.resolve({});
}
