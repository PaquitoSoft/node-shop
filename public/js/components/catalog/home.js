'use strict';

import React from 'react';
import ProductsGrid from './products-grid';

export default function(props) {
    let products = [];
    return (
        <div id="page-content">
    		<br />
    		<ProductsGrid products={products} />
    		<br className="clear" />
    	</div>
    );
}
