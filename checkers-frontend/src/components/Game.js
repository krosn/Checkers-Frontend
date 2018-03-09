import React, {Component} from 'react';
import { subscribeToGame, sendMove } from './Socket';
import Piece from './Piece';

export const PLAYER_W = 1;
export const PLAYER_B = 2;
var   gameKey;
var   clientPlayer;

function swapPlayer(player) {
    if (player === PLAYER_W) {
        return PLAYER_B;
    } else {
        return PLAYER_W;
    }
}

function Square(props) {
    return (
        <button className={props.selected ? 'selected-square' : 'square'} onClick={props.onClick}>
        {props.value}
        </button>
    );
}

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: [],
            player: PLAYER_W,
            selectedX: null,
            selectedY: null,
            selectedPiece: null
        };
    }
    
    componentDidMount() {
        this.initializeBoard()
    }
    
    handleClick(r, c) {
        //emit an event
        sendMove(gameKey, "ooo here's some move data");
        
        const squares = this.state.squares.slice();
        const selectedPiece = squares[r][c];
        this.setState({
            squares: squares,
            selectedX: r,
            selectedY: c,
            selectedPiece: selectedPiece
        });
    }
    
    initializeBoard() {
        const W_START_POS = [[0,1], [0,3], [0,5], [0,7],
                             [1,0], [1,2], [1,4], [1,6],
                             [2,1], [2,3], [2,5], [2,7]];
        const B_START_POS = [[5,0], [5,2], [5,4], [5,6],
                             [6,1], [6,3], [6,5], [6,7],
                             [7,0], [7,2], [7,4], [7,6]];
        
        let t_squares = [...Array(8).keys()].map(i => 
            Array(8).fill(null)
        );
        W_START_POS.forEach(indexes => t_squares[indexes[0]][indexes[1]] = 
            <Piece player={PLAYER_W} king={false}/>
        );
        B_START_POS.forEach(indexes => t_squares[indexes[0]][indexes[1]] = 
            <Piece player={PLAYER_B} king={false} />
        );
        
        this.setState({squares: t_squares});
    }
    
    renderSquare(r, c, selected) {
        return (
            <Square
            key={r*8 + c}
            selected={selected}
            value={this.state.squares[r][c]}
            onClick={() => this.handleClick(r, c)}
            />
        );
    }
    
    render() {
        const status = 'Next player: ' + (this.state.player === PLAYER_W ? '1' : '2');
        
        let result = [];
        result.push(<div className="status" key="status">{status}</div>);
        
        for (let r = 0; r < this.state.squares.length; r++) {
            const row = this.state.squares[r];
            let temp = [];
            for (let c = 0; c < row.length; c++) {
                let selected = this.state.selectedX === r && this.state.selectedY === c;
                temp.push(this.renderSquare(r, c, selected))
            }
            result.push(<div className="board-row" key={r}>{temp}</div>)
        }
        
        return(result);
    }
}

//called when opponent attempts to make a move
function receiveMove(moveData) { 
    console.log(moveData);
    //TODO: ...
}

function userJoined(joinData) {
    console.log("user", joinData, "has joined!");
}

class Game extends Component {
    //connect to socket
    constructor(props) {
        super(props);
        //get query params
        var params = this.props.location.search;
        gameKey = params.substring(5, params.indexOf('&'));
        clientPlayer = params.substring(49);
        //subscribe to socket
        subscribeToGame(gameKey, clientPlayer, (err, moveData) => {
            receiveMove(moveData); 
        }, (err, joinData) => {
            userJoined(joinData); 
        });
    }
    
    render() {
        return (
            <div className="game">
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