import React, {Component} from 'react';
import { subscribeToGame, sendMessage } from './Socket';

const PLAYER_W = 1;
const PLAYER_B = 2;

function swapPlayer(player) {
	if (player === PLAYER_W) {
		return PLAYER_B;
	} else {
		return PLAYER_W;
	}
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: [],
      player: PLAYER_W
    };
  }
	
  componentDidMount() {
	const W_START_POS = [1, 3, 5, 7, 8, 10, 12, 14, 17, 19, 21, 23];
	const B_START_POS = [40, 42, 44, 46, 49, 51, 53, 55, 56, 58, 60, 62];
	  
	let t_squares = Array(64).fill('_');
	W_START_POS.forEach(index => t_squares[index] = 'W');
	B_START_POS.forEach(index => t_squares[index] = 'B');
	
	this.setState({squares: t_squares});
  }
	
  handleClick(i) {
    //emit an event
    console.log("sent message");
    sendMessage("move", "hello this is some bull shite");

    const squares = this.state.squares.slice();
    squares[i] = (this.state.player === PLAYER_W ? 'W' : 'B');
    this.setState({
      squares: squares,
      player: swapPlayer(this.state.player)
    });
  }
  
  initializeBoard() {
	
  }
	
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.player === PLAYER_W ? 'W' : 'B');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
		  {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
		  {this.renderSquare(6)}
          {this.renderSquare(7)}
        </div>
        <div className="board-row">
          {this.renderSquare(8)}
          {this.renderSquare(9)}
          {this.renderSquare(10)}
		  {this.renderSquare(11)}
          {this.renderSquare(12)}
          {this.renderSquare(13)}
		  {this.renderSquare(14)}
          {this.renderSquare(15)}
        </div>
        <div className="board-row">
          {this.renderSquare(16)}
          {this.renderSquare(17)}
          {this.renderSquare(18)}
		  {this.renderSquare(19)}
          {this.renderSquare(20)}
          {this.renderSquare(21)}
		  {this.renderSquare(22)}
          {this.renderSquare(23)}
        </div>
		<div className="board-row">
          {this.renderSquare(24)}
          {this.renderSquare(25)}
          {this.renderSquare(26)}
		  {this.renderSquare(27)}
          {this.renderSquare(28)}
          {this.renderSquare(29)}
		  {this.renderSquare(30)}
          {this.renderSquare(31)}
        </div>
		<div className="board-row">
          {this.renderSquare(32)}
          {this.renderSquare(33)}
          {this.renderSquare(34)}
		  {this.renderSquare(35)}
          {this.renderSquare(36)}
          {this.renderSquare(37)}
		  {this.renderSquare(38)}
          {this.renderSquare(39)}
        </div>
		<div className="board-row">
          {this.renderSquare(40)}
          {this.renderSquare(41)}
          {this.renderSquare(42)}
		  {this.renderSquare(43)}
          {this.renderSquare(44)}
          {this.renderSquare(45)}
		  {this.renderSquare(46)}
          {this.renderSquare(47)}
        </div>
		<div className="board-row">
          {this.renderSquare(48)}
          {this.renderSquare(49)}
          {this.renderSquare(50)}
		  {this.renderSquare(51)}
          {this.renderSquare(52)}
          {this.renderSquare(53)}
		  {this.renderSquare(54)}
          {this.renderSquare(55)}
        </div>
		<div className="board-row">
          {this.renderSquare(56)}
          {this.renderSquare(57)}
          {this.renderSquare(58)}
		  {this.renderSquare(59)}
          {this.renderSquare(60)}
          {this.renderSquare(61)}
		  {this.renderSquare(62)}
          {this.renderSquare(63)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  //connect to socket
  constructor(props) {
    super(props);
    subscribeToGame((err, gameData) => this.setState({ 
      gameData 
    }));
  }
  state = {
    gameData: 'no gameData yet'
  };

  render() {
    return (
      <div className="game">
        <p> {this.state.gameData} </p>
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

export default Game;