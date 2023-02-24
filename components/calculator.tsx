'use client';

import { useState } from 'react';
import style from '@/app/style.module.css';

function shuffleArray(array : (number | string)[]) : (number | string)[] {
  for (let i : number = array.length - 1; i > 0; i--) {
    const j : number = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function Counter() {
  const [numbers, setNumbers] = useState<(number | string)[]>([0,1,2,3,4,5,6,7,8,9,"="]);
  const [result, setResult] = useState<string>("");


  return (
    <div>
      {numbers.map((el : (number | string), idx : number) => 
        (el == "=") ? 
        <button key={idx} className={style.button} onClick={() => {
          setResult("");
        }}>{el}</button>
        :
        <button key={idx} className={style.button} onClick={() => {
          setResult(result + el);
        }}>{el}</button>
      )}
      <button onClick={() => {
        setNumbers(shuffleArray([0,1,2,3,4,5,6,7,8,9,"="]))
      }}>shuffle</button>
      <p>{result}</p>
    </div>
  );
}
