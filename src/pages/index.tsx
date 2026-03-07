import Header from "@/components/header";
import LetterButton from "@/components/letter-button";
import Image from "next/image";
import { replaceAt } from "@/helper";
import { useState } from "react";

interface WordData {
  word: string;
  hint: string;
  explain: string;
  img: string;
}

const Game = () => {
  const [gameState, setGameState] = useState("pregame");
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  const [explain, setExplain] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [guess, setGuess] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([] as string[]);

  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [correctGuessesRequired, setCorrectGuessesRequired] = useState(0);
  const MAX_INCORRECT_GUESSES = 5;
  const hangmanFrames = [
    "/images/hangman1.png",
    "/images/hangman2.png",
    "/images/hangman3.png",
    "/images/hangman4.png",
    "/images/hangman5.png",
    "/images/hangman6.png",
    "/images/hangman7.png",
    "/images/hangman8.png",
  ]

  const [heroesChecked, setHeroesChecked] = useState(true);
  const [mapsChecked, setMapsChecked] = useState(true);
  const [abilitiesChecked, setAbilitiesChecked] = useState(true);

  const getWordData = async () => {
    // Fetch and select a random word from the datase
    const wordData: WordData[] = [];
    const res = await fetch("/data.json");
    const data = await res.json();
    // Handle category selection based on pregame checkboxes
    if (heroesChecked) {
      data.Heroes.forEach((hero: WordData) => {
        wordData.push(hero);
      });
    }
    if (mapsChecked) {
      data.Maps.forEach((map: WordData) => {
        wordData.push(map);
      });
    }
    if (abilitiesChecked) {
      data.Abilities.forEach((ability: WordData) => {
        wordData.push(ability);
      });
    }

    if (wordData.length === 0) {
      return null;
    }
    const index = Math.floor(Math.random() * wordData.length);
    return {
      word: wordData[index].word,
      hint: wordData[index].hint,
      explain: wordData[index].explain,
      imgSrc: wordData[index].img
    };
  }

  //#region State Management

  const startGame = async () => {
    // Initialize word and guess
    const wordData = await getWordData();
    if (!wordData) {
      alert("Select at least one category to start the game.");
      return;
    }
    setWord(wordData.word);
    setHint(wordData.hint);
    setExplain(wordData.explain);
    setImgSrc(wordData.imgSrc);

    // Handle spaces in word
    let tempGuess = "";
    for (let i = 0; i < wordData.word.length; i++) {
      tempGuess += wordData.word[i] === " " ? "‎ " : "_ ";
    }
    setGuess(tempGuess);

    setGuessedLetters([]);
    setIncorrectGuesses(0);
    setCorrectGuesses(0);
    // Don't count space
    let tempCorrectGuessesRequired = (new Set(wordData.word)).size;
    if (wordData.word.includes(" ")) tempCorrectGuessesRequired--;
    setCorrectGuessesRequired(tempCorrectGuessesRequired);

    setGameState("in-progress");
  }

  const pregame = () => {
    setGameState("pregame");
  }

  const postgame = () => {
    setGameState("postgame");
  }

  //#endregion

  const guessLetter = (letter: string) => {
    setGuessedLetters([...guessedLetters, letter]);

    // Handle incorrect guess
    if (!word.includes(letter)) {
      setIncorrectGuesses(incorrectGuesses + 1);
      // Check lose condition
      if (incorrectGuesses >= MAX_INCORRECT_GUESSES) setTimeout(postgame, 500);
      return;
    }

    // Handle correct guess
    let index = word.indexOf(letter);
    let tempGuess = guess;
    while (index !== -1) {
      tempGuess = replaceAt(tempGuess, index * 2, letter);
      index = word.indexOf(letter, index + 1);
    }
    setGuess(tempGuess);

    // Check win condition
    if (correctGuesses >= correctGuessesRequired - 1)
      setTimeout(postgame, 500);
    setCorrectGuesses(correctGuesses + 1);
  }

  //#region Display Components

  const pregameDisplay = () => {
    return (
      <div className="text-center">
        <Image
          src="/images/hangman1.png" alt="hangman display" id="hangman-display"
          width={0} height={0}
          sizes="100vh"
          style={{ width: "auto", height: "10vh" }}
        />
        <br />
        <br />

        {/* Pregame configurations */}
        <div className="d-flex justify-content-center align-items-center">
          <div className="form-check text-start">
            <input className="form-check-input" type="checkbox" id="hero-name-check" checked={heroesChecked} onChange={(event) => setHeroesChecked(event.target.checked)} />
            <label className="form-check-label" htmlFor="hero-name-check">Hero names</label>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <div className="form-check text-start">
            <input className="form-check-input" type="checkbox" id="map-name-check" checked={mapsChecked} onChange={(event) => setMapsChecked(event.target.checked)} />
            <label className="form-check-label" htmlFor="map-name-check">Map names</label>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <div className="form-check text-start">
            <input className="form-check-input" type="checkbox" id="ability-name-check" checked={abilitiesChecked} onChange={(event) => setAbilitiesChecked(event.target.checked)} />
            <label className="form-check-label" htmlFor="ability-name-check">Ability names</label>
          </div>
        </div>
        {/* <div className="d-flex justify-content-center align-items-center">
          <div className="form-check text-start">
            <input className="form-check-input" type="checkbox" id="other-check" checked={otherChecked} onChange={(event) => setOtherChecked(event.target.checked)} />
            <label className="form-check-label" htmlFor="other-check">Other</label>
          </div>
        </div> */}

        <br />
        <button type="button" className="btn btn-info" onClick={startGame}>Start Game</button>
      </div>
    )
  }

  const gameDisplay = () => {
    return (
      <div className="text-center">
        <p className="fs-4">{hint}</p>
        <Image
          src={hangmanFrames[incorrectGuesses]} alt="hangman state" id="hangman-state"
          width={0} height={0}
          sizes="100vh"
          style={{ width: "auto", height: "10vh" }}
        />
        <br />
        <br />
        <p className="fs-1">{guess}</p>
        <div>
          <LetterButton letter="A" onClick={() => guessLetter("A")} disabled={guessedLetters.includes("A")} />
          <LetterButton letter="B" onClick={() => guessLetter("B")} disabled={guessedLetters.includes("B")} />
          <LetterButton letter="C" onClick={() => guessLetter("C")} disabled={guessedLetters.includes("C")} />
          <LetterButton letter="D" onClick={() => guessLetter("D")} disabled={guessedLetters.includes("D")} />
          <LetterButton letter="E" onClick={() => guessLetter("E")} disabled={guessedLetters.includes("E")} />
          <LetterButton letter="F" onClick={() => guessLetter("F")} disabled={guessedLetters.includes("F")} />
          <br />
          <LetterButton letter="G" onClick={() => guessLetter("G")} disabled={guessedLetters.includes("G")} />
          <LetterButton letter="H" onClick={() => guessLetter("H")} disabled={guessedLetters.includes("H")} />
          <LetterButton letter="I" onClick={() => guessLetter("I")} disabled={guessedLetters.includes("I")} />
          <LetterButton letter="J" onClick={() => guessLetter("J")} disabled={guessedLetters.includes("J")} />
          <LetterButton letter="K" onClick={() => guessLetter("K")} disabled={guessedLetters.includes("K")} />
          <LetterButton letter="L" onClick={() => guessLetter("L")} disabled={guessedLetters.includes("L")} />
          <br />
          <LetterButton letter="M" onClick={() => guessLetter("M")} disabled={guessedLetters.includes("M")} />
          <LetterButton letter="N" onClick={() => guessLetter("N")} disabled={guessedLetters.includes("N")} />
          <LetterButton letter="O" onClick={() => guessLetter("O")} disabled={guessedLetters.includes("O")} />
          <LetterButton letter="P" onClick={() => guessLetter("P")} disabled={guessedLetters.includes("P")} />
          <LetterButton letter="Q" onClick={() => guessLetter("Q")} disabled={guessedLetters.includes("Q")} />
          <LetterButton letter="R" onClick={() => guessLetter("R")} disabled={guessedLetters.includes("R")} />
          <br />
          <LetterButton letter="S" onClick={() => guessLetter("S")} disabled={guessedLetters.includes("S")} />
          <LetterButton letter="T" onClick={() => guessLetter("T")} disabled={guessedLetters.includes("T")} />
          <LetterButton letter="U" onClick={() => guessLetter("U")} disabled={guessedLetters.includes("U")} />
          <LetterButton letter="V" onClick={() => guessLetter("V")} disabled={guessedLetters.includes("V")} />
          <LetterButton letter="W" onClick={() => guessLetter("W")} disabled={guessedLetters.includes("W")} />
          <LetterButton letter="X" onClick={() => guessLetter("X")} disabled={guessedLetters.includes("X")} />
          <br />
          <LetterButton letter="Y" onClick={() => guessLetter("Y")} disabled={guessedLetters.includes("Y")} />
          <LetterButton letter="Z" onClick={() => guessLetter("Z")} disabled={guessedLetters.includes("Z")} />
        </div>
        <hr />
        <button type="button" className="btn btn-danger" onClick={pregame}>End Game</button>
      </div>
    )
  }

  const postgameDisplay = () => {
    return (
      <div className="text-center">
        <p className="fs-4">{hint}</p>
        <Image
          src={hangmanFrames[incorrectGuesses >= MAX_INCORRECT_GUESSES ? 7 : incorrectGuesses]}
          alt="hangman state"
          width={0} height={0}
          sizes="100vh"
          style={{ width: "auto", height: "10vh" }}
        />
        <br />
        <br />
        {
          incorrectGuesses > MAX_INCORRECT_GUESSES ?
            <p className="fs-4 text-danger">Oops! The correct word is:</p> :
            <p className="fs-4 text-success">You got it! The correct word is:</p>
        }
        <p className="fs-1">{word}</p>
        <div className="row">
          <div className="col text-end">
          </div>
          <div className="col text-start">
          </div>
        </div>
        <Image
          src={imgSrc} alt="word image"
          width={0} height={0}
          sizes="100vh"
          style={{ width: "auto", height: "20vh", borderRadius: "10px", backgroundColor: "#333333" }}
        />
        <br />
        <br />
        <p className="fs-5">{explain}</p>
        <div className="row">
          <div className="col text-end">
            <button type="button" className="btn btn-info" onClick={startGame}>Restart</button>
          </div>
          <div className="col text-start">
            <button type="button" className="btn btn-primary" onClick={pregame}>Back</button>
          </div>
        </div>
      </div>
    )
  }

  //#endregion

  return (
    <main className="container">
      <Header />
      <hr />
      {
        gameState === "pregame" ? pregameDisplay() :
          gameState === "in-progress" ? gameDisplay() :
            gameState === "postgame" ? postgameDisplay() :
              <></>
      }
    </main>
  )
}

export default Game;
