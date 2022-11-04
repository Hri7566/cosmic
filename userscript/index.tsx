import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { BrowserLogger } from "./BrowserLogger";
const cmapi = require('../../cmapi');

window.addEventListener('load', evt => {
    const LOGGER = new BrowserLogger('CosmicUI');

    const App = () => {
        return (
            <p>Test</p>
        )
    }

    if (!MPP.cmapi) {
        MPP.cmapi = new cmapi(MPP.client);
    }

    let serverUri = localStorage.getItem('cosmic_uri');

    if (!serverUri) {
        serverUri = 'wss://home.hri7566.info/cosmic';
    }

    const ws = new WebSocket(serverUri);

    // const root = ReactDOM.createRoot(document.getElementById('piano'));
    // root.render(<App />);

    LOGGER.log('CosmicUI Loaded');
});
