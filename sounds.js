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
  { id: 1,  label: "A01", type: "effect",  file: "audio/A01.mp3" },
  { id: 2,  label: "A02", type: "ambient", file: "audio/A02.mp3" },
  { id: 3,  label: "A03", type: "effect",  file: "audio/A03.mp3" },
  { id: 4,  label: "A04", type: "ambient", file: "audio/A04.mp3" },
  { id: 5,  label: "A05", type: "effect",  file: "audio/A05.mp3" },
  { id: 6,  label: "A06", type: "ambient", file: "audio/A06.mp3" },
  { id: 7,  label: "A07", type: "effect",  file: "audio/A07.mp3" },
  { id: 8,  label: "A08", type: "ambient", file: "audio/A08.mp3" },
  { id: 9,  label: "A09", type: "effect",  file: "audio/A09.mp3" },
  { id: 10, label: "A10", type: "ambient", file: "audio/A10.mp3" },
  { id: 11, label: "A11", type: "effect",  file: "audio/A11.mp3" },
  { id: 12, label: "A12", type: "ambient", file: "audio/A12.mp3" },
  { id: 13, label: "A13", type: "effect",  file: "audio/A13.mp3" },
  { id: 14, label: "A14", type: "ambient", file: "audio/A14.mp3" },
  { id: 15, label: "A15", type: "effect",  file: "audio/A15.mp3" },
  { id: 16, label: "A16", type: "ambient", file: "audio/A16.mp3" },
  { id: 17, label: "A17", type: "effect",  file: "audio/A17.mp3" },
  { id: 18, label: "A18", type: "ambient", file: "audio/A18.mp3" },
  { id: 19, label: "A19", type: "effect",  file: "audio/A19.mp3" },
  { id: 20, label: "A20", type: "ambient", file: "audio/A20.mp3" },
  { id: 21, label: "A21", type: "effect",  file: "audio/A21.mp3" },
  { id: 22, label: "A22", type: "ambient", file: "audio/A22.mp3" },
  { id: 23, label: "A23", type: "effect",  file: "audio/A23.mp3" },
  { id: 24, label: "A24", type: "ambient", file: "audio/A24.mp3" },
];

// 각 음원 재생 시간 (초) — 기본 60초
const PLAY_DURATION = 60;

// 전환 화면 대기 시간 (초) — 기본 10초
const TRANSITION_DURATION = 10;
