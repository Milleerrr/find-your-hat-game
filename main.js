const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field = []) {
        this.field = field;
        this.userLocation = {
            x: 0,
            y: 0
        };
    }
    getField() {
        console.clear();
        const joinedField = this.field.map(e => (e.join(''))).join('\n');
        console.log(joinedField);
    }
    exitGame() {
        this.userLocation.x = 0;
        this.userLocation.y = 0;

        const userChoice = prompt('Do you want to play again, Y or N? ').toUpperCase();
        if (userChoice === 'Y') {
            this.startGame();
        } else {
            console.log('Thanks for playing!');
        }
    }
    generateField() {
        const rows = 12;
        const columns = 16;
        const fieldArray = [];

        for (let i = 0; i < rows; i++) {
            fieldArray[i] = [];
            for (let j = 0; j < columns; j++) {
                // Generate a random number between 0 and 1
                const random = Math.random();

                // Assign a hole if the random number is less than 0.2 (20% chance)
                // Assign a field character otherwise
                fieldArray[i][j] = random < 0.2 ? hole : fieldCharacter;
            }
        }

        // Place the hat at a random location
        const randomX = Math.floor(Math.random() * rows);
        const randomY = Math.floor(Math.random() * columns);
        fieldArray[randomX][randomY] = hat;

        // Place user on the grid
        fieldArray[this.userLocation.x][this.userLocation.y] = pathCharacter;

        this.field = fieldArray;
    }
    startGame() {
        this.generateField();
        console.log('Welcome! Navigate around the map using U, D, L, R.');
        this.getField();
        this.userInput();
    }
    userInput() {
        const userDirection = prompt('Which way? ').toUpperCase();
        this.updateLocation(userDirection);
    }
    updateLocation(userDirection) {
        const newX = this.userLocation.x;
        const newY = this.userLocation.y;

        switch (userDirection) {
            case 'U':
                this.userLocation.x -= 1;
                break;
            case 'D':
                this.userLocation.x += 1;
                break;
            case 'L':
                this.userLocation.y -= 1;
                break;
            case 'R':
                this.userLocation.y += 1;
                break;
            default:
                console.log('Invalid input. Enter U, D, L, or R.');
                this.exitGame();
        }
        if (this.isHole()) {
            console.log('Oops! You fell into a hole. Game over.');
            this.exitGame();
        } else if (this.isUserOnHat()) {
            console.log('Congratulations! You have found the hat.');
            this.exitGame();
        } else if (this.isOutOfBounds()) {
            console.log('Oops! You fell of the each of the map!');
            this.exitGame();
        } else {
            this.field[newX][newY] = pathCharacter;
            this.field[this.userLocation.x][this.userLocation.y] = pathCharacter;
            this.getField();
            this.userInput();
        }
    }
    isOutOfBounds() {
        const { x, y } = this.userLocation;
        const numRows = this.field.length;
        const numCols = this.field[0].length;
        return x < 0 || x >= numRows || y < 0 || y >= numCols;
    }
    isHole() {
        return this.field[this.userLocation.x][this.userLocation.y] === hole;
    }
    isUserOnHat() {
        const { x, y } = this.userLocation;
      
        if (this.field[x][y] === hat) {
          return true;
        }
        return false;
      }  
};

const newField = new Field();

newField.startGame();
