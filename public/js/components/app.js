'use strict';

import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import AppLayout from './layout/app-layout';
import HomePage from './catalog/home';

export default function() {
    return (
        <Router>
            <Route path="/" component={AppLayout}>
                <IndexRoute component={HomePage} />
            </Route>
        </Router>
    );
}
