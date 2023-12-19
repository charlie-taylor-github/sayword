const fps = 50;
const interval = 1000 / fps;

const timerElement = document.querySelector('circle#progress');
const timeText = document.querySelector('#time');

const finishedContainer = document.querySelector('#finished-container');

const pages = [
  {
    name: 'timer',
    page: document.querySelector('#timer-page')
  }
];

let currentPage = null;
let currentMode = null;
let timer = null;

function update() {
  updatePageVisibility();

  for (const mode of ['standard', 'pressure', 'hotpotato']) {
    if (mode === currentMode) {
      document.querySelector(`#${mode}-button`).style.color = '#FE8F1A';
    } else {
      document.querySelector(`#${mode}-button`).style.color = 'white';
    }
  }

  if (timer) {
    timer.update(interval);

    if (timer.active) {
      document.querySelector('#play-button').innerText = 'PAUSE';
      updateTimerText(timer.totalTime - timer.time);
    } else {
      if (timer.progress <= 0 || timer.progress >= 1) {
        document.querySelector('#play-button').innerText = 'PLAY';
      } else {
        document.querySelector('#play-button').innerText = 'RESUME';
      }
      if (timer.innerText != `time's up`) updateTimerText(timer.totalTime - timer.time);
    }
  }
}

function init() {
  const menuButtons = document.querySelectorAll('#menu > h3');
  for (const btn of menuButtons) {
    btn.addEventListener('click', e => {
      if (e.target.id === 'standard-button') {
        setStandardPage();
      }
      if (e.target.id === 'pressure-button') {
        setPressurePage();
      }
      if (e.target.id === 'hotpotato-button') {
        setHotpotatoPage();
      }
    });

    const timerHitbox = document.querySelector('#timer');
    timerHitbox.addEventListener('click', e => {
      e.stopImmediatePropagation()
      if (currentMode === 'standard' && timer.active && !timer.complete) {
        timer.reset();
        timer.start();
      }
      if (currentMode === 'pressure' && timer.active && !timer.complete) {
        timer.setTime(timer.totalTime - 1000);
        timer.reset();
        timer.start();
      }

      if (!timer.active && !timer.complete) {
        timer.start();
      }
    });
  }

  const playbackButtons = document.querySelectorAll('#options > h3');
  for (const btn of playbackButtons) {
    btn.addEventListener('click', e => {
      if (e.target.id === 'play-button') {
        if (timer.active) timer.stop();
        else if (!timer.complete) timer.start();
      }
      if (e.target.id === 'reset-button') {
        if (currentMode === 'pressure') {
          setPressurePage();
        } else {
          timer.reset();
        }
      }
    });

    setStandardPage();
  }

  setInterval(update, interval);
}


// RANDOM FUNCTIONS
function setStandardPage() {
  currentPage = 'timer';
  currentMode = 'standard';
  timer = new Timer(timerElement, onStop);
  timer.setTime(20 * 1000);
  timer.reset();
}

function setPressurePage() {
  currentPage = 'timer';
  currentMode = 'pressure';
  timer = new Timer(timerElement, onStop);
  timer.setTime(30 * 1000);
  timer.reset();
}

function setHotpotatoPage() {
  currentPage = 'timer';
  currentMode = 'hotpotato';
  timer = new Timer(timerElement, onStop);
  timer.setTime(2 * 60 * 1000);
  timer.reset();
}

function onStop() {
  timeText.innerText = `time's up`;
  const audio = new Audio('./assets/time_up.mp3');
  audio.play();
  if (currentMode === 'pressure') {
    timer.setTime(30 * 1000);
  }
}

function updateTimerText(ms) {
  let secs = Math.floor(ms / 1000);
  let mins = Math.floor(secs / 60);
  ms = Math.floor(ms % 1000 / 10);
  secs = secs % 60;
  function pad(num) {
    return num.toString().padStart(2, '0');
  }
  timeText.innerText = `${pad(mins)}:${pad(secs)}:${pad(ms)}`;
}

function updatePageVisibility() {
  for (const page of pages) {
    if (page.name === currentPage) {
      page.page.style.display = 'block';
    } else {
      page.page.style.display = 'none';
    }
  }

  if (currentPage === 'timer') {
    document.querySelector('#options-container').style.display = 'block';
  } else {
    document.querySelector('#options-container').style.display = 'none';
  }
}

init();
