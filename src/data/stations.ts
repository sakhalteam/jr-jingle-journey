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
  { id: "osaki", kanji: "大崎", furigana: "おおさき", romaji: "Ōsaki", lines: ["yamanote", "rinkai"], hasJingle: true },
  { id: "gotanda", kanji: "五反田", furigana: "ごたんだ", romaji: "Gotanda", lines: ["yamanote", "asakusa"], hasJingle: true },
  { id: "meguro", kanji: "目黒", furigana: "めぐろ", romaji: "Meguro", lines: ["yamanote", "namboku", "mita"], hasJingle: true },
  { id: "ebisu", kanji: "恵比寿", furigana: "えびす", romaji: "Ebisu", lines: ["yamanote", "hibiya"], hasJingle: true },
  { id: "shibuya", kanji: "渋谷", furigana: "しぶや", romaji: "Shibuya", lines: ["yamanote", "ginza", "hanzomon", "fukutoshin"], hasJingle: true },
  { id: "harajuku", kanji: "原宿", furigana: "はらじゅく", romaji: "Harajuku", lines: ["yamanote"], hasJingle: true },
  { id: "yoyogi", kanji: "代々木", furigana: "よよぎ", romaji: "Yoyogi", lines: ["yamanote", "chuo_sobu"], hasJingle: true },
  { id: "shinjuku", kanji: "新宿", furigana: "しんじゅく", romaji: "Shinjuku", lines: ["yamanote", "chuo", "sobu", "marunouchi", "shinjuku"], hasJingle: true },
  { id: "shin_okubo", kanji: "新大久保", furigana: "しんおおくぼ", romaji: "Shin-Ōkubo", lines: ["yamanote"], hasJingle: true },
  { id: "takadanobaba", kanji: "高田馬場", furigana: "たかだのばば", romaji: "Takadanobaba", lines: ["yamanote", "tozai"], hasJingle: true },
  { id: "mejiro", kanji: "目白", furigana: "めじろ", romaji: "Mejiro", lines: ["yamanote"], hasJingle: true },
  { id: "ikebukuro", kanji: "池袋", furigana: "いけぶくろ", romaji: "Ikebukuro", lines: ["yamanote", "marunouchi", "yurakucho", "fukutoshin"], hasJingle: true },
  { id: "otsuka", kanji: "大塚", furigana: "おおつか", romaji: "Ōtsuka", lines: ["yamanote", "toden_arakawa"], hasJingle: true },
  { id: "sugamo", kanji: "巣鴨", furigana: "すがも", romaji: "Sugamo", lines: ["yamanote", "mita"], hasJingle: true },
  { id: "komagome", kanji: "駒込", furigana: "こまごめ", romaji: "Komagome", lines: ["yamanote", "namboku"], hasJingle: true },
  { id: "tabata", kanji: "田端", furigana: "たばた", romaji: "Tabata", lines: ["yamanote", "keihin_tohoku"], hasJingle: true },
  { id: "nishi_nippori", kanji: "西日暮里", furigana: "にしにっぽり", romaji: "Nishi-Nippori", lines: ["yamanote", "chiyoda"], hasJingle: true },
  { id: "nippori", kanji: "日暮里", furigana: "にっぽり", romaji: "Nippori", lines: ["yamanote", "keihin_tohoku", "joban"], hasJingle: true },
  { id: "uguisudani", kanji: "鶯谷", furigana: "うぐいすだに", romaji: "Uguisudani", lines: ["yamanote"], hasJingle: true },
  { id: "ueno", kanji: "上野", furigana: "うえの", romaji: "Ueno", lines: ["yamanote", "keihin_tohoku", "ginza", "hibiya"], hasJingle: true },
  { id: "okachimachi", kanji: "御徒町", furigana: "おかちまち", romaji: "Okachimachi", lines: ["yamanote"], hasJingle: true },
  { id: "akihabara", kanji: "秋葉原", furigana: "あきはばら", romaji: "Akihabara", lines: ["yamanote", "chuo_sobu", "hibiya"], hasJingle: true },
  { id: "kanda", kanji: "神田", furigana: "かんだ", romaji: "Kanda", lines: ["yamanote", "chuo", "ginza"], hasJingle: true },
  { id: "tokyo", kanji: "東京", furigana: "とうきょう", romaji: "Tōkyō", lines: ["yamanote", "chuo", "marunouchi", "shinkansen"], hasJingle: true },
  { id: "yurakucho", kanji: "有楽町", furigana: "ゆうらくちょう", romaji: "Yūrakuchō", lines: ["yamanote", "yurakucho"], hasJingle: true },
  { id: "shimbashi", kanji: "新橋", furigana: "しんばし", romaji: "Shimbashi", lines: ["yamanote", "keihin_tohoku", "ginza", "asakusa"], hasJingle: true },
  { id: "hamamatsucho", kanji: "浜松町", furigana: "はままつちょう", romaji: "Hamamatsuchō", lines: ["yamanote", "keihin_tohoku", "monorail"], hasJingle: true },
  { id: "tamachi", kanji: "田町", furigana: "たまち", romaji: "Tamachi", lines: ["yamanote", "keihin_tohoku"], hasJingle: true },
  { id: "takanawa_gateway", kanji: "高輪ゲートウェイ", furigana: "たかなわげーとうぇい", romaji: "Takanawa Gateway", lines: ["yamanote", "keihin_tohoku"], hasJingle: true },
  { id: "shinagawa", kanji: "品川", furigana: "しながわ", romaji: "Shinagawa", lines: ["yamanote", "keihin_tohoku", "tokaido", "shinkansen"], hasJingle: true },
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
