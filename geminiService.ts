
import { GoogleGenAI } from "@google/genai";
import { Horse, RaceState } from "./types";

/**
 * Gets race commentary from Gemini API based on current race progress.
 * Uses gemini-3-flash-preview for fast text generation.
 */
export async function getRaceCommentary(
  phase: 'mid-race' | 'finish',
  horses: Horse[],
  state: RaceState
): Promise<string> {
  const horseInfo = horses.map(h => 
    `${h.name} (#${h.id}): 현재 ${state.horsePositions[h.id]}칸`
  ).join(', ');

  const prompt = `
    당신은 열정적이고 귀여운 말투를 쓰는 동물 경주 해설가 '콩떡 해설위원'입니다. 
    현재 상황을 바탕으로 아주 박진감 넘치고 재미있는 한국어 해설을 작성해주세요.
    상태: ${phase === 'mid-race' ? '제 3라운드 종료 후 중간 상황' : '경기 종료'}
    동물들의 위치: ${horseInfo}
    트랙 총 길이: 12칸

    ${phase === 'finish' ? '우승한 동물 친구를 축하하고 아쉬워하는 친구들을 귀엽게 위로해주세요.' : '현재 선두 동물과 뒤처진 동물을 언급하며 다음 라운드의 베팅을 유도해주세요.'}
    해설은 3~4문장 정도로 짧고 "해요", "했나봐요!" 같은 다정한 종결어미를 사용해 강렬하게 작성해주세요.
  `;

  try {
    // Initializing Gemini client with API key from environment variable as required.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // Directly accessing the .text property of GenerateContentResponse
    return response.text || "경기가 정말 뜨겁습니다! 다음 상황을 기대해주세요!";
  } catch (error) {
    console.error("Gemini Commentary Error:", error);
    return "관중들의 함성 소리에 해설이 잘 들리지 않습니다! 경기가 계속되고 있습니다!";
  }
}
