export interface Station {
  id: string;
  kanji: string;
  furigana: string;
  romaji: string;
  lines: string[];
  /** If true, a chiptune jingle is implemented */
  hasJingle: boolean;
}

export interface Line {
  id: string;
  nameJp: string;
  nameEn: string;
  color: string;
  stations: string[];
}

/** All 30 Yamanote Line stations in clockwise loop order (from Osaki) */
export const yamanoteStations: Station[] = [
  { id: "osaki", kanji: "大崎", furigana: "おおさき", romaji: "Ōsaki", lines: ["yamanote", "rinkai"], hasJingle: false },
  { id: "gotanda", kanji: "五反田", furigana: "ごたんだ", romaji: "Gotanda", lines: ["yamanote", "asakusa"], hasJingle: false },
  { id: "meguro", kanji: "目黒", furigana: "めぐろ", romaji: "Meguro", lines: ["yamanote", "namboku", "mita"], hasJingle: false },
  { id: "ebisu", kanji: "恵比寿", furigana: "えびす", romaji: "Ebisu", lines: ["yamanote", "hibiya"], hasJingle: true },
  { id: "shibuya", kanji: "渋谷", furigana: "しぶや", romaji: "Shibuya", lines: ["yamanote", "ginza", "hanzomon", "fukutoshin"], hasJingle: false },
  { id: "harajuku", kanji: "原宿", furigana: "はらじゅく", romaji: "Harajuku", lines: ["yamanote"], hasJingle: false },
  { id: "yoyogi", kanji: "代々木", furigana: "よよぎ", romaji: "Yoyogi", lines: ["yamanote", "chuo_sobu"], hasJingle: false },
  { id: "shinjuku", kanji: "新宿", furigana: "しんじゅく", romaji: "Shinjuku", lines: ["yamanote", "chuo", "sobu", "marunouchi", "shinjuku"], hasJingle: true },
  { id: "shin_okubo", kanji: "新大久保", furigana: "しんおおくぼ", romaji: "Shin-Ōkubo", lines: ["yamanote"], hasJingle: false },
  { id: "takadanobaba", kanji: "高田馬場", furigana: "たかだのばば", romaji: "Takadanobaba", lines: ["yamanote", "tozai"], hasJingle: true },
  { id: "mejiro", kanji: "目白", furigana: "めじろ", romaji: "Mejiro", lines: ["yamanote"], hasJingle: false },
  { id: "ikebukuro", kanji: "池袋", furigana: "いけぶくろ", romaji: "Ikebukuro", lines: ["yamanote", "marunouchi", "yurakucho", "fukutoshin"], hasJingle: false },
  { id: "otsuka", kanji: "大塚", furigana: "おおつか", romaji: "Ōtsuka", lines: ["yamanote", "toden_arakawa"], hasJingle: false },
  { id: "sugamo", kanji: "巣鴨", furigana: "すがも", romaji: "Sugamo", lines: ["yamanote", "mita"], hasJingle: false },
  { id: "komagome", kanji: "駒込", furigana: "こまごめ", romaji: "Komagome", lines: ["yamanote", "namboku"], hasJingle: false },
  { id: "tabata", kanji: "田端", furigana: "たばた", romaji: "Tabata", lines: ["yamanote", "keihin_tohoku"], hasJingle: false },
  { id: "nishi_nippori", kanji: "西日暮里", furigana: "にしにっぽり", romaji: "Nishi-Nippori", lines: ["yamanote", "chiyoda"], hasJingle: false },
  { id: "nippori", kanji: "日暮里", furigana: "にっぽり", romaji: "Nippori", lines: ["yamanote", "keihin_tohoku", "joban"], hasJingle: false },
  { id: "uguisudani", kanji: "鶯谷", furigana: "うぐいすだに", romaji: "Uguisudani", lines: ["yamanote"], hasJingle: false },
  { id: "ueno", kanji: "上野", furigana: "うえの", romaji: "Ueno", lines: ["yamanote", "keihin_tohoku", "ginza", "hibiya"], hasJingle: false },
  { id: "okachimachi", kanji: "御徒町", furigana: "おかちまち", romaji: "Okachimachi", lines: ["yamanote"], hasJingle: false },
  { id: "akihabara", kanji: "秋葉原", furigana: "あきはばら", romaji: "Akihabara", lines: ["yamanote", "chuo_sobu", "hibiya"], hasJingle: false },
  { id: "kanda", kanji: "神田", furigana: "かんだ", romaji: "Kanda", lines: ["yamanote", "chuo", "ginza"], hasJingle: false },
  { id: "tokyo", kanji: "東京", furigana: "とうきょう", romaji: "Tōkyō", lines: ["yamanote", "chuo", "marunouchi", "shinkansen"], hasJingle: false },
  { id: "yurakucho", kanji: "有楽町", furigana: "ゆうらくちょう", romaji: "Yūrakuchō", lines: ["yamanote", "yurakucho"], hasJingle: false },
  { id: "shimbashi", kanji: "新橋", furigana: "しんばし", romaji: "Shimbashi", lines: ["yamanote", "keihin_tohoku", "ginza", "asakusa"], hasJingle: false },
  { id: "hamamatsucho", kanji: "浜松町", furigana: "はままつちょう", romaji: "Hamamatsuchō", lines: ["yamanote", "keihin_tohoku", "monorail"], hasJingle: false },
  { id: "tamachi", kanji: "田町", furigana: "たまち", romaji: "Tamachi", lines: ["yamanote", "keihin_tohoku"], hasJingle: false },
  { id: "takanawa_gateway", kanji: "高輪ゲートウェイ", furigana: "たかなわげーとうぇい", romaji: "Takanawa Gateway", lines: ["yamanote", "keihin_tohoku"], hasJingle: false },
  { id: "shinagawa", kanji: "品川", furigana: "しながわ", romaji: "Shinagawa", lines: ["yamanote", "keihin_tohoku", "tokaido", "shinkansen"], hasJingle: false },
];

export const stationMap = new Map(yamanoteStations.map((s) => [s.id, s]));

export const yamanoteLine: Line = {
  id: "yamanote",
  nameJp: "山手線",
  nameEn: "Yamanote Line",
  color: "#9ACD32",
  stations: yamanoteStations.map((s) => s.id),
};

/** Get prev/next stations on the Yamanote loop */
export function getAdjacentStations(
  stationId: string
): { prev: Station; next: Station } | null {
  const idx = yamanoteStations.findIndex((s) => s.id === stationId);
  if (idx === -1) return null;
  const len = yamanoteStations.length;
  return {
    prev: yamanoteStations[(idx - 1 + len) % len],
    next: yamanoteStations[(idx + 1) % len],
  };
}
