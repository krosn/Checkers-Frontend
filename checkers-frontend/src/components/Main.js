import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Game from './Game';
import Home from './Home';

const Main = () => (
	<main>
		<Switch> 
			<Route exact path='/' component={Home} />
			<Route exact path='/game' component={Game} />
		</Switch>
	</main>
) 

export default Main;