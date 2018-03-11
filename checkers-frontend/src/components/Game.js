import React, {Component} from 'react';
import { subscribeToGame, subscribeToBoard, sendMove, endTurn } from './Socket';
import Move, {movedTwoSpaces} from './Move';
import Piece from './Piece';

export const PLAYER_W = 1;
export const PLAYER_B = 2;
var   gameKey;
var   clientPlayer;


function playerToNum(player) {
    return player === PLAYER_W ? '1' : '2';
}

function swapPlayer(player) {
    if (player === PLAYER_W) {
        return PLAYER_B;
    } else {
        return PLAYER_W;
    }
}

// TODO: Pull out into a separate class
function Square(props) { 
    console.log(props);
    return (
        <button className={props.selected ? 'selected-square '+props.color : 'square '+props.color} onClick={props.onClick}>
        {props.value}
        </button>
    );
}

class Board extends Component {
    constructor(props) {
        super(props);
        this.gameKey = gameKey;
        this.clientPlayer = clientPlayer;
        this.player = this.props.player
        this.state = {
            turn: 1,
            movesThisTurn: [],
            squares: [],
            selectedX: null,
            selectedY: null
        };
    }
    
    componentDidMount() {
        this.initializeBoard();
        //subscribe to socket
        subscribeToBoard(gameKey, clientPlayer, (err, moveData) => {
            this.receiveMove(moveData); 
        }, (err) => {
            this.turnEnd();
        });
    }
    
    handleClick(r, c) {
        // TOOD: Just return if there are not two players

        // Don't recognize the click if it isn't our turn
        if(this.state.turn !== this.player) {
            return;
        }

        const squares = this.state.squares.slice();
        const selectedPiece = squares[r][c];
        // Don't recognize click of other player's piece
        if(selectedPiece !== null && selectedPiece.props.player !== this.player) {
            return;
        }

        // Clicked on an empty square, try to move if we currently had one
        // of our pieces selected
        if(selectedPiece === null) {
            const oldX = this.state.selectedX;
            const oldY = this.state.selectedY;
            if (oldX !== null && oldY !== null) {
                const movingPiece = squares[oldX][oldY];
                const moved = this.movePiece(new Move(movingPiece.props, oldX, oldY, r, c));

                if (moved !== false) {
                    // If we moved, deselect tiles
                    this.setState({
                        selectedX: null,
                        selectedY: null
                    });
                }
            }
            return
        }

        // It's our piece, so just highlight the new thing
        this.setState({
            selectedX: r,
            selectedY: c
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
        W_START_POS.forEach((val, idx) => t_squares[val[0]][val[1]] = 
            <Piece player={PLAYER_W} king={false} id={'w' + idx}/>
        );
        B_START_POS.forEach((val, idx) => t_squares[val[0]][val[1]] = 
            <Piece player={PLAYER_B} king={false} id={'b' + idx}/>
        );
        
        this.setState({squares: t_squares});
    }
    
    // Called when we want to make a move on our board.
    // Returns true if the move went through, false otherwise
    movePiece(move) {
        // Need to check that if there were any other moves this
        // turn that whoever it is is still only moving the same piece
        let moves = this.state.movesThisTurn.slice();
        const allSame = moves.every((mv, idx) => {
            return move.movingPiece.id === mv.movingPiece.id;
        });
        if (!allSame) {
            console.log('Cannot move a different piece in same turn.');
            return false;
        }

        const allTwoSpaces = moves.every((mv, idx) => {
            return movedTwoSpaces(mv);
        });
        console.log(moves.length);
        console.log(allTwoSpaces);
        console.log(movedTwoSpaces(move));
        if (moves.length >= 1 
            && (!allTwoSpaces || !movedTwoSpaces(move))) {
            console.log('Multiple moves only allowed if all are jumps');
            return false;
        }

        // Process move, just return if it was invalid, update squares
        // otherwise
        let squares = this.state.squares.slice();
        const result = move.process(this.state.turn, this.state.squares);
        if (result === false) {
            return false;
        } else {
            squares = result;
        }

        // Update our list of moves and the board, then push it
        // NOTE: We track the opponent's moves on their turn
        moves.push(move);
        this.setState({
            movesThisTurn: moves,
            squares: squares,
        });

        // If it's our turn let the opponent know about this move,
        // they should end up calling this same function.
        if (this.state.turn === this.player) {
            //console.log(this.gameKey);
            sendMove(this.gameKey, this.clientPlayer, move);
        }

        return true;
    }

    receiveMove(moveData) {
        console.log(`player ${this.player} saw ${moveData}`);

        if (moveData === null) {
            return;
        }
        var newMove = new Move(moveData.movingPiece,
            moveData.oldR,
            moveData.oldC,
            moveData.newR,
            moveData.newC);
        
        if(!this.movePiece(newMove)) {
             console.log('Rejected opponent move');
        }
    }

    turnEnd() {
        const nextPlayer = swapPlayer(this.state.turn);
        this.setState({
            movesThisTurn: [],
            turn: nextPlayer
        });
    }

    renderSquare(r, c, selected, color) {
        return (
            <Square
            key={r*8 + c}
            color={color}
            selected={selected}
            value={this.state.squares[r][c]}
            onClick={() => this.handleClick(r, c)}
            />
        );
    }
    
    reverseColor(color) {
        if(color === "white") {
            return "black";
        } else {
            return "white";
        }
    }
    
    render() {
        let result = [];
        let color = "white";
        
        for (let r = 0; r < this.state.squares.length; r++) {
            const row = this.state.squares[r];
            let temp = [];
            for (let c = 0; c < row.length; c++) {
                let selected = this.state.selectedX === r && this.state.selectedY === c;
                temp.push(this.renderSquare(r, c, selected, color));
                color = this.reverseColor(color);
            }
            result.push(<div className="board-row" key={r}>{temp}</div>);
            color = this.reverseColor(color);
        }

        // TODO: Check for winner and display if someone wins
        
        return(result);
    }
}


class Game extends Component {
    //connect to socket
    constructor(props) {
        super(props);
        //get query params
        const params = this.props.location.search;
        this.gameKey = params.substring(5, params.indexOf('&'));
        gameKey = params.substring(5, params.indexOf('&'));
        clientPlayer = params.substring(49);
        const gamePlayer = Number.parseInt(clientPlayer, 10) === 1 
            ? PLAYER_W
            : PLAYER_B; 
        this.state = {
            turn: PLAYER_W,
            player: gamePlayer
        }
        //subscribe to socket
        subscribeToGame(this.gameKey, clientPlayer, (err, joinData) => {
            this.userJoined(joinData); 
        }, (err) => {
            this.receiveTurnEnd();
        });
    }

    //called when opponent attempts to make a move
    receiveTurnEnd() { 
        const nextTurn = swapPlayer(this.state.turn);
        this.setState({turn: nextTurn});
    }  

    sendTurnEnd(gameKey) {
        // Can only ned your own turn
        if (this.state.turn === this.state.player) {
            endTurn(this.gameKey);
        }
    }

    userJoined(joinData) {
        console.log("user", joinData, "has joined!");
    }
    
    render() {
        const playerInfo = 'You are player #' + playerToNum(this.state.player);
        const turnInfo = "It's player " + playerToNum(this.state.turn) + "'s turn";
		const joinCode = "Your Join code is " + this.gameKey;

        return (
            <div className="game">
                <div className="game-info">
                    <div className="player">{playerInfo}</div>
                    <div className="status">{turnInfo}</div>
                </div>
                <div className={'center game-board-'+this.state.player}>
                    <div className="center-block center-border">
                        <Board player={this.state.player} turn={this.state.turn}/>
                    </div>
                </div> <br />
                <div className="center">
                     <button className="button button-end center-block" 
                    type="end"
                    onClick={() => this.sendTurnEnd(this.gameKey)}
                    disabled={this.state.turn !== this.state.player}>End Turn</button> <br />
                </div> <br />
                <div className="game-info">
				    <div className="joinCode">{joinCode}</div>
                </div>
            </div>
        );
    }
}

export default Game;