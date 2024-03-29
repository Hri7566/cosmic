import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';

require('./sass/screen.scss');

const Logo = () => {
    return (
        <>
            <img src="assets/pink_ball.png" style={{
                width: '48px',
                height: '48px',
                bottom: '0',
                marginTop: 'auto',
                marginBottom: '1.1vh',
                padding: '.5vh'
            }}></img>
        </>
    )
}

const Nav = () => {
    return (
        <>
            <div id="nav">
                <ul>
                    <li><Link to="/">About</Link></li>
                    <li><Link to="/stats">Statistics</Link></li>
                    <li><a href="api">API</a></li>
                </ul>
            </div>
        </>
    )
}

const Layout = () => {
    return (
        <div id="container">
            <div id="header">
                <div className="left">
                    <Link to="/" style={{ display: 'flex' }}><Logo /><h1>Cosmic</h1></Link>
                </div>
                <div className="right">
                    <Nav />
                </div>
            </div>
            <div id="content">
                <Outlet />
            </div>
            <div id="footer">

            </div>
        </div>
    )
}

const About = () => {
    return (
        <>
            <h1>About</h1>
            <p>Made by Hri7566</p>
        </>
    )
}

class UserCount extends React.Component {
    state = {
        count: 'Loading...'
    }

    render() {
        return (
            <span>{ this.state.count }</span>
        )
    }

    componentDidMount() {
        fetch('api/users').then(d => {
            return d.json();
        }).then(u => {
            this.setState({
                count: u.length
            });
        });
    }
}

const Statistics = () => {
    return (
        <>
            <h1>Statistics</h1>
            <p>Users in Database: <UserCount /></p>
        </>
    )
}

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<About />} />
                    <Route path="stats" element={<Statistics />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

window.addEventListener('load', () => {
    // document.getElementById('app').innerHTML = ReactDOM.renderToString(<App />);
    const root = ReactDOM.createRoot(document.getElementById('app'));
    root.render(<App />);
});
