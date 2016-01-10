'use strict';

import React from 'react';

export default function(props) {
    return (
        <footer>
            <section className="upper">

                <div className="three columns ">
                    <nav>
                        <h2></h2>
                    </nav>
                </div>

                <div className="eight offset-by-one columns">
                    <div id="footer-content">
                        <h2>Theme documentation and support</h2>
                        <div>
                            <p>
                                You can find the documentation for this theme <a href="http://simpletheme.myshopify.com/pages/documentation" target="_blank">right here</a>. Since this is an official Shopify theme you can always ask <a href="http://support.shopify.com" target="_blank">one of our gurus</a>.
                            </p>
                            <p className="adr">
                                <span className="street-address">1 Main Street</span>
                                <br />
                                <span className="locality">Los Angeles</span>, <span className="region">California</span>,<br /><span className="postal-code">90210</span> <span className="country-name">USA</span><br /> <span className="tel">Phone: (555) 867 5309</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="three columns offset-by-one">
                    <div id="payment-methods">
                        <img src="/images/payment/cc-amex.png" alt="We accept Amex" />
                        <img src="/images/payment/cc-discover.png" alt="We accept Discover" />
                        <img src="/images/payment/cc-visa.png" alt="We accept Visa" />
                        <img src="/images/payment/cc-mastercard.png" alt="We accept Mastercard" />
                        <img src="/images/payment/cc-maestro.png" alt="We accept Maestro" />
                        <img src="/images/payment/cc-cirrus.png" alt="We accept Cirrus" />
                        <img src="/images/payment/cc-paypal.png" alt="You can check out using Paypal" />
                        <img src="/images/payment/cc-google.png" alt="You can check out using Google Wallet" />
                    </div>
                </div>

                <br className="clear" />

            </section>

            <section className="lower">
                <div className="nine columns">
                    <div className="legals">
                        Copyright &copy; 2014 Shopify Shirts. <a href="http://www.shopify.ca" target="_blank">Ecommerce Software by Shopify</a>.
                    </div>
                </div>
                <div className="six columns offset-by-one">
                    <nav>
                        <a href="/search" title="Search">Search</a>
                        <a href="/pages/about-us" title="About Us">About Us</a>
                        <a href="/pages/privacy-policy" title="Privacy Policy">Privacy Policy</a>
                    </nav>
                </div>
            </section>

            <br className="clear" />

        </footer>
    );
}
