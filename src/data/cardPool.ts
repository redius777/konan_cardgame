/**
 * 名探偵コナンTCG - カードプール
 * MVP版：基本的なカードセット
 */

import {
  PartnerCard,
  CaseCard,
  CharacterCard,
  EventCard,
  CardType,
  CardColor,
} from '../models/types';

// ==================== パートナーカード ====================

export const PARTNERS: PartnerCard[] = [
  {
    id: 'partner_conan',
    name: '江戸川コナン',
    type: CardType.PARTNER,
    color: CardColor.BLUE,
    ability: 'アシスト: FILEが7枚以上で解決フェーズへ移行\n事件解決: 証拠が条件を満たすと勝利',
  },
  {
    id: 'partner_heiji',
    name: '服部平次',
    type: CardType.PARTNER,
    color: CardColor.RED,
    ability: 'アシスト: FILEが7枚以上で解決フェーズへ移行\n事件解決: 証拠が条件を満たすと勝利',
  },
];

// ==================== 事件カード ====================

export const CASES: CaseCard[] = [
  {
    id: 'case_murder',
    name: '殺人事件',
    type: CardType.CASE,
    color: CardColor.RED,
    requiredEvidence: 7,
    description: '証拠を集めて真実を明らかにせよ',
  },
  {
    id: 'case_kidnapping',
    name: '誘拐事件',
    type: CardType.CASE,
    color: CardColor.BLUE,
    requiredEvidence: 7,
    description: '人質を救出し、犯人を捕まえろ',
  },
];

// ==================== キャラクターカード ====================

export const CHARACTERS: CharacterCard[] = [
  // レベル1キャラクター（序盤から使える）
  {
    id: 'char_genta',
    name: '小嶋元太',
    type: CardType.CHARACTER,
    color: CardColor.RED,
    level: 1,
    ap: 2,
    lp: 1,
    ability: '少年探偵団のリーダー格',
  },
  {
    id: 'char_mitsuhiko',
    name: '円谷光彦',
    type: CardType.CHARACTER,
    color: CardColor.BLUE,
    level: 1,
    ap: 1,
    lp: 2,
    ability: '知識豊富な少年探偵団メンバー',
  },
  {
    id: 'char_ayumi',
    name: '吉田歩美',
    type: CardType.CHARACTER,
    color: CardColor.YELLOW,
    level: 1,
    ap: 1,
    lp: 1,
    ability: '少年探偵団の紅一点',
  },
  {
    id: 'char_ai',
    name: '灰原哀',
    type: CardType.CHARACTER,
    color: CardColor.BLUE,
    level: 1,
    ap: 2,
    lp: 2,
    ability: '元黒の組織の科学者',
  },

  // レベル2キャラクター（中盤）
  {
    id: 'char_ran',
    name: '毛利蘭',
    type: CardType.CHARACTER,
    color: CardColor.RED,
    level: 2,
    ap: 4,
    lp: 2,
    ability: '空手の達人',
  },
  {
    id: 'char_sonoko',
    name: '鈴木園子',
    type: CardType.CHARACTER,
    color: CardColor.YELLOW,
    level: 2,
    ap: 2,
    lp: 3,
    ability: '鈴木財閥の令嬢',
  },
  {
    id: 'char_kazuha',
    name: '遠山和葉',
    type: CardType.CHARACTER,
    color: CardColor.GREEN,
    level: 2,
    ap: 3,
    lp: 2,
    ability: '平次の幼馴染',
  },
  {
    id: 'char_kogoro',
    name: '毛利小五郎',
    type: CardType.CHARACTER,
    color: CardColor.RED,
    level: 2,
    ap: 3,
    lp: 1,
    ability: '眠りの小五郎',
  },

  // レベル3キャラクター（終盤の切り札）
  {
    id: 'char_shinichi',
    name: '工藤新一',
    type: CardType.CHARACTER,
    color: CardColor.BLUE,
    level: 3,
    ap: 4,
    lp: 4,
    ability: '高校生探偵',
  },
  {
    id: 'char_kid',
    name: '怪盗キッド',
    type: CardType.CHARACTER,
    color: CardColor.WHITE,
    level: 3,
    ap: 5,
    lp: 3,
    ability: '月下の奇術師',
  },
  {
    id: 'char_shuichi',
    name: '赤井秀一',
    type: CardType.CHARACTER,
    color: CardColor.BLACK,
    level: 3,
    ap: 6,
    lp: 3,
    ability: 'FBI捜査官',
  },
  {
    id: 'char_rei',
    name: '安室透',
    type: CardType.CHARACTER,
    color: CardColor.YELLOW,
    level: 3,
    ap: 5,
    lp: 4,
    ability: 'トリプルフェイス',
  },

  // レベル4キャラクター（最強クラス）
  {
    id: 'char_conan_resolve',
    name: 'コナン（推理タイム）',
    type: CardType.CHARACTER,
    color: CardColor.BLUE,
    level: 4,
    ap: 3,
    lp: 5,
    ability: '真実はいつもひとつ！',
  },
  {
    id: 'char_heiji_resolve',
    name: '平次（推理タイム）',
    type: CardType.CHARACTER,
    color: CardColor.RED,
    level: 4,
    ap: 4,
    lp: 5,
    ability: '西の高校生探偵',
  },
];

// ==================== イベントカード ====================

export const EVENTS: EventCard[] = [
  {
    id: 'event_hint',
    name: '新たな手がかり',
    type: CardType.EVENT,
    color: CardColor.BLUE,
    level: 1,
    effect: '証拠エリアに1枚追加',
  },
  {
    id: 'event_deduction',
    name: '推理ショー',
    type: CardType.EVENT,
    color: CardColor.BLUE,
    level: 2,
    effect: '証拠エリアに2枚追加',
  },
  {
    id: 'event_confusion',
    name: '混乱',
    type: CardType.EVENT,
    color: CardColor.RED,
    level: 1,
    effect: '相手の証拠エリアから1枚除去',
  },
  {
    id: 'event_investigation',
    name: '現場検証',
    type: CardType.EVENT,
    color: CardColor.GREEN,
    level: 2,
    effect: 'FILEから1枚手札に加え、1枚ドロー',
  },
  {
    id: 'event_trap',
    name: '罠',
    type: CardType.EVENT,
    color: CardColor.BLACK,
    level: 2,
    effect: '相手のキャラクター1体を破壊',
  },
];

// ==================== デッキ構築ヘルパー ====================

/**
 * 基本デッキを構築（40枚）
 */
export function buildBasicDeck(color: CardColor = CardColor.BLUE): (CharacterCard | EventCard)[] {
  const deck: (CharacterCard | EventCard)[] = [];

  // キャラクターカード配分（30枚）
  // レベル1: 12枚
  const level1Chars = CHARACTERS.filter((c) => c.level === 1);
  for (let i = 0; i < 12; i++) {
    deck.push(level1Chars[i % level1Chars.length]);
  }

  // レベル2: 12枚
  const level2Chars = CHARACTERS.filter((c) => c.level === 2);
  for (let i = 0; i < 12; i++) {
    deck.push(level2Chars[i % level2Chars.length]);
  }

  // レベル3: 4枚
  const level3Chars = CHARACTERS.filter((c) => c.level === 3);
  for (let i = 0; i < 4; i++) {
    deck.push(level3Chars[i % level3Chars.length]);
  }

  // レベル4: 2枚
  const level4Chars = CHARACTERS.filter((c) => c.level === 4);
  for (let i = 0; i < 2; i++) {
    deck.push(level4Chars[i % level4Chars.length]);
  }

  // イベントカード（10枚）
  for (let i = 0; i < 10; i++) {
    deck.push(EVENTS[i % EVENTS.length]);
  }

  return deck;
}

/**
 * カードをIDから取得
 */
export function getCardById(id: string): PartnerCard | CaseCard | CharacterCard | EventCard | undefined {
  const allCards = [...PARTNERS, ...CASES, ...CHARACTERS, ...EVENTS];
  return allCards.find((card) => card.id === id);
}
