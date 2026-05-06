/**
 * app.js — 실험 진행 메인 로직
 *
 * 화면 흐름:
 *   [안내] → [재생] → [전환(10초)] → [재생] → ... (×24) → [종료]
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
const elSoundBadge   = document.getElementById('sound-type-badge');
const elTimerText    = document.getElementById('timer-text');
const elRingFg       = document.getElementById('ring-fg');
const elTxCountdown  = document.getElementById('transition-countdown');
const elTxNext       = document.getElementById('transition-next');
const audioPlayer    = document.getElementById('audio-player');

const btnStart   = document.getElementById('btn-start');
const btnRestart = document.getElementById('btn-restart');

// ── 상수 ─────────────────────────────────────────────────────────
const RING_CIRCUMFERENCE = 2 * Math.PI * 52; // r=52 → ≈326.7

// ── 상태 ─────────────────────────────────────────────────────────
let currentIndex = 0;
let playTimer    = null;
let txTimer      = null;
let playElapsed  = 0;    // 재생 경과 초
let txElapsed    = 0;    // 전환 경과 초

// ── 화면 전환 ────────────────────────────────────────────────────
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ── 재생 화면 업데이트 ───────────────────────────────────────────
function updatePlayUI(sound, elapsed) {
  const remaining = Math.max(0, PLAY_DURATION - elapsed);
  const mins = String(Math.floor(remaining / 60)).padStart(1, '0');
  const secs = String(remaining % 60).padStart(2, '0');
  elTimerText.textContent = `${mins}:${secs}`;

  // SVG ring
  const ratio = elapsed / PLAY_DURATION;
  elRingFg.style.strokeDashoffset = RING_CIRCUMFERENCE * ratio;

  // 상단 진행바
  const totalProgress = ((currentIndex) / SOUND_LIST.length + ratio / SOUND_LIST.length) * 100;
  elProgressBar.style.width = `${totalProgress}%`;
}

// ── 음원 시작 ────────────────────────────────────────────────────
function startSound(index) {
  if (index >= SOUND_LIST.length) { showScreen('end'); return; }

  currentIndex = index;
  const sound  = SOUND_LIST[index];

  // UI 세팅
  elCurrentNum.textContent = index + 1;
  elSoundNumber.textContent = sound.label;

  // 타입 배지
  elSoundBadge.textContent    = sound.type === 'effect' ? '단순 효과음' : '추상적 배경음';
  elSoundBadge.className      = `sound-type-badge ${sound.type}`;
  screens.play.className      = `screen active is-${sound.type}`;

  // ring 초기화
  elRingFg.style.transition = 'none';
  elRingFg.style.strokeDashoffset = '0';
  elRingFg.style.strokeDasharray  = `${RING_CIRCUMFERENCE}`;
  void elRingFg.getBoundingClientRect(); // reflow
  elRingFg.style.transition = 'stroke-dashoffset 1s linear';

  updatePlayUI(sound, 0);
  showScreen('play');

  // 오디오 재생
  audioPlayer.src = sound.file;
  audioPlayer.loop = true;
  audioPlayer.play().catch(() => {
    // 자동재생 차단 시 무음으로 타이머만 진행 (실험자가 수동 조작)
    console.warn(`오디오 재생 실패: ${sound.file}`);
  });

  // 1초 간격 타이머
  playElapsed = 0;
  clearInterval(playTimer);
  playTimer = setInterval(() => {
    playElapsed++;
    updatePlayUI(sound, playElapsed);

    if (playElapsed >= PLAY_DURATION) {
      clearInterval(playTimer);
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      startTransition(index + 1);
    }
  }, 1000);
}

// ── 전환 화면 ────────────────────────────────────────────────────
function startTransition(nextIndex) {
  if (nextIndex >= SOUND_LIST.length) {
    // 마지막 음원 이후 → 종료 화면
    showScreen('end');
    elProgressBar.style.width = '100%';
    return;
  }

  const next = SOUND_LIST[nextIndex];
  elTxNext.textContent = `다음: ${next.label} · ${next.type === 'effect' ? '단순 효과음' : '추상적 배경음'}`;
  elTxCountdown.textContent = TRANSITION_DURATION;
  showScreen('transition');

  txElapsed = 0;
  clearInterval(txTimer);
  txTimer = setInterval(() => {
    txElapsed++;
    const remaining = TRANSITION_DURATION - txElapsed;
    elTxCountdown.textContent = remaining;

    if (txElapsed >= TRANSITION_DURATION) {
      clearInterval(txTimer);
      startSound(nextIndex);
    }
  }, 1000);
}

// ── 버튼 이벤트 ─────────────────────────────────────────────────
btnStart.addEventListener('click', () => {
  currentIndex = 0;
  startSound(0);
});

btnRestart.addEventListener('click', () => {
  clearInterval(playTimer);
  clearInterval(txTimer);
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  elProgressBar.style.width = '0%';
  showScreen('intro');
});
