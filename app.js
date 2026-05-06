/**
 * app.js — 실험 진행 메인 로직
 *
 * 오디오 재생 문제 해결:
 *   - 버튼 클릭(사용자 인터랙션) 이후에만 play()를 호출하므로
 *     브라우저 자동재생 차단 정책을 우회합니다.
 *   - 파일 경로 오류 시 콘솔에 구체적인 안내를 출력합니다.
 */

// ── DOM 참조 ─────────────────────────────────────────────────────
const screens = {
  intro:      document.getElementById('screen-intro'),
  play:       document.getElementById('screen-play'),
  transition: document.getElementById('screen-transition'),
  end:        document.getElementById('screen-end'),
};

const elCurrentNum   = document.getElementById('current-num');
const elProgressBar  = document.getElementById('progress-bar');
const elSoundNumber  = document.getElementById('sound-number');
const elTimerText    = document.getElementById('timer-text');
const elRingFg       = document.getElementById('ring-fg');
const elTxCountdown  = document.getElementById('transition-countdown');
const elTxNext       = document.getElementById('transition-next');
const audioPlayer    = document.getElementById('audio-player');

const btnStart   = document.getElementById('btn-start');
const btnRestart = document.getElementById('btn-restart');
const btnPrev    = document.getElementById('btn-prev');
const btnNext    = document.getElementById('btn-next');
const btnSkip    = document.getElementById('btn-skip');

// ── 상수 ─────────────────────────────────────────────────────────
const RING_CIRCUMFERENCE = 2 * Math.PI * 52;

// ── 상태 ─────────────────────────────────────────────────────────
let currentIndex = 0;
let nextIndex    = 0;   // 전환 화면에서 대기 중인 다음 음원 인덱스
let playTimer    = null;
let txTimer      = null;
let playElapsed  = 0;

// ── 화면 전환 ────────────────────────────────────────────────────
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ── 이전 버튼 활성화 상태 갱신 ──────────────────────────────────
function updateNavButtons() {
  btnPrev.disabled = currentIndex <= 0;
}

// ── 재생 화면 UI 업데이트 ────────────────────────────────────────
function updatePlayUI(elapsed) {
  const remaining = Math.max(0, PLAY_DURATION - elapsed);
  const mins = String(Math.floor(remaining / 60));
  const secs = String(remaining % 60).padStart(2, '0');
  elTimerText.textContent = `${mins}:${secs}`;

  const ratio = elapsed / PLAY_DURATION;
  elRingFg.style.strokeDashoffset = RING_CIRCUMFERENCE * ratio;

  const totalProgress = ((currentIndex + ratio) / SOUND_LIST.length) * 100;
  elProgressBar.style.width = `${totalProgress}%`;
}

// ── 오디오 재생 ──────────────────────────────────────────────────
function playAudio(src) {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  audioPlayer.src = src;
  audioPlayer.loop = true;

  const promise = audioPlayer.play();
  if (promise !== undefined) {
    promise.catch(err => {
      console.warn(`[오디오 재생 실패] ${src}`);
      console.warn('가능한 원인:');
      console.warn('1. 파일이 audio/ 폴더에 없거나 파일명이 다릅니다.');
      console.warn('2. 파일을 더블클릭으로 열었습니다. → python3 -m http.server 로 실행하세요.');
      console.warn('원본 오류:', err.message);
    });
  }
}

// ── SVG 링 초기화 ────────────────────────────────────────────────
function resetRing() {
  elRingFg.style.transition = 'none';
  elRingFg.style.strokeDashoffset = '0';
  elRingFg.style.strokeDasharray  = `${RING_CIRCUMFERENCE}`;
  void elRingFg.getBoundingClientRect();
  elRingFg.style.transition = 'stroke-dashoffset 1s linear';
}

// ── 음원 시작 ────────────────────────────────────────────────────
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

  resetRing();
  playElapsed = 0;
  updatePlayUI(0);
  updateNavButtons();
  showScreen('play');

  playAudio(sound.file);

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

// ── 전환 화면 ────────────────────────────────────────────────────
function startTransition(idx) {
  if (idx >= SOUND_LIST.length) {
    stopAll();
    showScreen('end');
    elProgressBar.style.width = '100%';
    return;
  }

  nextIndex = idx;   // 전환 화면용 상태 저장 (바로 넘어가기 버튼이 사용)

  const next = SOUND_LIST[idx];
  elTxNext.textContent      = `다음: ${next.label}`;
  elTxCountdown.textContent = TRANSITION_DURATION;
  showScreen('transition');

  nextIndex = nextIndex;   // 전환 화면용 상태 저장
  let txElapsed = 0;
  clearInterval(txTimer);
  txTimer = setInterval(() => {
    txElapsed++;
    const remaining = TRANSITION_DURATION - txElapsed;
    elTxCountdown.textContent = remaining;

    if (txElapsed >= TRANSITION_DURATION) {
      clearInterval(txTimer);
      startSound(idx);
    }
  }, 1000);
}

// ── 전체 정지 ────────────────────────────────────────────────────
function stopAll() {
  clearInterval(playTimer);
  clearInterval(txTimer);
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
}

// ── 버튼 이벤트 ─────────────────────────────────────────────────
btnStart.addEventListener('click', () => {
  stopAll();
  startSound(0);
});

btnRestart.addEventListener('click', () => {
  stopAll();
  elProgressBar.style.width = '0%';
  showScreen('intro');
});

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

btnPrev.addEventListener('click', () => {
  if (currentIndex <= 0) return;
  stopAll();
  startSound(currentIndex - 1);
});

// 전환 화면 → 바로 넘어가기
btnSkip.addEventListener('click', () => {
  clearInterval(txTimer);
  startSound(nextIndex);
});
