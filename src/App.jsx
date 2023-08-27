import React, { useState, useEffect, useCallback } from 'react';
import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import marioTheme from '../src/assets/Theme_Super_Mario_ World.mp3';
import gameOverTheme from '../src/assets/Super_Mario_Bros_Underworld_Theme.mp3';

import './App.css';
import marioGif from '../src/assets/mario.gif';
import pipePng from '../src/assets/pipe.png';
import cloudsGif from '../src/assets/clouds.png';
import gameOverPng from '../src/assets/game-over.png';
import gameOver from '../src/assets/gameOverLogo.png';
import restart from '../src/assets/restartButton.png';
import scoreImg from '../src/assets/score.png';

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [background, setBackground] = useState("#87CEEB");
  const [pipeAnimationDuration, setPipeAnimationDuration] = useState(1.5);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [touchJump, setTouchJump] = useState(false);

  function toggleSound() {
    setIsSoundOn(!isSoundOn);
  }

  const handleTouchJump = useCallback(() => {
    if (!isGameOver) {
      mario.classList.add('jump');

      setTimeout(() => {
        mario.classList.remove('jump');
      }, 500);
    }
  }, [isGameOver]);

  useEffect(() => {
    const savedSoundPreference = localStorage.getItem('isSoundOn');
    if (savedSoundPreference === 'false') {
      setIsSoundOn(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isSoundOn', isSoundOn);
  }, [isSoundOn]);

useEffect(() => {
  const mario = document.querySelector('.mario');
  const pipe = document.querySelector('.pipe');
  let gameAudio = new Audio(marioTheme);
  let gameOverAudio = new Audio(gameOverTheme);

  const jump = () => {
    if (!isGameOver) {
      mario.classList.add('jump');

      setTimeout(() => {
        mario.classList.remove('jump');
      }, 500);
    }
  };

  const checkCollision = () => {
    if (isGameOver) return;

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (score >= 500 * difficultyLevel) {
      setPipeAnimationDuration(prevDuration => prevDuration - 0.2);
      setDifficultyLevel(prevLevel => prevLevel + 1);
    }
  
    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
      setIsGameOver(true);

      pipe.style.animation = 'none';
      pipe.style.left = `${pipePosition}px`;

      mario.style.animation = 'none';
      mario.style.bottom = `${marioPosition}px`;

      mario.src = gameOverPng;
      mario.style.width = '75px';
      mario.style.marginLeft = '50px';

      setShowModal(true);
      clearInterval(intervalRef.current);

      gameAudio.pause();
      gameOverAudio.play();
    } else {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const interval = setInterval(() => {
    checkCollision();
  }, 10);

  const intervalTime = setInterval(() => {
    if (!isGameOver) {
      setBackground((prevColor) => {
        if (prevColor === "#87CEEB") {
          return "#A8DADC";
        } else if (prevColor === "#A8DADC") {
          return "#E0F6FF";
        } else if (prevColor === "#120c56") {
          return "#000000";
        } else {
          return "#87CEEB";
        }
      });
    }
  }, 5000);
  document.addEventListener('keydown', jump);
  document.addEventListener('touchstart', handleTouchJump);
  document.addEventListener('touchend', handleTouchJump);

  return () => {
    clearInterval(interval, intervalTime);
    document.removeEventListener('keydown', jump);
    document.removeEventListener('touchstart', handleTouchJump);
    document.removeEventListener('touchend', handleTouchJump);
  };
}, [isGameOver]);

  const restartGame = () => {
    window.location.reload();
  };

  return (
    <>
    {isGameOver ? (
      <audio src={gameOverTheme} autoPlay loop muted={!isSoundOn} />
    ) : (
      <audio src={marioTheme} autoPlay loop muted={!isSoundOn} />
    )}
<div className="game-board" style={{ backgroundImage: `linear-gradient(${background}, #E0F6FF)` }}>
        <img src={cloudsGif} className="clouds" />
        <img src={marioGif} className="mario" />
        <img src={pipePng} className="pipe" style={{ animation: `pipe-animation ${pipeAnimationDuration}s infinite linear` }} />
        <h2 className="score">
          <img className="scoreImg" src={scoreImg} alt="Score" />: {score}
          <Button
            style={{ marginLeft: 10 }}
            icon={isSoundOn ? <AudioOutlined /> : <AudioMutedOutlined />}
            onClick={toggleSound}
          ></Button>
        </h2>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="top">
                <h2>
                  <img className="gameOver" src={gameOver} />
                </h2>
              </div>
              <div className="middle">
                <p>SCORE: {score}</p>
              </div>
              <div className="bottom">
                <button onClick={restartGame} className="button">
                  <img className="restar" src={restart} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
