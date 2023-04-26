'use client';

import { useEffect, useState, useRef } from 'react';
import style from '@/app/calculator.module.css';
import { Problem, SolutionNumber } from '@/types/main';
import { shuffleArray, getNumberOfLifes, removeLife, generateProblem, getSolutionValue, compareSolutions, generateTime } from '@/utils/main';
import Heart from './heart';
import CalcButton from './calcButton';
import NumberItem from './numberItem';


//============================================
// add levels
// -> generate problems based on number of successes
// -> shuffle buttons depending on number of successes (either on new level or also on click)
// add music
// make responsive
// style fonts, colors and proportions
// fix types "any"
//============================================
export default function Counter() {
  // manages the calculator keyboard
  const [numbers, setNumbers] = useState<(number | string)[]>([1,2,3,4,5,6,7,8,9,"C",0,"="]);
  // manages the typed result
  const [result, setResult] = useState<SolutionNumber[]>([]);
  // keeps track of the problem to solve
  const [problem, setProblem] = useState<Problem>({content: "5 + 5", solution: 10, display: true});
  // flag for starting the game (as soon as the first number is typed)
  const [hasStarted, setHasStarted] = useState<Boolean>(false);
  // keeps track of the three available lifes
  const [nLifes, setNLifes] = useState<number[]>([1,1,1]);
  // reference to use inside of timeout for the life
  const nLifesRef = useRef<number[]>(nLifes);
  // keeps track of the number of problems seen, mostly used for triggering the timeout when a new problem is rendered
  const [nProblems, setNProblems] = useState<number>(1);
  // keeps track of the problems solved successfully
  const [nSuccessProblems, setNSuccessProblems] = useState<number>(0);

  // html node displaying the timer animation
  const timerNode = useRef<HTMLDivElement>(null);
  // actual timeout variable
  const timer = useRef<any>();
  // animation variable for managing start, clear and finish
  const currAnimation = useRef<Animation>();
  // timer duration
  const timerDuration = useRef<number>(10000);

  // effect used for tracking the lifes inside the references
  useEffect(() => {
    nLifesRef.current = nLifes;
  }, [nLifes]);

  // effect for shuffling buttons on level changes
  useEffect(() => {
    //=============
    // this shuffle should be stopped once the suffle per click will happen <-----------------
    //=============
    if(nSuccessProblems > 5) {
      setNumbers(shuffleArray([0,1,2,3,4,5,6,7,8,9,"C","="]))
    }
  }, [nSuccessProblems])

  // effect for managing the answer countdown, triggered on hasStarted and nProblems update
  useEffect(() => {
    console.log("trigger effect, nLifes = ", nLifesRef.current, " nProblems = ", nProblems, " hasStarted = ", hasStarted);

    // timeout logic can be executed only if the game has started and there's at least one life left
    if(hasStarted && getNumberOfLifes(nLifesRef.current) > 0){
      // safety check: the HTML node representing the times must be defined
      if(timerNode.current){
        console.log("setting animation, timer duration = ", timerDuration.current, " successes = ", nSuccessProblems);
        // start animation
        currAnimation.current = timerNode.current.animate([{ transform: "scaleX(0)" }], {duration: timerDuration.current, iterations: 1, fill: "forwards"});

        // and trigger timeout at the end of the animation time. If triggered it will generate a new problem and remove one life
        timer.current = setTimeout(() => {
          console.log("Failed to solve problem in time! nLifes = ", nLifesRef.current);
          // if the user has some lifes left then remove 1 life
          if(getNumberOfLifes(nLifesRef.current) > 1){
            console.log("removing life")
            // cancel animation (should be defined)
            currAnimation.current?.cancel();
            setNLifes(removeLife(nLifesRef.current));
            setResult([]);
            setProblem(generateProblem(nSuccessProblems));
            // increase number of problems, to trigger effect for timeout again
            setNProblems(nProblems+1);
          // otherwise it's game over
          }else{
            // remove last life
            setNLifes(removeLife(nLifesRef.current));
            console.log("GAME OVER!! (from timeout)");
            // stop timer animation
            currAnimation.current?.finish();
          }
        }, timerDuration.current);

      }
    }else{
      console.log("the game is not started yet or no more lifes left");
    }

    // clear interval on unmount
    return () => {if (hasStarted) {clearInterval(timer.current)}};
  }, [hasStarted, nProblems]);

  // this function manages the logic of submitting an answer
  function submitAnswer(){
    let currentResult : number = getSolutionValue(result);
    //console.log(currAnimation);

    // if the solution is a number and it's right and there are still lifes left
    if(!isNaN(currentResult) && currentResult == problem.solution && getNumberOfLifes(nLifes) > 0){
      // safety check (the animation should be defined)
      if(currAnimation.current){
        // cancel the timer animation
        currAnimation.current.cancel();
      }else{
        // it should never enter here
        console.log("WARNING!! The animation is not defined");
      }

      // reset to a new problem and increment the number of poblems to trigger a new run of the timer effect
      setNSuccessProblems(nSuccessProblems + 1);
      // as the user solves more levels then the available time interval may change
      timerDuration.current = generateTime(nSuccessProblems);
      setResult([]);
      setProblem(generateProblem(nSuccessProblems));
      setNProblems(nProblems+1);
    
    // otherwise it's a wrong answer, execute logic only if there are lifes left. It doesn't generate a new problem
    }else if(!isNaN(currentResult) && getNumberOfLifes(nLifes) > 0 && hasStarted){
      let wrongNumbers : number[] = compareSolutions(problem.solution, currentResult);
      let newResultFormat = result;
      wrongNumbers.map((i) => {
        newResultFormat[i].flash = !newResultFormat[i].flash;
      })
      setResult(newResultFormat);

      console.log("wrong answer!", wrongNumbers);
      console.log("removing life")
      setNLifes(removeLife(nLifes));

      // check for gameover case
      if(getNumberOfLifes(nLifes) === 0){
        if(currAnimation.current){
          currAnimation.current.finish();
        }else{
          console.log("WARNING!! The animation is not defined")
        }
        console.log("GAME OVER!! (from wrong answer)");
        clearInterval(timer.current);
      }
    }
  }

  function addNumber(e : (number | string)){
    let num : number;
    if(typeof e === "number"){
      num = e;
    }else{
      num = parseInt(e);
    }
    if(!hasStarted){
      setHasStarted(true);
    }
    if(!(result.length == 1 && result[0].content == 0)){
      setProblem({...problem, display: false});
      let newSolution = [...result];
      newSolution.push({content: num, flash: false});
      setResult(newSolution);
      if(nSuccessProblems < 5){
        setNumbers(shuffleArray([0,1,2,3,4,5,6,7,8,9,"C","="]))
      }
    }
  }

  function deleteNumber(){
    if(result.length > 0){
      let newSolution = [...result];
      let popped = newSolution.pop();
      setResult(newSolution);
    }
  }

  return (
    <div className={style.calculator_frame}>
      <div className={style.life_holder}>
        {nLifes.map((x, i) =>
          <div className={style.life_heart} key={i}> <Heart alive={x === 1}/> </div>
        )}
      </div>
      <div className={style.timer_holder}>
        <div className={style.timer_content} ref={timerNode}></div>
      </div>
      <div className={style.problem_holder}>
        {!problem.display ? <p className={style.problem_holder_content}>{problem.content}</p> : <p></p>}
      </div>
      <div className={style.display}>
        <p>{!problem.display ? result.map((c, i) => <NumberItem key={i} item={c}/>) : problem.content}</p>
      </div>
      <div className={style.buttons_holder}>
        {numbers.map((el : (number | string), idx : number) => <CalcButton key={idx} el={el} submitAnswer={submitAnswer} deleteNumber={deleteNumber} addNumber={addNumber}/>)}
      </div>
      <button onClick={() => {
        setNumbers(shuffleArray([0,1,2,3,4,5,6,7,8,9,"C","="]))
      }}>shuffle</button>
      <hr></hr>
      <p>
        ["string" : {problem.content}, "solution" : {problem.solution}, "display": {problem.display ? "true" : "false"}]
      </p>
      <p>
        success : {nSuccessProblems}
      </p>
      {/* <button onClick={() => {
        setProblem(generateProblem(100));
      }}>new problem</button> */}
    </div>
  );
}
