import React, {Component} from 'react';
import axios from 'axios';
import config from '../config.json';
import '../index.css';


function newGame() {
	axios.request({
		method:'post',
		url:'http://'+config.apiUrl+'/api/games',
	}).then(function (response) {
    	var key = response.data.key;
    	//link to newly created game
    	window.location.assign("http://"+config.clientUrl+"/game?key="+key+"&player=1");
	});
}

function joinGame(gameCode) {
	//TODO: tell backend to update player count
	//axios.request({
	//	method:'post',
	//	url:'http://'+config.apiUrl+'/api/games',
	//}).then(function (response) {
    	//link to game
    	window.location.assign("http://"+config.clientUrl+"/game?key="+gameCode+"&player=2");
	//});
}

class Home extends Component{
	constructor(props) {
		super(props);
		this.state = {value: ''};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
    	this.setState({value: event.target.value});
	}
	handleSubmit(event) {
		if(this.state.value.length !== 36) {
			 alert("Oops, this is not a correctly formatted Game Code :(")
		} else {
			joinGame(this.state.value);
		}
		event.preventDefault();
	}

	render(){
		return (
		    <div>
		      <h1> Checkers: The Game </h1>
		      <p> To begin, press  
		      		<button className="button button-main" onClick={newGame}>New Game </button> 
		      		<br />
		        	or enter a game code you got from a friend: 
		      </p>
		      <form onSubmit={this.handleSubmit}>
        		<label>
          			Code:
          			<input className="label" type="text" value={this.state.value} onChange={this.handleChange} />
        		</label>
        		<input className="button button-main" type="submit" value="Submit" />
      		</form>

		    </div>
	    )
	}
}



export default Home;