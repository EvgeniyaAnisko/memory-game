const switchSize = document.querySelector('.size')
let globalSize = switchSize.value * 2
let globalCountClick = 0
let win = document.querySelector('.win-wrapper')
let cards
const switchSolution = document.querySelectorAll('.switch')
let lastGame = []
const skip = document.querySelector('.skip')
const lG = document.querySelector('.last-games-wrapper')
const btns = document.querySelectorAll('.btn')

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

const gallery = ['batman', 'captain-america', 'captain-universe', 'colossus', 'deadpool', 'face-afraid', 'grey', 'hellboy', 'hulk', 'ironman', 'joker', 'jonny-blaze', 'lantern', 'logan', 'magneto', 'mummy', 'silver-surfer', 'spiderman', 'spiderwoman', 'striped', 'superman', 'thor', 'war-machine']

switchSize.addEventListener("click", function () {
  globalSize = switchSize.value * 2
  globalCountClick = 0
  hasFlippedCard = false;
  lockBoard = false;
  addCells()
})

let copyGallery
let globalPlayground
function generatePlayground() {
  copyGallery = Object.assign([], gallery)
  globalPlayground = []
  for (let i = 0; i < globalSize / 2; i++) {
    let temp = copyGallery[Math.floor(Math.random() * copyGallery.length)]
    globalPlayground.push([temp, ''])
    globalPlayground.push([temp, ''])
    copyGallery.splice(copyGallery.indexOf(temp), 1)

  }
  globalPlayground.sort(() => Math.random() - 0.5)
}


function setLocalStorage() {
  localStorage.setItem('globalSize', globalSize);
  localStorage.setItem('lastGame', lastGame);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
  if (localStorage.getItem('lastGame')) {
    lastGame = games
    addLastGame()
  }
  if (localStorage.getItem('globalSize')) {
    const size = localStorage.getItem('globalSize');
    globalSize = size
    switchSize.value = size / 2
    addCells()
  }
}
window.addEventListener('load', getLocalStorage)

addCells()

function addCells() {
  playground.innerHTML = '';
  globalCountClick = 0
  generatePlayground()
  skipActiveWindows()
  for (let j = 0; j < globalSize; j++) {
    const newMemoryCard = `<div class="memory-card ${globalPlayground[j][1]}"  data-hero=${globalPlayground[j][0]} data-item="${j}">
                                    <img class="front-face" src="./assets/img/${globalPlayground[j][0]}.png" alt="${globalPlayground[j][0]}">
                                    <img class="back-face" src="./assets/img/golden_binoculars.png" alt="Memory Card">
                                </div>`
    playground.insertAdjacentHTML('beforeend', newMemoryCard);
  }

  cards = document.querySelectorAll('.memory-card');
  cards.forEach(card => card.addEventListener('click', flipCard))
}

cards.forEach(card => card.addEventListener('click', flipCard));

function flipCard() {

  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();

}

function checkForMatch() {
  globalCountClick += 2
  let isMatch = firstCard.dataset.hero === secondCard.dataset.hero;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  globalPlayground[firstCard.dataset.item][1] = '.flip'
  globalPlayground[secondCard.dataset.item][1] = '.flip'
  checkWin()
  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function checkWin() {
  if (document.querySelectorAll('[data-hero]').length === document.querySelectorAll('.flip').length) {
    win.classList.add('show')
    if (lastGame.length === 20) {
      lastGame.shift()
      lastGame.shift()
    }
    lastGame.push(globalSize / 2)
    lastGame.push(globalCountClick)
    score.innerHTML = ''
    score.insertAdjacentHTML('beforeend', globalCountClick);
    addLastGame()
  }
}

switchSolution.forEach(solution => solution.addEventListener('click', switchActionWin))
function switchActionWin() {
  if (this.dataset.solution === 'yes')
    addCells()
  win.classList.remove('show')
}

btns.forEach(btn => btn.addEventListener('click', switchActionBtns))

function switchActionBtns() {
  switch (this.dataset.action) {
    case 'show':
      showSolution()
      break;
    case 'restart':
      restart()
      break;
    case 'newGame':
      addCells()
      break;
    case 'history':
      win.classList.remove('show')
      lG.classList.toggle('show')
      addLastGame()
      break;
    default:
      break;
  }
}

function skipActiveWindows() {
  win.classList.remove('show')
  lG.classList.remove('show')
}

function showSolution() {
  skipActiveWindows()
  cards.forEach(card => { card.classList.add('flip'); card.removeEventListener('click', flipCard); })
}

function restart() {
  skipActiveWindows()
  cards.forEach(card => { card.classList.remove('flip'); card.addEventListener('click', flipCard); })
  globalCountClick = 0
}

function addLastGame() {
  let lastGames = document.querySelector('.last-games')
  lastGames.innerHTML = ''
  if (lastGame.length === 0) {
    const temp = `<span class="score-wrapper">
              NO HISTORY
              </span>`
    lastGames.insertAdjacentHTML('beforeend', temp);
    return
  }

  const temp = `<div class="score-wrapper top">
              <h2 class="pair top" > Pair </h2>
              <h2 class="score top"> Score </h2>
              </div>`
  lastGames.insertAdjacentHTML('beforeend', temp);
  for (let i = 0; i < lastGame.length; i += 2) {
    const newScore = `<div class="score-wrapper">
                                    <span class="pair" >${lastGame[i]} </span>
                                    <span class="score">${lastGame[i + 1]} </span>
                                </div>`
    lastGames.insertAdjacentHTML('beforeend', newScore);
  }
}

skip.addEventListener('click', function () { lG.classList.remove('show') })

console.log('Ваша отметка - 70 балла(ов)\nОтзыв по пункам ТЗ:\nВсе пункты выполнены полностью!')