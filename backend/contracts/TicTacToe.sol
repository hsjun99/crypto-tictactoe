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
        require(status[gameNum] == GameStatus.Playing, "Game is not playing");

        uint8 playerIndex = turn[gameNum] == players[gameNum][0] ? 1 : 2;

        board[gameNum][x][y] = playerIndex;

        if (checkWin(gameNum, playerIndex)) {
            winner[gameNum] = players[gameNum][playerIndex];
            status[gameNum] = GameStatus.Finished;
            prize(gameNum);
            return;
        }

        turn[gameNum] = turn[gameNum] == players[gameNum][0]
            ? players[gameNum][1]
            : players[gameNum][0];

        if (checkTie(gameNum)) {
            status[gameNum] = GameStatus.Finished;
            tie(gameNum);
        }
    }

    function prize(uint256 gameNum) internal {
        require(status[gameNum] == GameStatus.Finished, "Game is not finished");
        require(msg.sender == winner[gameNum], "You are not the winner");

        (bool success, ) = winner[gameNum].call{value: 0.1 ether}("");
        require(success, "Transfer failed.");
    }

    function tie(uint256 gameNum) internal {
        require(status[gameNum] == GameStatus.Finished, "Game is not finished");

        (bool success1, ) = players[gameNum][0].call{value: 0.05 ether}("");
        (bool success2, ) = players[gameNum][1].call{value: 0.05 ether}("");
        require(success1 && success2, "Transfer failed.");
    }

    function checkTie(uint256 gameNum) internal view returns (bool) {
        uint8[3][3] memory gameBoard = board[gameNum];
        if (
            gameBoard[0][0] != 0 &&
            gameBoard[0][1] != 0 &&
            gameBoard[0][2] != 0 &&
            gameBoard[1][0] != 0 &&
            gameBoard[1][1] != 0 &&
            gameBoard[1][2] != 0 &&
            gameBoard[2][0] != 0 &&
            gameBoard[2][1] != 0 &&
            gameBoard[2][2] != 0
        ) {
            return true;
        } else {
            return false;
        }
    }

    function checkWin(uint256 gameNum, uint8 playerIndex) internal view returns (bool) {
        uint8[3][3] memory gameBoard = board[gameNum];

        // Check rows
        for (uint8 i = 0; i < 3; i++) {
            if (
                gameBoard[i][0] == playerIndex &&
                gameBoard[i][1] == playerIndex &&
                gameBoard[i][2] == playerIndex
            ) {
                return true;
            }
        }

        // Check columns
        for (uint8 j = 0; j < 3; j++) {
            if (
                gameBoard[0][j] == playerIndex &&
                gameBoard[1][j] == playerIndex &&
                gameBoard[2][j] == playerIndex
            ) {
                return true;
            }
        }

        // Check diagonals
        if (
            gameBoard[0][0] == playerIndex &&
            gameBoard[1][1] == playerIndex &&
            gameBoard[2][2] == playerIndex
        ) {
            return true;
        }
        if (
            gameBoard[0][2] == playerIndex &&
            gameBoard[1][1] == playerIndex &&
            gameBoard[2][0] == playerIndex
        ) {
            return true;
        }

        // No winner yet
        return false;
    }
}
