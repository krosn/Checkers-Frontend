import React, {Component} from 'react';
import axios from 'axios';
import config from '../config.json';
import '../index.css';


function newGame(){
	axios.request({
		method:'post',
		url:'http://'+config.apiUrl+'/api/games',
	}).then(function (response) {
    	var key = response.data.key;
    	//link to newly created game
    	window.location.assign("http://"+config.clientUrl+"/game?key="+key);
	})
}

class Home extends Component{
	render(){
		return (
		    <div>
		      <h1> Checkers: The Game </h1>
		      <p> To begin, press  
		      		<button onClick={newGame}>New Game </button> 
		      	<br />
		        or enter a game code you got from a friend: 
		      </p>
		    </div>
	    )
	}
}



export default Home;