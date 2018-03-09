import React, {Component} from 'react';
import {PLAYER_W, PLAYER_B} from './Game'

class Piece extends Component {
    constructor(props) {
        super(props);
        this.player = this.props.player;
        this.king = this.props.king;
    }

    render() {
        let svgToUse;
        
        if (this.player === null || this.king === null) {
            return (null);
        } else if (this.player === PLAYER_W) {
            if (this.king === true)
                svgToUse = 'pWhiteKing.svg';
            else
                svgToUse = 'pWhite.svg';
        } else if (this.player === PLAYER_B) {
            if (this.king === true)
                svgToUse = 'pBlackKing.svg';
            else
                svgToUse = 'pBlack.svg';
        }

        return (<img src={svgToUse} height="30" 
                    alt="a {this.player === PLAYER_W ? 'white' : 'black'} {this.king ? 'king' : 'piece'}"/>);
    }
}

export default Piece;