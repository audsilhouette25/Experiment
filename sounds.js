/**
 * sounds.js — 음원 목록 설정 파일
 *
 * 이 파일만 수정하면 음원 순서·종류·파일명을 바꿀 수 있습니다.
 *
 * type 값:
 *   "effect"  → 단순 효과음  (라임색 표시)
 *   "ambient" → 추상적 배경음 (시안색 표시)
 *
 * file 값:
 *   audio/ 폴더 안에 있는 파일 이름 (확장자 포함)
 *   예) "audio/A01_effect.wav"
 *
 * label 값:
 *   화면에 표시할 음원 번호 (자유롭게 변경 가능)
 */

const SOUND_LIST = [
  { id: 1,  label: "A01", type: "effect",  file: "audio/A01.wav" },
  { id: 2,  label: "A02", type: "ambient", file: "audio/A02.wav" },
  { id: 3,  label: "A03", type: "effect",  file: "audio/A03.wav" },
  { id: 4,  label: "A04", type: "ambient", file: "audio/A04.wav" },
  { id: 5,  label: "A05", type: "effect",  file: "audio/A05.wav" },
  { id: 6,  label: "A06", type: "ambient", file: "audio/A06.wav" },
  { id: 7,  label: "A07", type: "effect",  file: "audio/A07.wav" },
  { id: 8,  label: "A08", type: "ambient", file: "audio/A08.wav" },
  { id: 9,  label: "A09", type: "effect",  file: "audio/A09.mp3" },
  { id: 10, label: "A10", type: "ambient", file: "audio/A10.wav" },
  { id: 11, label: "A11", type: "effect",  file: "audio/A11.wav" },
  { id: 12, label: "A12", type: "ambient", file: "audio/A12.wav" },
  { id: 13, label: "A13", type: "effect",  file: "audio/A13.wav" },
  { id: 14, label: "A14", type: "ambient", file: "audio/A14.wav" },
  { id: 15, label: "A15", type: "effect",  file: "audio/A15.wav" },
  { id: 16, label: "A16", type: "ambient", file: "audio/A16.wav" },
  { id: 17, label: "A17", type: "effect",  file: "audio/A17.wav" },
  { id: 18, label: "A18", type: "ambient", file: "audio/A18.wav" },
  { id: 19, label: "A19", type: "effect",  file: "audio/A19.wav" },
  { id: 20, label: "A20", type: "ambient", file: "audio/A20.mp3" },
  { id: 21, label: "A21", type: "effect",  file: "audio/A21.wav" },
  { id: 22, label: "A22", type: "ambient", file: "audio/A22.wav" },
  { id: 23, label: "A23", type: "effect",  file: "audio/A23.wav" },
  { id: 24, label: "A24", type: "ambient", file: "audio/A24.wav" },
];

// 각 음원 재생 시간 (초) — 기본 60초
const PLAY_DURATION = 60;

// 전환 화면 대기 시간 (초) — 기본 10초
const TRANSITION_DURATION = 10;
