/**
 * slice-announcements.mjs
 *
 * Parses the 62 JR Yamanote announcement tracks and slices them into
 * per-station clips using ffmpeg.
 *
 * Usage: node scripts/slice-announcements.mjs
 *
 * Output: public/audio/announcements/{stationId}_{direction}_{type}.mp3
 *   direction: cw (外回り clockwise) | ccw (内回り counter-clockwise)
 *   type: shanai (車内 in-car) | platform (駅ホーム)
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const SOURCE_DIR = resolve(
  PROJECT_ROOT,
  "public",
  "JR東日本 山手線車内 & 駅ホーム自動放送 完全オリジナル音源集"
);
const OUTPUT_DIR = resolve(PROJECT_ROOT, "public", "audio", "announcements");

// ─── Source file lookup by track number ─────────────────────────────
const SOURCE_FILES = {
  1:  "01 山手線「車内 自動放送」外回り 大崎 五反田.mp3",
  2:  "02 山手線「車内 自動放送」外回り 目黒 恵比寿.mp3",
  3:  "03 山手線「車内 自動放送」外回り 渋谷 原宿.mp3",
  4:  "04 山手線「車内 自動放送」外回り 代々木 新宿.mp3",
  5:  "05 山手線「車内 自動放送」外回り 新大久保 高田馬場.mp3",
  6:  "06 山手線「車内 自動放送」外回り 目白 池袋行き 池袋.mp3",
  7:  "07 山手線「車内 自動放送」外回り 大塚 巣鴨.mp3",
  8:  "08 山手線「車内 自動放送」外回り 駒込 田端.mp3",
  9:  "09 山手線「車内 自動放送」外回り 西日暮里 日暮里.mp3",
  10: "10 山手線「車内 自動放送」外回り 鶯谷 上野.mp3",
  11: "11 山手線「車内 自動放送」外回り 御徒町 秋葉原.mp3",
  12: "12 山手線「車内 自動放送」外回り 神田 東京.mp3",
  13: "13 山手線「車内 自動放送」外回り 有楽町 新橋.mp3",
  14: "14 山手線「車内 自動放送」外回り 浜松町 田町 品川行き.mp3",
  15: "15 山手線「車内 自動放送」外回り 品川 大崎行き.mp3",
  16: "16 山手線「車内 自動放送」内回り 大崎 品川行き 品川.mp3",
  17: "17 山手線「車内 自動放送」内回り 田町 浜松町.mp3",
  18: "18 山手線「車内 自動放送」内回り 新橋 有楽町.mp3",
  19: "19 山手線「車内 自動放送」内回り 東京 神田.mp3",
  20: "20 山手線「車内 自動放送」内回り 秋葉原 御徒町.mp3",
  21: "21 山手線「車内 自動放送」内回り 上野 鶯谷.mp3",
  22: "22 山手線「車内 自動放送」内回り 日暮里 西日暮里.mp3",
  23: "23 山手線「車内 自動放送」内回り 田端 駒込.mp3",
  24: "24 山手線「車内 自動放送」内回り 巣鴨 大塚 池袋行き.mp3",
  25: "25 山手線「車内 自動放送」内回り 池袋 目白.mp3",
  26: "26 山手線「車内 自動放送」内回り 高田馬場 新大久保.mp3",
  27: "27 山手線「車内 自動放送」内回り 新宿 代々木.mp3",
  28: "28 山手線「車内 自動放送」内回り 原宿 渋谷.mp3",
  29: "29 山手線「車内 自動放送」内回り 恵比寿 目黒.mp3",
  30: "30 山手線「車内 自動放送」内回り 五反田 大崎行き.mp3",
  32: "32 山手線「駅ホーム 自動放送」外回り 大崎 大崎始発 大崎行き 五反田.mp3",
  33: "33 山手線「駅ホーム 自動放送」外回り 目黒 恵比寿.mp3",
  34: "34 山手線「駅ホーム 自動放送」外回り 渋谷 原宿.mp3",
  35: "35 山手線「駅ホーム 自動放送」外回り 代々木 新宿.mp3",
  36: "36 山手線「駅ホーム 自動放送」外回り 新大久保 高田馬場.mp3",
  37: "37 山手線「駅ホーム 自動放送」外回り 目白 池袋 池袋始発 池袋行き.mp3",
  38: "38 山手線「駅ホーム 自動放送」外回り 大塚 巣鴨.mp3",
  39: "39 山手線「駅ホーム 自動放送」外回り 駒込 田端.mp3",
  40: "40 山手線「駅ホーム 自動放送」外回り 西日暮里 日暮里.mp3",
  41: "41 山手線「駅ホーム 自動放送」外回り 鶯谷 上野.mp3",
  42: "42 山手線「駅ホーム 自動放送」外回り 御徒町 秋葉原.mp3",
  43: "43 山手線「駅ホーム 自動放送」外回り 神田 東京.mp3",
  44: "44 山手線「駅ホーム 自動放送」外回り 有楽町 新橋.mp3",
  45: "45 山手線「駅ホーム 自動放送」外回り 浜松町 田町 田町始発.mp3",
  46: "46 山手線「駅ホーム 自動放送」外回り 品川 品川行き.mp3",
  47: "47 山手線「駅ホーム 自動放送」内回り 大崎 大崎始発 大崎行き 品川 品川行き.mp3",
  48: "48 山手線「駅ホーム 自動放送」内回り 田町 浜松町.mp3",
  49: "49 山手線「駅ホーム 自動放送」内回り 新橋 有楽町.mp3",
  50: "50 山手線「駅ホーム 自動放送」内回り 東京 神田.mp3",
  51: "51 山手線「駅ホーム 自動放送」内回り 秋葉原 御徒町.mp3",
  52: "52 山手線「駅ホーム 自動放送」内回り 上野 鶯谷.mp3",
  53: "53 山手線「駅ホーム 自動放送」内回り 日暮里 西日暮里.mp3",
  54: "54 山手線「駅ホーム 自動放送」内回り 田端 駒込.mp3",
  55: "55 山手線「駅ホーム 自動放送」内回り 巣鴨 大塚.mp3",
  56: "56 山手線「駅ホーム 自動放送」内回り 池袋 池袋始発 池袋行き 目白.mp3",
  57: "57 山手線「駅ホーム 自動放送」内回り 高田馬場 新大久保.mp3",
  58: "58 山手線「駅ホーム 自動放送」内回り 新宿 代々木.mp3",
  59: "59 山手線「駅ホーム 自動放送」内回り 原宿 渋谷.mp3",
  60: "60 山手線「駅ホーム 自動放送」内回り 恵比寿 目黒.mp3",
  61: "61 山手線「駅ホーム 自動放送」内回り 五反田.mp3",
};

// ─── Station segment mappings ───────────────────────────────────────
// Each entry: { station, start, end }
// Times are MM:SS or MM:SS.s format for ffmpeg -ss/-to
// "start" = beginning of Japanese announcement
// "end"   = end of Japanese portion (before English or next segment)
//
// Derived from JR_arrival_audio_transcriptions.txt timestamps.
// Some boundaries are approximate where Whisper output was garbled.
// Takanawa Gateway is NOT in this audio collection (station opened 2020,
// audio predates it). We skip it in the ride sequence.

const TRACK_MAP = [
  // ═══════════════════════════════════════════════════════════════════
  // 外回り 車内 (clockwise in-car) — Tracks 01-15
  // Each track: departing StationA → announcing next, departing StationB → announcing next
  // ═══════════════════════════════════════════════════════════════════
  {
    track: 1, type: "shanai", direction: "cw",
    segments: [
      // Departing Osaki → "次は五反田"
      { station: "gotanda", start: "00:00", end: "00:13" },
      // Departing Gotanda → "次は目黒"
      { station: "meguro", start: "00:27", end: "00:41" },
    ],
  },
  {
    track: 2, type: "shanai", direction: "cw",
    segments: [
      // Departing Meguro → "次はエビス"
      { station: "ebisu", start: "00:00", end: "00:13" },
      // Departing Ebisu → "次は渋谷" (transfer lines: 東急東横線 etc.)
      { station: "shibuya", start: "00:24", end: "00:53" },
    ],
  },
  {
    track: 3, type: "shanai", direction: "cw",
    segments: [
      // Departing Shibuya → "次は原宿" (includes direction announcement)
      { station: "harajuku", start: "00:00", end: "00:18" },
      // Departing Harajuku → "次は代々木" (Whisper garbled as 池袋/千代田)
      { station: "yoyogi", start: "00:30", end: "00:51" },
    ],
  },
  {
    track: 4, type: "shanai", direction: "cw",
    segments: [
      // Departing Yoyogi → "次は新宿"
      { station: "shinjuku", start: "00:00", end: "00:23" },
      // Departing Shinjuku → "次は新大久保" (starts with direction announcement)
      { station: "shin_okubo", start: "00:45", end: "00:59" },
    ],
  },
  {
    track: 5, type: "shanai", direction: "cw",
    segments: [
      // Departing Shin-Okubo → "次は高田馬場"
      { station: "takadanobaba", start: "00:00", end: "00:29" },
      // Departing Takadanobaba → "次は目白"
      { station: "mejiro", start: "00:54", end: "01:06" },
    ],
  },
  {
    track: 6, type: "shanai", direction: "cw",
    segments: [
      // Departing Mejiro → "次は池袋"
      { station: "ikebukuro", start: "00:00", end: "00:20" },
      // Departing Ikebukuro → "次は大塚" (after terminus content)
      { station: "otsuka", start: "01:33", end: "01:51" },
    ],
  },
  {
    track: 7, type: "shanai", direction: "cw",
    segments: [
      // Departing Otsuka → "次は巣鴨"
      { station: "sugamo", start: "00:00", end: "00:11" },
      // Departing Sugamo → "次は駒込"
      { station: "komagome", start: "00:23", end: "00:40" },
    ],
  },
  {
    track: 8, type: "shanai", direction: "cw",
    segments: [
      // Departing Komagome → "次は田端"
      { station: "tabata", start: "00:00", end: "00:24" },
      // Departing Tabata → "次は西日暮里"
      { station: "nishi_nippori", start: "00:43", end: "00:57" },
    ],
  },
  {
    track: 9, type: "shanai", direction: "cw",
    segments: [
      // Departing Nishi-Nippori → "次は日暮里"
      { station: "nippori", start: "00:00", end: "00:12" },
      // Departing Nippori → "次は鶯谷"
      { station: "uguisudani", start: "00:25", end: "00:38" },
    ],
  },
  {
    track: 10, type: "shanai", direction: "cw",
    segments: [
      // Departing Uguisudani → "次は上野"
      { station: "ueno", start: "00:00", end: "00:18" },
      // Departing Ueno → "次は御徒町" (starts with direction announcement)
      { station: "okachimachi", start: "00:38", end: "00:57" },
    ],
  },
  {
    track: 11, type: "shanai", direction: "cw",
    segments: [
      // Departing Okachimachi → "次は秋葉原"
      { station: "akihabara", start: "00:00", end: "00:15" },
      // Departing Akihabara → "次は神田"
      { station: "kanda", start: "00:21", end: "00:40" },
    ],
  },
  {
    track: 12, type: "shanai", direction: "cw",
    segments: [
      // Departing Kanda → "次は東京"
      { station: "tokyo", start: "00:00", end: "00:19" },
      // Departing Tokyo → "次は有楽町" (starts with direction announcement)
      { station: "yurakucho", start: "00:37", end: "01:00" },
    ],
  },
  {
    track: 13, type: "shanai", direction: "cw",
    segments: [
      // Departing Yurakucho → "次は新橋"
      { station: "shimbashi", start: "00:00", end: "00:15" },
      // Departing Shimbashi → "次は浜松町"
      { station: "hamamatsucho", start: "00:31", end: "00:45" },
    ],
  },
  {
    track: 14, type: "shanai", direction: "cw",
    segments: [
      // Departing Hamamatsucho → "次は田町"
      { station: "tamachi", start: "00:00", end: "00:11" },
      // Departing Tamachi → "次は品川"
      { station: "shinagawa", start: "00:23", end: "00:54" },
    ],
  },
  {
    track: 15, type: "shanai", direction: "cw",
    segments: [
      // Departing Shinagawa → "次は大崎" (includes direction + priority seat)
      { station: "osaki", start: "00:00", end: "00:36" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 内回り 車内 (counter-clockwise in-car) — Tracks 16-30
  // ═══════════════════════════════════════════════════════════════════
  {
    track: 16, type: "shanai", direction: "ccw",
    segments: [
      // Departing Osaki → "次は品川"
      { station: "shinagawa", start: "00:00", end: "00:32" },
      // Departing Shinagawa → "次は田町" (after terminus content)
      { station: "tamachi", start: "01:48", end: "02:24" },
    ],
  },
  {
    track: 17, type: "shanai", direction: "ccw",
    segments: [
      // Departing Tamachi → "次は浜松町"
      { station: "hamamatsucho", start: "00:00", end: "00:15" },
      // Departing Hamamatsucho → "次は新橋"
      { station: "shimbashi", start: "00:27", end: "00:44" },
    ],
  },
  {
    track: 18, type: "shanai", direction: "ccw",
    segments: [
      // Departing Shimbashi → "次は有楽町"
      { station: "yurakucho", start: "00:00", end: "00:14" },
      // Departing Yurakucho → "次は東京"
      { station: "tokyo", start: "00:27", end: "00:47" },
    ],
  },
  {
    track: 19, type: "shanai", direction: "ccw",
    segments: [
      // Departing Tokyo → "次は神田" (includes direction announcement)
      { station: "kanda", start: "00:00", end: "00:19" },
      // Departing Kanda → "次は秋葉原"
      { station: "akihabara", start: "00:36", end: "00:53" },
    ],
  },
  {
    track: 20, type: "shanai", direction: "ccw",
    segments: [
      // Departing Akihabara → "次は御徒町"
      { station: "okachimachi", start: "00:00", end: "00:12" },
      // Departing Okachimachi → "次は上野"
      { station: "ueno", start: "00:18", end: "00:42" },
    ],
  },
  {
    track: 21, type: "shanai", direction: "ccw",
    segments: [
      // Departing Ueno → "次は鶯谷" (includes direction announcement)
      { station: "uguisudani", start: "00:00", end: "00:15" },
      // Departing Uguisudani → "次は日暮里"
      { station: "nippori", start: "00:27", end: "00:41" },
    ],
  },
  {
    track: 22, type: "shanai", direction: "ccw",
    segments: [
      // Departing Nippori → "次は西日暮里"
      { station: "nishi_nippori", start: "00:00", end: "00:12" },
      // Departing Nishi-Nippori → "次は田端"
      { station: "tabata", start: "00:23", end: "00:43" },
    ],
  },
  {
    track: 23, type: "shanai", direction: "ccw",
    segments: [
      // Departing Tabata → "次は駒込" (includes priority seat announcement)
      { station: "komagome", start: "00:00", end: "00:24" },
      // Departing Komagome → "次は巣鴨"
      { station: "sugamo", start: "00:45", end: "00:57" },
    ],
  },
  {
    track: 24, type: "shanai", direction: "ccw",
    segments: [
      // Departing Sugamo → "次は大塚"
      { station: "otsuka", start: "00:00", end: "00:11" },
      // Departing Otsuka → "次は池袋"
      { station: "ikebukuro", start: "00:22", end: "00:42" },
    ],
  },
  {
    track: 25, type: "shanai", direction: "ccw",
    segments: [
      // Departing Ikebukuro → "次は目白" (includes direction announcement)
      { station: "mejiro", start: "00:00", end: "00:14" },
      // Departing Mejiro → "次は高田馬場"
      { station: "takadanobaba", start: "00:28", end: "00:41" },
    ],
  },
  {
    track: 26, type: "shanai", direction: "ccw",
    segments: [
      // Departing Takadanobaba → "次は新大久保" (includes phone etiquette)
      { station: "shin_okubo", start: "00:00", end: "00:24" },
      // Departing Shin-Okubo → "次は新宿"
      { station: "shinjuku", start: "00:40", end: "01:05" },
    ],
  },
  {
    track: 27, type: "shanai", direction: "ccw",
    segments: [
      // Departing Shinjuku → "次は代々木" (includes direction announcement)
      { station: "yoyogi", start: "00:00", end: "00:18" },
      // Departing Yoyogi → "次は原宿"
      { station: "harajuku", start: "00:34", end: "00:47" },
    ],
  },
  {
    track: 28, type: "shanai", direction: "ccw",
    segments: [
      // Departing Harajuku → "次は渋谷" (includes gap warning)
      { station: "shibuya", start: "00:00", end: "00:24" },
      // Departing Shibuya → "次はエビス" (includes direction announcement)
      { station: "ebisu", start: "00:43", end: "01:07" },
    ],
  },
  {
    track: 29, type: "shanai", direction: "ccw",
    segments: [
      // Departing Ebisu → "次は目黒"
      { station: "meguro", start: "00:00", end: "00:15" },
      // Departing Meguro → "次は五反田"
      { station: "gotanda", start: "00:27", end: "00:42" },
    ],
  },
  {
    track: 30, type: "shanai", direction: "ccw",
    segments: [
      // Departing Gotanda → "次は大崎"
      { station: "osaki", start: "00:00", end: "00:13" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 外回り 駅ホーム (clockwise platform) — Tracks 32-46
  // Pattern: "まもなく○番線に..." → "黄色い線まで..." → "Station, ご乗車ありがとう" → "ドアが閉まります"
  // ═══════════════════════════════════════════════════════════════════
  {
    track: 32, type: "platform", direction: "cw",
    segments: [
      // Osaki platform (regular departure)
      { station: "osaki", start: "00:00", end: "00:24" },
      // Gotanda platform (near end of track, after terminus versions)
      { station: "gotanda", start: "01:14", end: "01:37" },
    ],
  },
  {
    track: 33, type: "platform", direction: "cw",
    segments: [
      { station: "meguro", start: "00:03", end: "00:22" },
      { station: "ebisu", start: "00:22", end: "00:46" },
    ],
  },
  {
    track: 34, type: "platform", direction: "cw",
    segments: [
      // Shibuya (includes gap warning)
      { station: "shibuya", start: "00:03", end: "00:29" },
      { station: "harajuku", start: "00:35", end: "00:54" },
    ],
  },
  {
    track: 35, type: "platform", direction: "cw",
    segments: [
      { station: "yoyogi", start: "00:00", end: "00:28" },
      { station: "shinjuku", start: "00:28", end: "00:48" },
    ],
  },
  {
    track: 36, type: "platform", direction: "cw",
    segments: [
      { station: "shin_okubo", start: "00:03", end: "00:28" },
      { station: "takadanobaba", start: "00:28", end: "00:47" },
    ],
  },
  {
    track: 37, type: "platform", direction: "cw",
    segments: [
      { station: "mejiro", start: "00:00", end: "00:27" },
      // Ikebukuro regular departure (not terminus)
      { station: "ikebukuro", start: "00:27", end: "00:52" },
    ],
  },
  {
    track: 38, type: "platform", direction: "cw",
    segments: [
      { station: "otsuka", start: "00:03", end: "00:27" },
      { station: "sugamo", start: "00:27", end: "00:47" },
    ],
  },
  {
    track: 39, type: "platform", direction: "cw",
    segments: [
      { station: "komagome", start: "00:00", end: "00:27" },
      { station: "tabata", start: "00:27", end: "00:47" },
    ],
  },
  {
    track: 40, type: "platform", direction: "cw",
    segments: [
      { station: "nishi_nippori", start: "00:00", end: "00:29" },
      { station: "nippori", start: "00:29", end: "00:48" },
    ],
  },
  {
    track: 41, type: "platform", direction: "cw",
    segments: [
      { station: "uguisudani", start: "00:03", end: "00:23" },
      { station: "ueno", start: "00:23", end: "00:48" },
    ],
  },
  {
    track: 42, type: "platform", direction: "cw",
    segments: [
      { station: "okachimachi", start: "00:00", end: "00:28" },
      { station: "akihabara", start: "00:28", end: "00:48" },
    ],
  },
  {
    track: 43, type: "platform", direction: "cw",
    segments: [
      { station: "kanda", start: "00:00", end: "00:28" },
      { station: "tokyo", start: "00:28", end: "00:48" },
    ],
  },
  {
    track: 44, type: "platform", direction: "cw",
    segments: [
      { station: "yurakucho", start: "00:03", end: "00:24" },
      { station: "shimbashi", start: "00:24", end: "00:50" },
    ],
  },
  {
    track: 45, type: "platform", direction: "cw",
    segments: [
      { station: "hamamatsucho", start: "00:03", end: "00:30" },
      { station: "tamachi", start: "00:30", end: "00:55" },
    ],
  },
  {
    track: 46, type: "platform", direction: "cw",
    segments: [
      // Shinagawa regular departure
      { station: "shinagawa", start: "00:03", end: "00:28" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 内回り 駅ホーム (counter-clockwise platform) — Tracks 47-61
  // ═══════════════════════════════════════════════════════════════════
  {
    track: 47, type: "platform", direction: "ccw",
    segments: [
      // Osaki regular departure
      { station: "osaki", start: "00:03", end: "00:23" },
      // Shinagawa (after terminus content)
      { station: "shinagawa", start: "01:18", end: "01:38" },
    ],
  },
  {
    track: 48, type: "platform", direction: "ccw",
    segments: [
      { station: "tamachi", start: "00:03", end: "00:29" },
      { station: "hamamatsucho", start: "00:29", end: "00:50" },
    ],
  },
  {
    track: 49, type: "platform", direction: "ccw",
    segments: [
      { station: "shimbashi", start: "00:00", end: "00:24" },
      { station: "yurakucho", start: "00:24", end: "00:49" },
    ],
  },
  {
    track: 50, type: "platform", direction: "ccw",
    segments: [
      { station: "tokyo", start: "00:03", end: "00:29" },
      { station: "kanda", start: "00:29", end: "00:50" },
    ],
  },
  {
    track: 51, type: "platform", direction: "ccw",
    segments: [
      { station: "akihabara", start: "00:03", end: "00:28" },
      { station: "okachimachi", start: "00:28", end: "00:50" },
    ],
  },
  {
    track: 52, type: "platform", direction: "ccw",
    segments: [
      { station: "ueno", start: "00:03", end: "00:28" },
      { station: "uguisudani", start: "00:28", end: "00:49" },
    ],
  },
  {
    track: 53, type: "platform", direction: "ccw",
    segments: [
      { station: "nippori", start: "00:03", end: "00:29" },
      { station: "nishi_nippori", start: "00:29", end: "00:51" },
    ],
  },
  {
    track: 54, type: "platform", direction: "ccw",
    segments: [
      { station: "tabata", start: "00:03", end: "00:28" },
      { station: "komagome", start: "00:28", end: "00:48" },
    ],
  },
  {
    track: 55, type: "platform", direction: "ccw",
    segments: [
      { station: "sugamo", start: "00:03", end: "00:23" },
      { station: "otsuka", start: "00:23", end: "00:49" },
    ],
  },
  {
    track: 56, type: "platform", direction: "ccw",
    segments: [
      // Ikebukuro regular departure
      { station: "ikebukuro", start: "00:03", end: "00:29" },
      // Mejiro (after terminus content)
      { station: "mejiro", start: "01:17", end: "01:39" },
    ],
  },
  {
    track: 57, type: "platform", direction: "ccw",
    segments: [
      { station: "takadanobaba", start: "00:03", end: "00:24" },
      { station: "shin_okubo", start: "00:24", end: "00:50" },
    ],
  },
  {
    track: 58, type: "platform", direction: "ccw",
    segments: [
      { station: "shinjuku", start: "00:00", end: "00:30" },
      { station: "yoyogi", start: "00:30", end: "00:51" },
    ],
  },
  {
    track: 59, type: "platform", direction: "ccw",
    segments: [
      { station: "harajuku", start: "00:03", end: "00:24" },
      // Shibuya (includes gap warning)
      { station: "shibuya", start: "00:24", end: "00:57" },
    ],
  },
  {
    track: 60, type: "platform", direction: "ccw",
    segments: [
      { station: "ebisu", start: "00:03", end: "00:28" },
      { station: "meguro", start: "00:28", end: "00:47" },
    ],
  },
  {
    track: 61, type: "platform", direction: "ccw",
    segments: [
      { station: "gotanda", start: "00:03", end: "00:25" },
    ],
  },
];

// ─── Slicing logic ──────────────────────────────────────────────────

function slice(inputPath, outputPath, start, end) {
  // Use -ss before -i for fast seek, -to for end time relative to input
  const cmd = [
    "ffmpeg", "-y",
    "-ss", start,
    "-to", end,
    "-i", `"${inputPath}"`,
    "-c:a", "libmp3lame",
    "-q:a", "4",        // VBR quality ~165kbps, good for voice
    "-af", "afade=t=out:st=" + fadeOutStart(start, end) + ":d=0.3",
    `"${outputPath}"`,
  ].join(" ");

  execSync(cmd, { stdio: "pipe" });
}

/** Calculate fade-out start time (0.3s before end, relative to clip start) */
function fadeOutStart(startStr, endStr) {
  const s = parseTime(startStr);
  const e = parseTime(endStr);
  const duration = e - s;
  return Math.max(0, duration - 0.3).toFixed(2);
}

function parseTime(str) {
  const parts = str.split(":");
  if (parts.length === 2) {
    return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  }
  return parseFloat(str);
}

// ─── Main ───────────────────────────────────────────────────────────

function main() {
  if (!existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`);
    console.error("Make sure the JR audio files are in public/");
    process.exit(1);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  let total = 0;
  let skipped = 0;
  let errors = 0;

  for (const entry of TRACK_MAP) {
    const filename = SOURCE_FILES[entry.track];
    if (!filename) {
      console.warn(`No source file for track ${entry.track}, skipping`);
      skipped++;
      continue;
    }

    const inputPath = resolve(SOURCE_DIR, filename);
    if (!existsSync(inputPath)) {
      console.warn(`File not found: ${filename}, skipping`);
      skipped++;
      continue;
    }

    for (const seg of entry.segments) {
      const outName = `${seg.station}_${entry.direction}_${entry.type}.mp3`;
      const outputPath = resolve(OUTPUT_DIR, outName);

      try {
        slice(inputPath, outputPath, seg.start, seg.end);
        total++;
        console.log(`  ✓ ${outName}`);
      } catch (err) {
        errors++;
        console.error(`  ✗ ${outName}: ${err.message}`);
      }
    }
  }

  console.log(`\nDone! ${total} clips created, ${skipped} skipped, ${errors} errors`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main();
