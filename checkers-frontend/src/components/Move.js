import {PLAYER_W, PLAYER_B} from './Game';
import {pieceEquals} from './Piece';

class Move {
    constructor(movingPiece, oldR, oldC, newR, newC) {
        this.movingPiece = movingPiece
        this.oldR = oldR
        this.oldC = oldC
        this.newR = newR
        this.newC = newC
    }

    // Returns updated squares if the move is valid, false otherwise. Also removes the 
    // jumped piece if the move was valid. Also kings as necessary.
    process(turn, squares) {
        const moveText = `move from (${this.oldR},${this.oldC}) to (${this.newR},${this.newC})`;

        // Ya'll better not be lying about what piece is moving
        const pieceAtOld = squares[this.oldR][this.oldC].props;
        if (!pieceEquals(this.movingPiece, pieceAtOld)) {
            console.log('Moving piece did not start at origin in ' + moveText);
            return false;
        }

        // Move one or two spaces diagonally at a time
        const dx = Math.abs(this.newR - this.oldR);
        const dy = Math.abs(this.newC - this.oldC);
        if (!(1 <= dx <= 2 && 1 <= dy <= 2) || dx !== dy) {
            console.log('Illegal distance in ' + moveText);
            return false;
        }

        // Pieces must be on board
        let inBounds = [this.oldR, this.oldC, this.newR, this.newC].every((val, _) => {
            return 0 <= val <= 7;
        });
        if (!inBounds) {
            console.log('A piece is out of range in ' + moveText);
            return false;
        }

        // Can only move on your own turn
        if (this.movingPiece.player !== turn) {
            console.log('It is not player ' + this.movingPiece.player + '\'s turn to move.')
            return false;
        }

        // Can't move onto a piece
        if (squares[this.newR][this.newC] !== null) {
            console.log('Would move onto another piece in ' + moveText);
            return false;
        }

        // If it was a two space move, it should have jumped an enemy
        if (dx === 2 && dy === 2) {
            const avgR = Math.floor((this.newR + this.oldR) / 2);
            const avgC = Math.floor((this.newC + this.oldC) / 2);

            const jumpedPiece = squares[avgR][avgC];
            if (jumpedPiece === null || jumpedPiece.props.player === turn) {
                console.log('Would move two spaces without jumping enemy ' + moveText);
                return false;
            }
            squares[avgR][avgC] = null;
        }

        // Only kings can go backwards
        if (!this.movingPiece.king) {
            if ((this.movingPiece.player === PLAYER_W && this.newR < this.oldR)
                || (this.movingPiece.player === PLAYER_B && this.newR > this.oldR)) {
                console.log('Cannot move backwards without king in ' + moveText);
                return false;
            }
        }

        // Move the piece to its new position
        squares[this.newR][this.newC] = squares[this.oldR][this.oldC];
        squares[this.oldR][this.oldC] = null;

        // King pieces
        if (((this.movingPiece.player === PLAYER_W && this.newR === 7)
            || (this.movingPiece.player === PLAYER_B && this.newR === 0))
            && !this.movingPiece.king) {
                console.log('Kinging caused by ' + moveText);
                squares[this.newR][this.newC].king = true;
            }

        return squares;
    }
}

export default Move;