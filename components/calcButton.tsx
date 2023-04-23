'use client';

import style from '@/app/calcbutton.module.css';
import { useState } from 'react';

type Props = {
  el: (number | string);
  submitAnswer: () => void;
  deleteNumber: () => void;
  addNumber: (e: (number | string)) => void;
};

export default function CalcButton({el, submitAnswer, deleteNumber, addNumber} : Props) {

  const [pressed, setPressed] = useState<boolean>(false);

  function press(){
    setPressed(true);
  }

  function unpress(){
    setPressed(false);
  }

  return(
    <div className={style.button_item_holder} onMouseLeave={unpress}>
      <div className={style.button_back}/>
      {{
        '=': <button className={style.button_item} onMouseDown={press} onMouseUp={unpress} style={{left: (pressed) ? '0px' : '2px'}}onClick={submitAnswer}>{el}</button>,
        'c': <button className={style.button_item} onMouseDown={press} onMouseUp={unpress} style={{left: (pressed) ? '0px' : '2px'}}onClick={deleteNumber}>{el}</button>
      }[el] || <button className={style.button_item} onMouseDown={press} onMouseUp={unpress} style={{left: (pressed) ? '0px' : '2px'}}onClick={() => {addNumber(el)}}>{el}</button>
      }
    </div>
  )
}
