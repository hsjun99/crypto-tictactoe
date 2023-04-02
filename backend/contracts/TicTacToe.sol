// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract TicTacToe {
    enum GameStatus {
        Waiting,
        Playing,
        Finished
    }

    mapping(uint256 => address[]) public players;
    mapping(uint256 => uint8[3][3]) public board;
    mapping(uint256 => address) public turn;
    mapping(uint256 => address) public winner;
    mapping(uint256 => GameStatus) public status;

    constructor() {}

    function joinGame(uint256 gameNum) public payable {
        require(msg.value == 0.05 ether, "You must send 0.05 ether");
        require(status[gameNum] == GameStatus.Waiting, "Game is already full");

        players[gameNum].push(msg.sender);
        status[gameNum] = GameStatus.Playing;
    }

    function play(uint256 gameNum, uint8 x, uint8 y) public {
        require(turn[gameNum] == msg.sender, "It's not your turn");
        require(board[gameNum][x][y] == 0, "This field is already taken");

        board[gameNum][x][y] = turn[gameNum] == players[gameNum][0] ? 1 : 2;

        if (checkWin(gameNum, 1)) {
            winner[gameNum] = players[gameNum][0];
            status[gameNum] = GameStatus.Finished;
        } else if (checkWin(gameNum, 2)) {
            winner[gameNum] = players[gameNum][1];
            status[gameNum] = GameStatus.Finished;
        } else {
            turn[gameNum] = turn[gameNum] == players[gameNum][0]
                ? players[gameNum][1]
                : players[gameNum][0];
        }
    }

    function prize(uint256 gameNum) internal {
        require(status[gameNum] == GameStatus.Finished, "Game is not finished");
        require(msg.sender == winner[gameNum], "You are not the winner");

        (bool success, ) = msg.sender.call{value: 0.1 ether}("");
        require(success, "Transfer failed.");
    }

    function checkWin(uint256 gameNum, uint8 player) internal view returns (bool) {
        uint8[3][3] memory gameBoard = board[gameNum];

        // Check rows
        for (uint8 i = 0; i < 3; i++) {
            if (
                gameBoard[i][0] == player && gameBoard[i][1] == player && gameBoard[i][2] == player
            ) {
                return true;
            }
        }

        // Check columns
        for (uint8 j = 0; j < 3; j++) {
            if (
                gameBoard[0][j] == player && gameBoard[1][j] == player && gameBoard[2][j] == player
            ) {
                return true;
            }
        }

        // Check diagonals
        if (gameBoard[0][0] == player && gameBoard[1][1] == player && gameBoard[2][2] == player) {
            return true;
        }
        if (gameBoard[0][2] == player && gameBoard[1][1] == player && gameBoard[2][0] == player) {
            return true;
        }

        // No winner yet
        return false;
    }
}
