import React, {Component} from 'react';
import axios from 'axios';
import '../index.css';

function newGame(){
	axios.request({
		method:'post',
		url:'http://localhost:1337/api/games',
	}).then(response=> {
		this.props.history.push('/');
	}).catch(err => console.log(err));
}

class Home extends Component{
	render(){
		return (
		    <div>
		      <h1> Checkers: The Game </h1>
		      <p> To begin, press <button onClick={newGame}>New Game </button> <br />
		        or enter a game code you got from a friend: 
		      </p>
		    </div>
	    )
	}
}



export default Home;