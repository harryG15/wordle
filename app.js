const tileDisplay = document.querySelector('.tile-container')  //selecting class div to use here
const keyboard = document.querySelector('.key-container')  //selecting class div to use here
const messageDisplay = document.querySelector('.message-container')  //selecting message - from showMessage


let worlde

const getWordle = () => {
    fetch('http://localhost:5000')
        .then(response => response.json())
        .then (json => {
            console.log(json)
            wordle = json.toUpperCase()
    })
    .catch(err => console.log(err))
}

getWordle()  //initiating the fetching of randomised api word (enabling it to be used in the game below as 'wordle')

const keys = [    
'Q',
'W',
'E',
'R',
'T',
'Y',
'U',
'I',
'O',
'P',
'A',
'S',
'D',
'F',
'G',
'H',
'J',
'K',
'L',
'ENTER',
'Z',
'X',
'C',
'V',
'B',
'N',
'M',
'DEL',  //backspace
]

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]
let currentRow = 0  //our current positions
let currentTile = 0
let isGameOver = false


//Below is creating the id's and divs for each tile!

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')  //creating a div
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)  //div gets an id='guessRow-(index)'

    guessRow.forEach((guess, guessIndex) => {  //within each row (e.g. guessRow-0), go through all 5 items in array
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add('tile') //adds tile class (which gives all spaced box tiles visible)
        rowElement.append(tileElement)  //placing a div within an outer div
    })

    tileDisplay.append(rowElement)  //adding rowElement to tileDisplay ( all of the 6 tiles. meaning guessRow-0 to 5)
})

keys.forEach(key => {  //for each key, that exists in my array, create 'button' tag
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key  //give each button text element 'key'
    buttonElement.setAttribute('id', key)  //setting 'id' to the key
    buttonElement.addEventListener('click', () => handleClick(key))  //handleClick is waiting for a 'key' to be clicked to show 'clicked' and letter
    keyboard.append(buttonElement)  //keyboard variable (the landscape box) plus all the buttons/letters above
})

const handleClick = (letter) => {  // prop above - passed into here, but can call it anything
    if (!isGameOver) {

    console.log('clicked', letter)  //whenever click, console log 'clicked' with the specific button letter.
    if (letter === 'DEL') {
        deleteLetter() //returns out of sequence BEFORE we can 'addLetter'
        return
    }
    if (letter === 'ENTER') {  //similar here
        checkRow()
        return
    }
    addLetter(letter)  //letter passed into function 'addLetter'
    
    }
}

const addLetter = (letter) => {  // getting the current tile & declaring it as the letter to use above
    if (currentTile < 5 && currentRow < 6) {

        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = letter
        guessRows[currentRow][currentTile] = letter  //replacing that tile with the now 'clicked' letter
        tile.setAttribute('data', letter)  //allows colours to be used for the letter
        currentTile++  //moving along the row - for next time
    }
}

const deleteLetter = () => {
    if (currentTile > 0) {

        currentTile--
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = ''  //making the content of previous tile = nothing
        guessRows[currentRow][currentTile] = ''  //whilst also resetting the guesses - so you can have another try until you reach 5
        tile.setAttribute('data', '')  //resetting the colors
    }
}

const checkRow = () => {
    const guess = guessRows[currentRow].join('')  //The word joined up

        if (currentTile > 4) {
            fetch(`http://localhost:5000/?word=${guess}`)  //passing through the word we want to check
            .then(response => response.json())
            .then(json => {
                if (json == 'Entry word not found') {  //if the word they entered isn't in the 'dictionary api', this message will show
                        showMessage("Not a real word!")
                    return
                 } else {
                        console.log('guess is ' + guess, 'wordle is ' + wordle)
                flipTile()
                if (wordle == guess) {  //If the 'goal word' is the same as the 'guess word'
                        showMessage('Congratulations!')
                        isGameOver = true
                    return
                } else {
                    if (currentRow >= 5) {  //If you try to add more letters past the 5th row, you'll get 'Game Over'
                        isGameOver = true
                        showMessage('Game Over')
                    return
                    }
                    if (currentRow < 5) {  //If you didn't get the answer after clicking enter, you go onto the next row from the start
                        currentRow++
                        currentTile = 0
                    }
                }
            }
        }).catch(err => console.log(err))

    }
}

const showMessage = (message) => {
    const messageElement = document.createElement('p')  //creates p tag
    messageElement.textContent = message  //whatever's inside the p tag = the 'message' which is our function prop!
    messageDisplay.append(messageElement)
    setTimeout(() => messageDisplay.removeChild(messageElement), 3000)  //remove child is the opposite of append. 
}




const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes  //childNodes grabs all of individual tile id's
    const guess = []  //push guesses with colors attach
    let checkWordle = wordle  //removes letters from wordle when check

        rowTiles.forEach(tile => {
            guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay'})  //for each tile in the row, get the id & color(as default)
     })

        guess.forEach((guess, index) => {
            if (guess.letter == wordle[index]) {  //if each letter within the guess = the wordle letter in the CORRECT spot... make it green
                guess.color = 'green-overlay'
                checkWordle = checkWordle.replace(guess.letter, '')
            }
     })

        guess.forEach(guess => {  //if for example, the word 'SUPER' includes the guess.letter, make it yellow
            if (checkWordle.includes(guess.letter)) {
               guess.color = 'yellow-overlay'
            }
        })
    
     rowTiles.forEach((tile, index) => {
            const dataLetter = tile.getAttribute('data')  //e.g. dataLetter now = 'S'

            setTimeout(() => {
                tile.classList.add(guess[index].color)
                addColorToKey(guess[index].letter, guess[index].color)

            }, 500 * index)  //want each one to flip after 500ms and increment each one by the index
        })
    }