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

export function removeLife(array:number[]) : number[] {
  let n = getNumberOfLifes(array) - 1;
  if(n >= 0){
    array[n] = 0;
  }
  return [...array];
}

export function generateProblem(maxNum : number) : Problem {
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