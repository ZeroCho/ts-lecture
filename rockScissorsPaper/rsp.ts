interface RSP {
  ROCK: '0';
  SCISSORS: '-142px';
  PAPER: '-284px';
}

let imgCoords: RSP[keyof RSP] = '0';
const rsp: RSP = { // 딕셔너리 자료구조
  ROCK: '0',
  SCISSORS: '-142px',
  PAPER: '-284px'
}; // as const도 설명

function computerChoice(imgCoords: RSP[keyof RSP]) {
  return (Object.keys(rsp) as ['ROCK', 'SCISSORS', 'PAPER']).find((k) => {
    return rsp[k] === imgCoords;
  });
}

let interval: number;
function intervalMaker() {
  interval = setInterval(function () {
    if (imgCoords === rsp.ROCK) {
      imgCoords = rsp.SCISSORS;
    } else if (imgCoords === rsp.SCISSORS) {
      imgCoords = rsp.PAPER;
    } else {
      imgCoords = rsp.ROCK;
    }
    if (document.querySelector('#computer')) {
      (document.querySelector('#computer') as HTMLElement).style.background = 'url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ' + imgCoords + ' 0';
    }
  }, 100);
}

intervalMaker();

const score = {
  SCISSORS: 1,
  ROCK: 0,
  PAPER: -1,
};

document.querySelectorAll('.btn').forEach((btn) => {
 btn.addEventListener('click', function (this: HTMLButtonElement) {
   clearInterval(interval); // setInterval 중지
   setTimeout(() => {
     intervalMaker();
   }, 1000);
   const myChoice = this.id as keyof RSP;
   const myScore = score[myChoice];
   const computerScore = score[computerChoice(imgCoords)!];
   const diff = myScore - computerScore;
   if (diff === 0) {
     console.log('비겼습니다');
   } else if ([-1, 2].includes(diff)) {
     console.log('이겼습니다!!');
   } else {
     console.log('졌습니다 ㅠㅠ.');
   }
  });
});

// SCISSORS: 1, ROCK: 0, PAPER: -1
// 나\컴퓨터    SCISSORS   ROCK    PAPER
//        SCISSORS   1 1    1 0   1 -1
//        ROCK   0 1    0 0   0 -1
//          PAPER  -1 1   -1 0  -1 -1

let start = 3;
const interval2 = setInterval(function() {
  if (start === 0) {
    console.log('종료!!!');
    return clearInterval(interval2);
  }
  console.log(start);
  start -= 1;
}, 1000);
