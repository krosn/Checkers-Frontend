import React, {Component} from 'react';
import { subscribeToGame, sendMove } from './Socket';
import Piece from './Piece';

export const PLAYER_W = 1;
export const PLAYER_B = 2;
const turnEnd = 'turnEnd';
var   gameKey;
var   clientPlayer;

function playerToNum(player) {
    return player === PLAYER_W ? '1' : '2';
}

function squareIsEmpty(square) {
    return square.props.value.player === null;
}

function squareIsPlayers(square, player) {
    return square.props.value.player === null;
}

function swapPlayer(player) {
    if (player === PLAYER_W) {
        return PLAYER_B;
    } else {
        return PLAYER_W;
    }
}

// TODO: Pull out into a separate class and take squareIs funcs with it
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
            player: this.props.player,
            turn: this.props.turn,
            squares: [],
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
    
    movePiece(oldR, oldC, newR, newC) {
        if (newR - oldR > 1 || newC - oldC > 1) {
            const msg = 'Illegal move from ' + {oldR} + ',' + {oldC} + 'to' + {newR} + ',' + {newC};
            console.log(msg);
        }

        const squares = this.state.squares.slice();
        squares[newR][newC] = squares[oldR][oldC];
        this.setState({squares: squares});
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
        let result = [];
        
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


class Game extends Component {
    //connect to socket
    constructor(props) {
        super(props);
        //get query params
        const params = this.props.location.search;
        const gameKey = params.substring(5, params.indexOf('&'));
        const clientPlayer = params.substring(49);
        const gamePlayer = Number.parseInt(clientPlayer, 10) === 1 
            ? PLAYER_W
            : PLAYER_B; 
        this.state = {
            turn: PLAYER_W,
            player: gamePlayer
        }
        //subscribe to socket
        subscribeToGame(gameKey, clientPlayer, (err, moveData) => {
            this.receiveMove(moveData); 
        }, (err, joinData) => {
            this.userJoined(joinData); 
        });
    }

    //called when opponent attempts to make a move
    receiveMove(moveData) { 
        if (moveData === turnEnd) {
            const nextTurn = swapPlayer(this.state.turn);
            this.setState({turn: nextTurn});
        }
        console.log(moveData);
        //TODO: ...
    }

    userJoined(joinData) {
        console.log("user", joinData, "has joined!");
    }
    
    render() {
        const playerInfo = 'You are player #' + playerToNum(this.state.player);
        const turnInfo = "It's player " + playerToNum(this.state.turn) + "'s turn";
        
        return (
            <div className="game">
                <div className="game-info">
                    <div className="player">{playerInfo}</div>
                    <div className="status">{turnInfo}</div>
                    <ol>{/* TODO */}</ol>
                </div>
                <div className="game-board">
                    <Board player={this.state.player} turn={this.state.turn}/>
                </div>
                <button className="end-button" onClick={() => sendMove(gameKey, turnEnd)}>End Turn</button>
            </div>
        );
    }
}

export default Game;