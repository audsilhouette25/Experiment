/**
 * app.js — 실험 진행 메인 로직
 *
 * 화면 흐름:
 *   [안내] → [연습 안내] → [연습 재생(prac.wav)] → [연습 완료] → [본 실험 A01~A24] → [종료]
 */

// ── DOM 참조 ─────────────────────────────────────────────────────
const screens = {
  intro:      document.getElementById('screen-intro'),
  pracIntro:  document.getElementById('screen-prac-intro'),
  pracPlay:   document.getElementById('screen-prac-play'),
  pracEnd:    document.getElementById('screen-prac-end'),
  play:       document.getElementById('screen-play'),
  transition: document.getElementById('screen-transition'),
  end:        document.getElementById('screen-end'),
};

// 본 실험 UI
const elCurrentNum   = document.getElementById('current-num');
const elProgressBar  = document.getElementById('progress-bar');
const elSoundNumber  = document.getElementById('sound-number');
const elTimerText    = document.getElementById('timer-text');
const elRingFg       = document.getElementById('ring-fg');
const elTxCountdown  = document.getElementById('transition-countdown');
const elTxNext       = document.getElementById('transition-next');
const audioPlayer    = document.getElementById('audio-player');

// 연습 UI
const pracRingFg     = document.getElementById('prac-ring-fg');
const pracTimerText  = document.getElementById('prac-timer-text');
const pracAudio      = document.getElementById('prac-audio');

// 버튼
const btnStart      = document.getElementById('btn-start');       // 안내→연습안내
const btnPracStart  = document.getElementById('btn-prac-start'); // 연습 시작
const btnPracSkip   = document.getElementById('btn-prac-skip'); // 연습 건너뛰기
const btnMainStart  = document.getElementById('btn-main-start');// 본 실험 시작
const btnRestart    = document.getElementById('btn-restart');
const btnPrev       = document.getElementById('btn-prev');
const btnNext       = document.getElementById('btn-next');
const btnSkip       = document.getElementById('btn-skip');

// ── 상수 ─────────────────────────────────────────────────────────
const RING_CIRCUMFERENCE = 2 * Math.PI * 52;
const PRAC_FILE = 'audio/prac.wav';

// ── 상태 ─────────────────────────────────────────────────────────
let currentIndex = 0;
let nextIndex    = 0;
let playTimer    = null;
let txTimer      = null;
let pracTimer    = null;
let playElapsed  = 0;

// ── 화면 전환 ────────────────────────────────────────────────────
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ── 공통: 오디오 재생 ────────────────────────────────────────────
function playAudio(player, src) {
  player.pause();
  player.currentTime = 0;
  player.src = src;
  player.loop = true;
  const promise = player.play();
  if (promise !== undefined) {
    promise.catch(err => {
      console.warn(`[오디오 재생 실패] ${src}`, err.message);
    });
  }
}

// ── 공통: SVG 링 초기화 ──────────────────────────────────────────
function resetRing(el) {
  el.style.transition = 'none';
  el.style.strokeDashoffset = '0';
  el.style.strokeDasharray  = `${RING_CIRCUMFERENCE}`;
  void el.getBoundingClientRect();
  el.style.transition = 'stroke-dashoffset 1s linear';
}

// ── 공통: 타이머 텍스트 ──────────────────────────────────────────
function formatTime(remaining) {
  const mins = String(Math.floor(remaining / 60));
  const secs = String(remaining % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

// ── 이전 버튼 상태 ───────────────────────────────────────────────
function updateNavButtons() {
  btnPrev.disabled = currentIndex <= 0;
}

// ── 전체 정지 ────────────────────────────────────────────────────
function stopAll() {
  clearInterval(playTimer);
  clearInterval(txTimer);
  clearInterval(pracTimer);
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  pracAudio.pause();
  pracAudio.currentTime = 0;
}

// ════════════════════════════════════════════════════════════════
//  연습 단계
// ════════════════════════════════════════════════════════════════

function startPrac() {
  resetRing(pracRingFg);
  pracTimerText.textContent = formatTime(PLAY_DURATION);
  showScreen('pracPlay');
  playAudio(pracAudio, PRAC_FILE);

  let elapsed = 0;
  clearInterval(pracTimer);
  pracTimer = setInterval(() => {
    elapsed++;
    const remaining = Math.max(0, PLAY_DURATION - elapsed);
    pracTimerText.textContent = formatTime(remaining);
    pracRingFg.style.strokeDashoffset = RING_CIRCUMFERENCE * (elapsed / PLAY_DURATION);

    if (elapsed >= PLAY_DURATION) {
      clearInterval(pracTimer);
      pracAudio.pause();
      pracAudio.currentTime = 0;
      showScreen('pracEnd');
    }
  }, 1000);
}

// ════════════════════════════════════════════════════════════════
//  본 실험
// ════════════════════════════════════════════════════════════════

function updatePlayUI(elapsed) {
  const remaining = Math.max(0, PLAY_DURATION - elapsed);
  elTimerText.textContent = formatTime(remaining);

  const ratio = elapsed / PLAY_DURATION;
  elRingFg.style.strokeDashoffset = RING_CIRCUMFERENCE * ratio;

  const totalProgress = ((currentIndex + ratio) / SOUND_LIST.length) * 100;
  elProgressBar.style.width = `${totalProgress}%`;
}

function startSound(index) {
  if (index >= SOUND_LIST.length) {
    stopAll();
    showScreen('end');
    elProgressBar.style.width = '100%';
    return;
  }

  currentIndex = index;
  const sound  = SOUND_LIST[index];

  elCurrentNum.textContent  = index + 1;
  elSoundNumber.textContent = sound.label;

  resetRing(elRingFg);
  playElapsed = 0;
  updatePlayUI(0);
  updateNavButtons();
  showScreen('play');

  playAudio(audioPlayer, sound.file);

  clearInterval(playTimer);
  playTimer = setInterval(() => {
    playElapsed++;
    updatePlayUI(playElapsed);

    if (playElapsed >= PLAY_DURATION) {
      clearInterval(playTimer);
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      startTransition(index + 1);
    }
  }, 1000);
}

function startTransition(idx) {
  if (idx >= SOUND_LIST.length) {
    stopAll();
    showScreen('end');
    elProgressBar.style.width = '100%';
    return;
  }

  nextIndex = idx;

  const next = SOUND_LIST[idx];
  elTxNext.textContent      = `다음: ${next.label}`;
  elTxCountdown.textContent = TRANSITION_DURATION;
  showScreen('transition');

  let txElapsed = 0;
  clearInterval(txTimer);
  txTimer = setInterval(() => {
    txElapsed++;
    elTxCountdown.textContent = TRANSITION_DURATION - txElapsed;

    if (txElapsed >= TRANSITION_DURATION) {
      clearInterval(txTimer);
      startSound(idx);
    }
  }, 1000);
}

// ── 버튼 이벤트 ─────────────────────────────────────────────────

// 안내 → 연습 안내
btnStart.addEventListener('click', () => {
  showScreen('pracIntro');
});

// 연습 안내 → 연습 재생
btnPracStart.addEventListener('click', () => {
  startPrac();
});

// 연습 건너뛰기 → 연습 완료 화면
btnPracSkip.addEventListener('click', () => {
  clearInterval(pracTimer);
  pracAudio.pause();
  pracAudio.currentTime = 0;
  showScreen('pracEnd');
});

// 연습 완료 → 본 실험 시작
btnMainStart.addEventListener('click', () => {
  stopAll();
  elProgressBar.style.width = '0%';
  startSound(0);
});

// 본 실험: 다음 음원
btnNext.addEventListener('click', () => {
  stopAll();
  const next = currentIndex + 1;
  if (next >= SOUND_LIST.length) {
    showScreen('end');
    elProgressBar.style.width = '100%';
  } else {
    startTransition(next);
  }
});

// 본 실험: 이전 음원
btnPrev.addEventListener('click', () => {
  if (currentIndex <= 0) return;
  stopAll();
  startSound(currentIndex - 1);
});

// 전환 화면: 바로 넘어가기
btnSkip.addEventListener('click', () => {
  clearInterval(txTimer);
  startSound(nextIndex);
});

// 처음으로
btnRestart.addEventListener('click', () => {
  stopAll();
  elProgressBar.style.width = '0%';
  showScreen('intro');
});
