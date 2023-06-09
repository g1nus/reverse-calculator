import { Problem, SolutionNumber } from "@/types/main";

function getRandomInt(max : number) : number{
  return Math.floor(Math.random() * max);
}

function getRandomOperator() : string{
  return (getRandomInt(2) < 1) ? "-" : "+";
}

export function shuffleArray(array : (number | string)[]) : (number | string)[] {
  for (let i : number = array.length - 1; i > 0; i--) {
    const j : number = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getNumberOfLifes(array : number[]) : number {
  return array.filter((x : number) => x === 1).length;
}

export function removeLife(array : number[]) : number[] {
  let n = getNumberOfLifes(array) - 1;
  if(n >= 0){
    array[n] = 0;
  }
  return [...array];
}

export function generateProblem(nSuccess : number) : Problem {
  let maxNum : number = 10;
  let totalElements : number = 2;
  let operators : string[] = [getRandomOperator(), "+"];
  let numbers : number[] = [];
  let problemString : string = "";
  let problemSolution : number = 0;

  // LEVEL LOGIC: for setting up problem complexity
  if(nSuccess < 10){
    maxNum = 10;
    totalElements = 2;
  }else if(nSuccess < 20){
    totalElements += getRandomInt(2);
    maxNum = 20;
  }else if(nSuccess < 30){
    totalElements += getRandomInt(2);
    maxNum = 100;
  }else if(nSuccess < 35){
    totalElements = 3;
    maxNum = 500;
  }else{
    totalElements = 3;
    maxNum = 1000;
  }

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
  return {content: problemString, solution: problemSolution, display: true};

}

export function generateTime(nSuccess : number) : number {
  // LEVEL LOGIC: for setting up available time
  if(nSuccess < 5){
    return 10000;
  }else if(nSuccess < 10){
    return 5000;
  }else if(nSuccess < 30){
    return 10000;
  }else if(nSuccess < 35){
    return 20000;
  }
  return 5000;
}

export function getSolutionValue(solution: SolutionNumber[]) : number{
  let stringValue = "";
  for(let i : number = 0; i < solution.length; i++){
    stringValue += solution[i].content;
  }
  return parseInt(stringValue);
}

export function compareSolutions(solution: number, answer: number) : number[] {
  let wrongNumbers : number[] = [];
  let solutionArray : string[] = solution.toString().split(''); 
  let answerArray : string[] = answer.toString().split(''); 

  solutionArray.map((el, idx) => {
    if(idx < answerArray.length && el != answerArray[idx]){
      wrongNumbers.push(idx);
    }
  })

  if(answerArray.length > solutionArray.length){
    for(let i : number = solutionArray.length; i < answerArray.length; i++){
      wrongNumbers.push(i);
    }
  }

  if(answerArray.length < solutionArray.length){
    for(let i : number = 0; i < answerArray.length; i++){
      if(!wrongNumbers.includes(i)){
        wrongNumbers.push(i);
      }
    }
  }

  return wrongNumbers;
}

export function getHS() : number{
  return parseInt(localStorage.getItem('hs') || "0");
}

export function setHS(hs : number) {
  let currentHs = parseInt(localStorage.getItem('hs') || "0");
  if(hs > currentHs){
    localStorage.setItem('hs', JSON.stringify(hs));
  }
}