'use client';

import { useEffect, useState, useRef } from 'react';
import style from '@/app/style.module.css';
import { Problem } from '@/types/main';

function shuffleArray(array : (number | string)[]) : (number | string)[] {
  for (let i : number = array.length - 1; i > 0; i--) {
    const j : number = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomInt(max : number) : number{
  return Math.floor(Math.random() * max);
}

function getRandomOperator() : string{
  return (getRandomInt(2) < 1) ? "-" : "+";
}

function getNumberOfLifes(array : number[]) : number {
  return array.filter((x : number) => x === 1).length;
}

function removeLife(array:number[]) : number[] {
  let n = getNumberOfLifes(array) - 1;
  if(n >= 0){
    array[n] = 0;
  }
  return [...array];
}

function generateProblem(maxNum : number) : Problem {
  let totalElements : number = 2 + getRandomInt(2);
  let operators : string[] = [getRandomOperator(), "+"];
  let numbers : number[] = [];
  let problemString : string = "";
  let problemSolution : number = 0;

  for (let i : number = 0; i < totalElements; i++){
    let value : number = 1 + getRandomInt(maxNum);
    numbers.push(value);
  }
  numbers.sort((a : number,b : number) : number => b - a);
  for (let i : number = 0; i < totalElements; i++){
    if(i == 0){
      problemSolution = numbers[i];
      problemString = problemString + numbers[i];
    }else{
      problemSolution = problemSolution + ((operators[i-1] == "+") ? +(numbers[i]) : -(numbers[i]));
      problemString = problemString + ` ${operators[i-1]} ${numbers[i]}`;
    }
  }
  return {content: problemString, solution: problemSolution};

}

export default function Counter() {
  const [numbers, setNumbers] = useState<(number | string)[]>([0,1,2,3,4,5,6,7,8,9,"c","="]);
  const [result, setResult] = useState<string>("");
  const [problem, setProblem] = useState<Problem>({content: "6 + 4", solution: 10});
  const [hasStarted, setHasStarted] = useState<Boolean>(false);
  const [nLifes, setNLifes] = useState<number[]>([1,1,1]);
  const nLifesRef = useRef<number[]>(nLifes);
  const [nProblems, setNProblems] = useState<number>(1);
  const timerNode = useRef<HTMLDivElement>(null);

  const timer = useRef<any>();
  const currAnimation = useRef<Animation>();

  useEffect(() => {
    nLifesRef.current = nLifes;
  }, [nLifes]);

  useEffect(() => {
    console.log("trigger effect, nLifes = ", nLifesRef.current);
    if(hasStarted && getNumberOfLifes(nLifesRef.current) > 0){
      if(timerNode.current){
        console.log("setting animation");
        currAnimation.current = timerNode.current.animate([{ transform: "scaleX(0)" }], {duration: 10000, iterations: 1, fill: "forwards"});
        timer.current = setTimeout(() => {
          console.log("Failed to solve problem in time! nLifes = ", nLifesRef.current);
          if(getNumberOfLifes(nLifesRef.current) > 1){
            console.log("removing life")
            currAnimation.current?.cancel();
            setNLifes(removeLife(nLifesRef.current));
            setResult("");
            setProblem(generateProblem(100));
            setNProblems(nProblems+1);
          }else{
            setNLifes(removeLife(nLifesRef.current));
            console.log("GAME OVER!! (from timeout)");
            currAnimation.current?.finish();
          }
        }, 10000);
      }
    }else{
      console.log("the game is not started yet");
    }
    return () => {if (hasStarted) {clearInterval(timer.current)}};
  }, [hasStarted, nProblems]);

  return (
    <div>
      <p>
        life: {nLifes.map((x, i) =>
          <span key={i}> {(x === 1) ? "❤️" : "O"} </span>
        )}
      </p>
      {numbers.map((el : (number | string), idx : number) => {
          switch(el){
            case "=": return(
              <button key={idx} className={style.button} onClick={() => {
                //console.log(currAnimation);
                if(parseInt(result) == problem.solution && getNumberOfLifes(nLifes) > 0){
                  if(currAnimation.current){
                    currAnimation.current?.cancel();
                  }else{
                    console.log("WARNING!! The animation is not defined")
                  }
                  setResult("");
                  setProblem(generateProblem(100));
                  setNProblems(nProblems+1);
                }else{
                  console.log("wrong answer!");
                  if(getNumberOfLifes(nLifes) > 1){
                    console.log("removing life")
                    setNLifes(removeLife(nLifes));
                  }else{
                    console.log("removing life")
                    setNLifes(removeLife(nLifes));
                    if(currAnimation.current){
                      currAnimation.current.finish();
                    }else{
                      console.log("WARNING!! The animation is not defined")
                    }
                    console.log("GAME OVER!! (from wrong answer)");
                    clearInterval(timer.current);
                  }
                }
              }}>{el}</button>
            );
            case "c": return(
              <button key={idx} className={style.button} onClick={() => {
                if(result != ""){
                  setResult(result.substring(0, result.length - 1));
                }
              }}>{el}</button>
            );
            default: return(
              <button key={idx} className={style.button} onClick={() => {
                if(!hasStarted){
                  setHasStarted(true);
                }
                if(result.length > 0 || el != 0){
                  setResult(result + el);
                }
              }}>{el}</button>
            );
          }
        }
      )}
      <button onClick={() => {
        setNumbers(shuffleArray([0,1,2,3,4,5,6,7,8,9,"c","="]))
      }}>shuffle</button>
      <p>{result}</p>
      <hr></hr>
      <p>
        ["string" : {problem.content}, "solution" : {problem.solution}]
      </p>
      <button onClick={() => {
        setProblem(generateProblem(100));
      }}>new problem</button>
            
      <div className={style.timer_holder}>
        <div className={style.timer_content} ref={timerNode}></div>
      </div>
    </div>
  );
}
