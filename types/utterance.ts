// types.ts
interface Word {
  text: string;
  start: number;
  end: number;
  confidence: number;
  speaker: string;
}

 interface Utterance {
  confidence: number;
  end: number;
  speaker: string;
  start: number;
  text: string;
  words: Word[];
}