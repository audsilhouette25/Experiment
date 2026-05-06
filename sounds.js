/**
 * sounds.js — 음원 목록 설정 파일
 */

const SOUND_LIST = [
  { id: 1,  label: "A01", type: "effect",  file: "audio/A01.wav" },
  { id: 2,  label: "A02", type: "ambient", file: "audio/A02.wav" },
  { id: 3,  label: "A03", type: "effect",  file: "audio/A03.wav" },
  { id: 4,  label: "A04", type: "ambient", file: "audio/A04.wav" },
  { id: 5,  label: "A05", type: "effect",  file: "audio/A05.wav" },
  { id: 6,  label: "A06", type: "ambient", file: "audio/A_06.wav" },
  { id: 7,  label: "A07", type: "effect",  file: "audio/A_07.wav" },
  { id: 8,  label: "A08", type: "ambient", file: "audio/A_08.wav" },
  { id: 9,  label: "A09", type: "effect",  file: "audio/A_09.mp3" },
  { id: 10, label: "A10", type: "ambient", file: "audio/A_10.wav" },
  { id: 11, label: "A11", type: "effect",  file: "audio/A_11.wav" },
  { id: 12, label: "A12", type: "ambient", file: "audio/A_12.wav" },
  { id: 13, label: "A13", type: "effect",  file: "audio/A_13.wav" },
  { id: 14, label: "A14", type: "ambient", file: "audio/A_14.wav" },
  { id: 15, label: "A15", type: "effect",  file: "audio/A_15.wav" },
  { id: 16, label: "A16", type: "ambient", file: "audio/A_16.wav" },
  { id: 17, label: "A17", type: "effect",  file: "audio/A_17.wav" },
  { id: 18, label: "A18", type: "ambient", file: "audio/A_18.wav" },
  { id: 19, label: "A19", type: "effect",  file: "audio/A_19.wav" },
  { id: 20, label: "A20", type: "ambient", file: "audio/A_20.mp3" },
  { id: 21, label: "A21", type: "effect",  file: "audio/A_21.wav" },
  { id: 22, label: "A22", type: "ambient", file: "audio/A_22.wav" },
  { id: 23, label: "A23", type: "effect",  file: "audio/A_23.wav" },
  { id: 24, label: "A24", type: "ambient", file: "audio/A_24.wav" },
];

// 각 음원 재생 시간 (초) — 기본 60초
const PLAY_DURATION = 60;

// 전환 화면 대기 시간 (초) — 기본 10초
const TRANSITION_DURATION = 10;
