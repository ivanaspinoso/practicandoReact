import { useState } from 'react'
import './App.css'

import { Square } from './components/Square'
import { TURNS } from './constants'
import { checkWinnerFrom } from './logic/board'
import { Winner } from './components/Winner'
import { checkEndGame } from './logic/board'

function App() {
//es un estado que tiene un array de longitud 9 inicializado con valores nulos, que representa las posiciones del tablero del juego
  const [board, setBoard] = useState(()=> {

    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

//es un estado que indica el turno actual del jugador,comenzando con X
const [turn,setTurn]=useState(()=>{
  const turnFromStorage= window.localStorage.getItem('turn')  
  return turnFromStorage ?? TURNS.X
})

const [winner,setWinner]=useState(null)// null es que no hay ganador, false es que hay un empate

const updateBoard = (index) => {
  //si no actualizamos esta posicion
  //si ya tiene algo o hay un ganador:
  if(board[index] || winner ) return 

  //actualizar el tablero
  const newBoard = [...board] // se hace una copia del array y se modifica ese array nuevo => spread operator
  newBoard[index] = turn // x u o

  //cambia el turno del jugador cuando se llama, si el turno actual es X, cambiara a O,y viceversa
  const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X

  setBoard(newBoard)
  setTurn(newTurn)

  //guardar aqui la partida
  window.localStorage.setItem('board', JSON.stringify(newBoard))
  window.localStorage.setItem('turn', newTurn)

  //revisar si hay ganador
  const newWinner = checkWinnerFrom(newBoard)
  if(newWinner){
    setWinner(newWinner)
  } else if (checkEndGame(newBoard)){
    setWinner(false) //empate
  }
}

const resetGame =()=>{
  setBoard(Array(9).fill(null))
  setTurn(TURNS.X)
  setWinner(null)

  window.localStorage.removeItem('board')
  window.localStorage.removeItem('turn')
}

  return (
    <main className='board'> 
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset del juego</button>

      <section className="game">
        {
          board.map((square, index) => {
            return (
              <Square 
              key={index}
              index={index}
              updateBoard={updateBoard}
                >
                  {square}
                </Square>
            )
          })
        }
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
          </Square>
        <Square isSelected={turn===TURNS.O}>
          {TURNS.O}
          </Square>

      </section>

      <Winner resetGame={resetGame} winner={winner}/>
    </main>
  )
}

export default App


