import * as React from 'react';
import * as ReactDOM from 'react-dom/server';

require('./sass/screen.scss');

let text = ReactDOM.renderToString(<p>hello</p>);

document.getElementsByTagName('app')[0].innerHTML = text;
