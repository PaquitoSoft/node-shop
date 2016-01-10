'use strict';

import React from 'react';

export default function(props) {
    return (
        <header>
			<div className="container upper">

				<div className="three columns product-search-wrapper">
					<div id="product-search">
						<form action="/search" method="get" className="search-form" role="search">
							<input type="hidden" name="type" value="product" />
							<input type="submit" id="search-submit" className="icon " />
							<input className="search" placeholder="Search" name="q" type="text" id="search-field"  />
						</form>
						<br className="clear" />
					</div>
				</div>

				<div className="seven columns offset-by-one desktop">
				</div>

				<div className="five columns minicart-wrapper" data-controller="mini-cart-controller">
					<div id="minicart">
						<a href="/shop/cart" className="toggle-drawer cart desktop ">My Cart <span id="cart-target-desktop" className="count cart-target">(<span className="_items-count">_shoppingCart.unitsCount_</span>)</span></a>
						<a href="/shop/cart" className="cart mobile  cart-target">My Cart <span id="cart-target-mobile" className="count cart-target">(_shoppingCart.unitsCount_)</span></a>
						<a href="/shop/cart" className="checkout">Check Out</a>
					</div>
				</div>

			</div>

			<div className="container lower">
				<div className="sixteen columns">
					<div className="table logo-tagline">
						<div className="table-cell">
							<h1 id="logo">
								<a href="/">
									<img src="/images/logo.png" alt="Shopify Shirts" />
								</a>
							</h1>
						</div>

						<div className="table-cell">
							<div id="tagline" className="desktop">
								<h3>Free shipping on all orders over $75</h3>
							</div>
						</div>
					</div>
				</div>
			</div>

		</header>
    );
}
