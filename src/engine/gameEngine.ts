/**
 * 名探偵コナンTCG - ゲームエンジン
 * ゲームの初期化、ターン管理、ルール処理を行う
 */

import {
  GameState,
  PlayerState,
  Card,
  CharacterCard,
  EventCard,
  CardType,
  CardState,
  CasePhase,
  TurnPhase,
  ActionType,
  PlayerAction,
  ActionResult,
  FieldCharacter,
} from '../models/types';
import { PARTNERS, CASES, buildBasicDeck } from '../data/cardPool';

/**
 * ゲーム状態を初期化
 */
export function initializeGame(): GameState {
  // プレイヤー1の初期化
  const player1Deck = buildBasicDeck();
  const player1: PlayerState = {
    id: 'player1',
    name: 'プレイヤー1',
    partner: PARTNERS[0], // コナン
    partnerState: CardState.ACTIVE,
    caseCard: CASES[0], // 殺人事件
    casePhase: CasePhase.INCIDENT,
    deck: shuffleDeck([...player1Deck]),
    hand: [],
    field: [],
    fileArea: [],
    evidenceArea: [],
    discardPile: [],
    isFirstPlayer: true,
  };

  // プレイヤー2（AI）の初期化
  const player2Deck = buildBasicDeck();
  const player2: PlayerState = {
    id: 'player2',
    name: 'AI',
    partner: PARTNERS[1], // 平次
    partnerState: CardState.ACTIVE,
    caseCard: CASES[1], // 誘拐事件
    casePhase: CasePhase.INCIDENT,
    deck: shuffleDeck([...player2Deck]),
    hand: [],
    field: [],
    fileArea: [],
    evidenceArea: [],
    discardPile: [],
    isFirstPlayer: false,
  };

  // 初期手札ドロー（5枚）
  for (let i = 0; i < 5; i++) {
    drawCard(player1);
    drawCard(player2);
  }

  return {
    player1,
    player2,
    currentPlayer: 'player1',
    turnNumber: 1,
    phase: TurnPhase.AUTO,
    winner: null,
  };
}

/**
 * デッキをシャッフル
 */
function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * カードを1枚ドロー
 */
export function drawCard(player: PlayerState): Card | null {
  if (player.deck.length === 0) {
    return null;
  }
  const card = player.deck.shift()!;
  player.hand.push(card);
  return card;
}

/**
 * オートフェーズの処理
 */
export function processAutoPhase(gameState: GameState): void {
  const currentPlayer = gameState[gameState.currentPlayer];

  // 1. Sleepキャラクターをリフレッシュ
  currentPlayer.field.forEach((fieldChar) => {
    fieldChar.state = CardState.ACTIVE;
  });

  // パートナーもリフレッシュ
  currentPlayer.partnerState = CardState.ACTIVE;

  // 2. FILE追加（先攻1ターン目は1枚、それ以外は2枚）
  const fileCount = gameState.turnNumber === 1 && currentPlayer.isFirstPlayer ? 1 : 2;
  for (let i = 0; i < fileCount; i++) {
    if (currentPlayer.deck.length > 0) {
      const card = currentPlayer.deck.shift()!;
      currentPlayer.fileArea.push(card);
    }
  }

  // 3. ドロー
  drawCard(currentPlayer);

  // メインフェーズへ移行
  gameState.phase = TurnPhase.MAIN;
}

/**
 * メインフェーズでアクションを実行
 */
export function executeAction(gameState: GameState, action: PlayerAction): ActionResult {
  const currentPlayer = gameState[gameState.currentPlayer];
  const opponent = gameState[gameState.currentPlayer === 'player1' ? 'player2' : 'player1'];

  switch (action.type) {
    case ActionType.PLAY_CHARACTER:
      return playCharacter(currentPlayer, action.cardId!);

    case ActionType.PLAY_EVENT:
      return playEvent(currentPlayer, opponent, action.cardId!);

    case ActionType.REASONING:
      return performReasoning(currentPlayer, action.cardId!);

    case ActionType.ATTACK:
      return performAttack(currentPlayer, opponent, action.cardId!, action.targetId);

    case ActionType.PARTNER_ASSIST:
      return performPartnerAssist(currentPlayer);

    case ActionType.CASE_RESOLUTION:
      return performCaseResolution(gameState, currentPlayer);

    case ActionType.END_TURN:
      return endTurn(gameState);

    default:
      return { success: false, message: '無効なアクションです' };
  }
}

/**
 * キャラクターカードをプレイ
 */
function playCharacter(player: PlayerState, cardId: string): ActionResult {
  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return { success: false, message: 'カードが手札にありません' };
  }

  const card = player.hand[cardIndex];
  if (card.type !== CardType.CHARACTER) {
    return { success: false, message: 'キャラクターカードではありません' };
  }

  const charCard = card as CharacterCard;

  // レベル制限チェック
  if (charCard.level > player.fileArea.length) {
    return {
      success: false,
      message: `レベル不足です（必要: ${charCard.level}, 現在のFILE: ${player.fileArea.length}）`,
    };
  }

  // 手札から場へ
  player.hand.splice(cardIndex, 1);
  player.field.push({
    card: charCard,
    state: CardState.ACTIVE,
    temporaryAP: 0,
    temporaryLP: 0,
  });

  return { success: true, message: `${charCard.name}を場に出しました` };
}

/**
 * イベントカードをプレイ
 */
function playEvent(player: PlayerState, opponent: PlayerState, cardId: string): ActionResult {
  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return { success: false, message: 'カードが手札にありません' };
  }

  const card = player.hand[cardIndex];
  if (card.type !== CardType.EVENT) {
    return { success: false, message: 'イベントカードではありません' };
  }

  const eventCard = card as EventCard;

  // レベル制限チェック
  if (eventCard.level > player.fileArea.length) {
    return {
      success: false,
      message: `レベル不足です（必要: ${eventCard.level}, 現在のFILE: ${player.fileArea.length}）`,
    };
  }

  // 簡易的なイベント効果処理
  let effectMessage = '';
  if (eventCard.id === 'event_hint' || eventCard.id === 'event_deduction') {
    const addCount = eventCard.id === 'event_hint' ? 1 : 2;
    for (let i = 0; i < addCount; i++) {
      if (player.deck.length > 0) {
        const evidenceCard = player.deck.shift()!;
        player.evidenceArea.push(evidenceCard);
      }
    }
    effectMessage = `証拠を${addCount}枚追加しました`;
  } else if (eventCard.id === 'event_confusion') {
    if (opponent.evidenceArea.length > 0) {
      const removed = opponent.evidenceArea.pop()!;
      opponent.discardPile.push(removed);
      effectMessage = '相手の証拠を1枚除去しました';
    }
  }

  // 手札から捨て札へ
  player.hand.splice(cardIndex, 1);
  player.discardPile.push(eventCard);

  return { success: true, message: `${eventCard.name}を使用: ${effectMessage}` };
}

/**
 * 推理を実行
 */
function performReasoning(player: PlayerState, cardId: string): ActionResult {
  // パートナーでの推理
  if (cardId === player.partner.id) {
    if (player.partnerState !== CardState.ACTIVE) {
      return { success: false, message: 'パートナーはSleep状態です' };
    }
    // パートナーのLPは固定で2とする（簡略化）
    const lp = 2;
    for (let i = 0; i < lp; i++) {
      if (player.deck.length > 0) {
        const evidenceCard = player.deck.shift()!;
        player.evidenceArea.push(evidenceCard);
      }
    }
    player.partnerState = CardState.SLEEP;
    return { success: true, message: `${player.partner.name}で推理: 証拠+${lp}` };
  }

  // キャラクターでの推理
  const fieldChar = player.field.find((fc) => fc.card.id === cardId);
  if (!fieldChar) {
    return { success: false, message: 'キャラクターが場にいません' };
  }

  if (fieldChar.state !== CardState.ACTIVE) {
    return { success: false, message: 'キャラクターはSleep状態です' };
  }

  const lp = fieldChar.card.lp + fieldChar.temporaryLP;
  for (let i = 0; i < lp; i++) {
    if (player.deck.length > 0) {
      const evidenceCard = player.deck.shift()!;
      player.evidenceArea.push(evidenceCard);
    }
  }

  fieldChar.state = CardState.SLEEP;
  return { success: true, message: `${fieldChar.card.name}で推理: 証拠+${lp}` };
}

/**
 * アクション（攻撃）を実行
 */
function performAttack(
  player: PlayerState,
  opponent: PlayerState,
  attackerId: string,
  targetId?: string
): ActionResult {
  const attacker = player.field.find((fc) => fc.card.id === attackerId);
  if (!attacker) {
    return { success: false, message: '攻撃キャラクターが場にいません' };
  }

  if (attacker.state !== CardState.ACTIVE) {
    return { success: false, message: '攻撃キャラクターはSleep状態です' };
  }

  attacker.state = CardState.SLEEP;

  // ターゲットが事件カードの場合（簡易版：直接攻撃）
  if (!targetId) {
    // 証拠操作
    if (opponent.evidenceArea.length > 0) {
      const removed = opponent.evidenceArea.pop()!;
      opponent.discardPile.push(removed);
    }
    if (player.deck.length > 0) {
      const added = player.deck.shift()!;
      player.evidenceArea.push(added);
    }
    return { success: true, message: `${attacker.card.name}でアクション: 相手証拠-1、自分証拠+1` };
  }

  // ターゲットがキャラクターの場合（コンタクト）
  const defender = opponent.field.find((fc) => fc.card.id === targetId);
  if (!defender) {
    return { success: false, message: '対象キャラクターが場にいません' };
  }

  const attackerAP = attacker.card.ap + attacker.temporaryAP;
  const defenderAP = defender.card.ap + defender.temporaryAP;

  let battleResult = '';
  if (attackerAP > defenderAP) {
    // 攻撃側勝利：防御側破壊
    const defenderIndex = opponent.field.indexOf(defender);
    opponent.field.splice(defenderIndex, 1);
    opponent.discardPile.push(defender.card);
    battleResult = `${defender.card.name}を破壊しました`;
  } else {
    // 防御側勝利または同値：攻撃側破壊
    const attackerIndex = player.field.indexOf(attacker);
    player.field.splice(attackerIndex, 1);
    player.discardPile.push(attacker.card);
    battleResult = `${attacker.card.name}が破壊されました`;
  }

  // 証拠操作（アクションの効果）
  if (opponent.evidenceArea.length > 0) {
    const removed = opponent.evidenceArea.pop()!;
    opponent.discardPile.push(removed);
  }
  if (player.deck.length > 0) {
    const added = player.deck.shift()!;
    player.evidenceArea.push(added);
  }

  return {
    success: true,
    message: `コンタクト発生！ ${battleResult}\n証拠: 相手-1、自分+1`,
  };
}

/**
 * パートナーのアシスト能力
 */
function performPartnerAssist(player: PlayerState): ActionResult {
  if (player.partnerState !== CardState.ACTIVE) {
    return { success: false, message: 'パートナーはSleep状態です' };
  }

  player.partnerState = CardState.SLEEP;
  // パートナーをFILEに追加（簡略化のため、仮想的に+1とする）
  // 実際は複雑だが、ここでは7枚チェックのみ実施
  if (player.fileArea.length >= 6) {
    // アシスト使用で+1されるので7枚になる
    player.casePhase = CasePhase.RESOLUTION;
    return { success: true, message: 'アシスト使用！事件が解決フェーズに移行しました' };
  }

  return {
    success: false,
    message: `アシスト使用にはFILE 7枚必要です（現在: ${player.fileArea.length}）`,
  };
}

/**
 * 事件解決の宣言
 */
function performCaseResolution(gameState: GameState, player: PlayerState): ActionResult {
  if (player.casePhase !== CasePhase.RESOLUTION) {
    return { success: false, message: '事件が解決フェーズにありません' };
  }

  const requiredEvidence = player.isFirstPlayer ? 7 : 6;
  if (player.evidenceArea.length < requiredEvidence) {
    return {
      success: false,
      message: `証拠が不足しています（必要: ${requiredEvidence}, 現在: ${player.evidenceArea.length}）`,
    };
  }

  // 勝利！
  gameState.winner = gameState.currentPlayer;
  return { success: true, message: `事件解決！${player.name}の勝利！`, gameState };
}

/**
 * ターン終了
 */
function endTurn(gameState: GameState): ActionResult {
  gameState.phase = TurnPhase.END;

  // ターンを相手に移す
  gameState.currentPlayer = gameState.currentPlayer === 'player1' ? 'player2' : 'player1';
  gameState.turnNumber++;
  gameState.phase = TurnPhase.AUTO;

  return { success: true, message: 'ターン終了', gameState };
}

/**
 * 勝利条件チェック
 */
export function checkWinCondition(gameState: GameState): 'player1' | 'player2' | null {
  // デッキ切れチェック
  if (gameState.player1.deck.length === 0) {
    return 'player2';
  }
  if (gameState.player2.deck.length === 0) {
    return 'player1';
  }

  return gameState.winner;
}
