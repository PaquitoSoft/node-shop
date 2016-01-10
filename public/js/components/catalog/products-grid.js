'use strict';

import React from 'react';

export default function(props) {
    // href: /catalog/category/{categoryId}/product/{_id}/{name}
    let products = props.products.map( (product, index) => {
        return (
            <div>
                <div className="four columns">
                    <a href="#" data-id="{product.id}" className="__animated __fadeInUpBig _product-summary">
                        <img src="http://static.zara.net/photos{product.colors[0].pictures[0]}" alt="Blue ripped jeans" className="product" />
                        <h3>{product.name}</h3>
                        <h4>${product.price} </h4>
                    </a>
                </div>
            </div>
        );
    });

    return (
        <section className="product-grid twelve columns alpha omega">
        	{products}
        </section>
    );
}
