'use client';

import { useEffect, useState, useRef } from 'react';
import style from '@/app/calculator.module.css';
import { Problem, SolutionNumber } from '@/types/main';
import { shuffleArray, getNumberOfLifes, removeLife, generateProblem, getSolutionValue, compareSolutions, generateTime, getHS, setHS } from '@/utils/main';
import Heart from './heart';
import CalcButton from './calcButton';
import NumberItem from './numberItem';
import AudioToggle from './audioToggle';

//============================================
// 1 - 5   : 2 unit numbers 10 seconds
// 6 - 10  : 2 unit numbers 5 seconds
// 11 - 15 : up to 3 big numbers (<20) 10 seconds
// 16 - 20 : up to 3 big numbers (<20), shuffle per level, 10 seconds
// 21 - 25 : up to 3 big numbers (<100), shuffle per level, 10 seconds 
// 26 - 30 : up to 3 big numbers (<100), shuffle per click, 10 seconds
// 30 - 35 : 3 big numbers (<500), shuffle per click, 20 seconds
// 35 - up : 3 big numbers (<1000), shuffle per click, 10 seconds
//============================================
// style fonts, colors and proportions
// make responsive
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
  // keeps track of the high score
  const [highScore, setHighScore] = useState<number>(0);
  // toggle audio sound effects
  const [mute, setMute] = useState<boolean>(false);

  // ref for audio mute
  const muteRef = useRef<boolean>(false);

  // html node displaying the timer animation
  const timerNode = useRef<HTMLDivElement>(null);
  // actual timeout variable
  const timer = useRef<ReturnType<typeof setTimeout>>();
  // animation variable for managing start, clear and finish
  const currAnimation = useRef<Animation>();
  // timer duration
  const timerDuration = useRef<number>(10000);

  // ref for sound effect
  const errAudioRef = useRef<HTMLAudioElement>(null);
  const timeAudioRef = useRef<HTMLAudioElement>(null);

  function playAudio(audio : (HTMLAudioElement | null)) {
    if(audio && !muteRef.current){
      audio.currentTime = 0;
      audio.play();
    }
  }

  const [log, setLog] = useState<string>("");

  useEffect(() => {
    let hs = getHS();
    console.log("get the high score : ", hs);
    setHighScore(hs);
  }, [])

  // effect used for tracking the lifes inside the references
  useEffect(() => {
    nLifesRef.current = nLifes;
  }, [nLifes]);

  // effect used for tracking the mute toggle inside the reference
  useEffect(() => {
    muteRef.current = mute;
  }, [mute])

  // LEVEL LOGIC: effect for shuffling buttons on level changes
  useEffect(() => {
    if(nSuccessProblems >= 15) {
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
          console.log("Failed to solve problem in time! nLifes = ", nLifesRef.current, " muted = ", muteRef.current);
          playAudio(timeAudioRef.current);
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
            setHS(highScore);
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
      if((nSuccessProblems + 1) > highScore){
        setHighScore(nSuccessProblems + 1);
      }
      // as the user solves more levels then the available time interval may change
      timerDuration.current = generateTime(nSuccessProblems);
      setResult([]);
      setProblem(generateProblem(nSuccessProblems));
      setNProblems(nProblems+1);
    
    // otherwise it's a wrong answer, execute logic only if there are lifes left. It doesn't generate a new problem
    }else if(!isNaN(currentResult) && getNumberOfLifes(nLifes) > 0 && hasStarted){
      playAudio(errAudioRef.current);
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
        setHS(highScore);
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
      // LEVEL LOGIC: if above level 25 shuffle on every click button
      if(nSuccessProblems >= 25){
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
        {numbers.map((el : (number | string), idx : number) => <CalcButton key={idx} log={log} setLog={setLog} el={el} submitAnswer={submitAnswer} deleteNumber={deleteNumber} addNumber={addNumber} playAudio={playAudio}/>)}
      </div>
      {/*<p>{log}</p>*/}  
      <p>
        HIGH SCORE : {highScore}
      </p>
      <p>
        SCORE : {nSuccessProblems}
      </p>
      <p>
        <a href="/">restart</a>
      </p>
      <AudioToggle muted={mute} setMuted={setMute}/>
      <audio src="./err.mp3" ref={errAudioRef}/>
      <audio src="./timeover.mp3" ref={timeAudioRef}/>
      {/* <button onClick={() => {
        setProblem(generateProblem(100));
      }}>new problem</button> */}
    </div>
  );
}
