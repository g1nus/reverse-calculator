'use client';

import style from '@/app/calcbutton.module.css';
import { useEffect, useState, useRef } from 'react';

type Props = {
  el: (number | string);
  submitAnswer: () => void;
  deleteNumber: () => void;
  addNumber: (e: (number | string)) => void;
  playAudio: (audio: (HTMLAudioElement | null)) => void;
};

export default function CalcButton({el, submitAnswer, deleteNumber, addNumber, playAudio} : Props) {

  const isInitialMount = useRef<boolean>(true);

  const [pressed, setPressed] = useState<boolean>(false);

  const [flash, setFlash] = useState<boolean>(false);

  const clickAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setFlash(true);
      setTimeout(() => {
        setFlash(false);
      }, 100)
    }
  }, [el])

  function press(){
    playAudio(clickAudioRef.current);
    setPressed(true);
  }

  function unpress(){
    setPressed(false);
  }

  return(
    <div className={style.button_item_holder} onMouseLeave={unpress}>
      <div className={style.button_mid}/>
      {{
        '=': <button className={style.button_item} onMouseDown={press} onMouseUp={unpress} style={{transform: `translateX(${pressed ? 0 : 3}px)`, backgroundColor: (flash) ? "grey": "white", color: (flash) ? "white": "black"}} onClick={submitAnswer}>{el}</button>,
        'C': <button className={style.button_item} onMouseDown={press} onMouseUp={unpress} style={{transform: `translateX(${pressed ? 0 : 3}px)`, backgroundColor: (flash) ? "grey": "white", color: (flash) ? "white": "black"}} onClick={deleteNumber}>{el}</button>
      }[el] || <button className={style.button_item} onMouseDown={press} onMouseUp={unpress} style={{transform: `translateX(${pressed ? 0 : 3}px)`, backgroundColor: (flash) ? "grey": "white", color: (flash) ? "white": "black"}} onClick={() => {addNumber(el)}}>{el}</button>
      }
      <div className={style.button_front} style={{transform: `translateX(${pressed ? 0 : 3}px)`}}/>
      <div className={style.button_back}/>
      <audio src="./click.mp3" ref={clickAudioRef}/>
    </div>
  )
}
