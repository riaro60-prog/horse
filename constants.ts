
import { Horse } from './types';

export const TRACK_LENGTH = 12;
export const INITIAL_TOKENS = 10;

export const HORSES: Horse[] = [
  {
    id: 1,
    name: "솜사탕 토끼",
    color: "#fda4af", // Rose 300
    icon: "🐰",
    description: "가끔 엄청난 점프로 앞서나가지만, 금방 숨이 차요!",
    probabilities: [
      { spaces: 0, weight: 35 },
      { spaces: 1, weight: 25 },
      { spaces: 3, weight: 40 }
    ]
  },
  {
    id: 2,
    name: "우주 오리",
    color: "#fde047", // Yellow 300
    icon: "🐥",
    description: "뒤뚱뒤뚱 멈추지 않고 꾸준히 나아가는 성실파예요.",
    probabilities: [
      { spaces: 0, weight: 10 },
      { spaces: 1, weight: 75 },
      { spaces: 2, weight: 15 }
    ]
  },
  {
    id: 3,
    name: "딸기냥이",
    color: "#fb7185", // Rose 400
    icon: "🐱",
    description: "기분파 고양이! 운이 좋으면 순식간에 골인!",
    probabilities: [
      { spaces: 0, weight: 45 },
      { spaces: 1, weight: 20 },
      { spaces: 4, weight: 35 }
    ]
  },
  {
    id: 4,
    name: "꿀벌 판다",
    color: "#64748b", // Slate 500
    icon: "🐼",
    description: "느릿느릿하지만 한 번 움직이면 묵직하게 나아가요.",
    probabilities: [
      { spaces: 0, weight: 30 },
      { spaces: 1, weight: 40 },
      { spaces: 2, weight: 30 }
    ]
  },
  {
    id: 5,
    name: "별사탕 유니콘",
    color: "#d8b4fe", // Purple 300
    icon: "🦄",
    description: "신비로운 힘으로 가끔 마법처럼 순간이동해요!",
    probabilities: [
      { spaces: 0, weight: 20 },
      { spaces: 2, weight: 60 },
      { spaces: 3, weight: 20 }
    ]
  },
  {
    id: 6,
    name: "새싹 개구리",
    color: "#86efac", // Green 300
    icon: "🐸",
    description: "폴짝폴짝 리드미컬하게 트랙을 가로질러요.",
    probabilities: [
      { spaces: 1, weight: 70 },
      { spaces: 2, weight: 30 }
    ]
  },
  {
    id: 7,
    name: "구름 강아지",
    color: "#bae6fd", // Sky 200
    icon: "🐶",
    description: "주인을 찾는 마음으로 열심히 뛰어다녀요!",
    probabilities: [
      { spaces: 0, weight: 25 },
      { spaces: 1, weight: 45 },
      { spaces: 2, weight: 30 }
    ]
  },
  {
    id: 8,
    name: "불꽃 여우",
    color: "#fb923c", // Orange 400
    icon: "🦊",
    description: "엄청난 스피드를 가졌지만, 엉뚱한 방향으로 가기도 해요.",
    probabilities: [
      { spaces: 0, weight: 50 },
      { spaces: 2, weight: 25 },
      { spaces: 5, weight: 25 }
    ]
  }
];
