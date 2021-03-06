import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';

import Container from './components/Container/Container';
import Products from './components/Products/Products';
import ProductDetails from './components/Products/ProductDetails';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';
import Cart from './components/Cart/Cart';
import About from './components/About';
import UserCreated from './components/UserCreated';
import NotFound from './components/NotFound';
import Success from './components/Success';

class App extends React.Component {
	render() {
		return (
			<Router history={hashHistory}>
				<Route path='/' component={Container}>
					<IndexRoute component={Products} />
					<Route path='/products/:id' component={ProductDetails} />
					<Route path='/login' component={Login} />
					<Route path='/logout' component={Logout} />
					<Route path='/signup' component={Signup} />
					<Route path='/cart' component={Cart} />
					<Route path='/about' component={About} />
					<Route path='/usercreated' component={UserCreated} />
					<Route path='/success' component={Success} />
					<Route path='*' component={NotFound} />
				</Route>
			</Router>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
