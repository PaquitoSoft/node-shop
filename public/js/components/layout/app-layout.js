'use strict';

import React from 'react';
import Header from './header';
import Sidebar from './sidebar';
import Footer from './footer';

class AppLayout extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <div className="container">
                    <Sidebar />

                    <div id="main" className="twelve columns offset-by-one">
                        {this.props.children}
                    </div>

                    <br className="clear" />

                    <Footer />
                </div>
            </div>
        );
    }
}

export default AppLayout;
