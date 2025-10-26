/**
 * 名探偵コナンTCG - シンプルAI
 * 基本的な戦略を持つAI
 */

import {
  GameState,
  PlayerState,
  PlayerAction,
  ActionType,
  CardType,
  CardState,
  CasePhase,
  CharacterCard,
  EventCard,
} from '../models/types';

/**
 * AIのターンを実行
 */
export function getAIAction(gameState: GameState): PlayerAction {
  const ai = gameState[gameState.currentPlayer];
  const opponent = gameState[gameState.currentPlayer === 'player1' ? 'player2' : 'player1'];

  // 優先度1: 勝利条件が満たされていれば事件解決
  if (canResolveCase(ai)) {
    return { type: ActionType.CASE_RESOLUTION };
  }

  // 優先度2: 解決フェーズに移行できるならアシスト
  if (canUseAssist(ai)) {
    return { type: ActionType.PARTNER_ASSIST };
  }

  // 優先度3: 証拠が足りない場合は推理を優先
  const requiredEvidence = ai.isFirstPlayer ? 7 : 6;
  if (ai.evidenceArea.length < requiredEvidence - 2) {
    const reasoningAction = findBestReasoningAction(ai);
    if (reasoningAction) {
      return reasoningAction;
    }
  }

  // 優先度4: 手札からキャラクターをプレイ
  const playCharAction = findBestCharacterToPlay(ai);
  if (playCharAction) {
    return playCharAction;
  }

  // 優先度5: イベントカードをプレイ
  const playEventAction = findBestEventToPlay(ai, opponent);
  if (playEventAction) {
    return playEventAction;
  }

  // 優先度6: 場のキャラで推理
  const reasoningAction = findBestReasoningAction(ai);
  if (reasoningAction) {
    return reasoningAction;
  }

  // 優先度7: 場のキャラで攻撃
  const attackAction = findBestAttackAction(ai, opponent);
  if (attackAction) {
    return attackAction;
  }

  // それ以外：ターン終了
  return { type: ActionType.END_TURN };
}

/**
 * 事件解決が可能かチェック
 */
function canResolveCase(player: PlayerState): boolean {
  if (player.casePhase !== CasePhase.RESOLUTION) {
    return false;
  }
  const requiredEvidence = player.isFirstPlayer ? 7 : 6;
  return player.evidenceArea.length >= requiredEvidence;
}

/**
 * アシストが使用可能かチェック
 */
function canUseAssist(player: PlayerState): boolean {
  if (player.partnerState !== CardState.ACTIVE) {
    return false;
  }
  if (player.casePhase === CasePhase.RESOLUTION) {
    return false;
  }
  return player.fileArea.length >= 6; // アシスト使用で7枚になる
}

/**
 * 最適な推理アクションを探す
 */
function findBestReasoningAction(player: PlayerState): PlayerAction | null {
  // パートナーで推理
  if (player.partnerState === CardState.ACTIVE) {
    return {
      type: ActionType.REASONING,
      cardId: player.partner.id,
    };
  }

  // LPが高いキャラクターで推理
  const activeChars = player.field.filter((fc) => fc.state === CardState.ACTIVE);
  if (activeChars.length === 0) {
    return null;
  }

  activeChars.sort((a, b) => b.card.lp - a.card.lp);
  return {
    type: ActionType.REASONING,
    cardId: activeChars[0].card.id,
  };
}

/**
 * プレイする最適なキャラクターを探す
 */
function findBestCharacterToPlay(player: PlayerState): PlayerAction | null {
  const charCards = player.hand.filter((c) => c.type === CardType.CHARACTER) as CharacterCard[];
  const playableChars = charCards.filter((c) => c.level <= player.fileArea.length);

  if (playableChars.length === 0) {
    return null;
  }

  // レベルが高いキャラを優先
  playableChars.sort((a, b) => b.level - a.level);

  return {
    type: ActionType.PLAY_CHARACTER,
    cardId: playableChars[0].id,
  };
}

/**
 * プレイする最適なイベントを探す
 */
function findBestEventToPlay(player: PlayerState, opponent: PlayerState): PlayerAction | null {
  const eventCards = player.hand.filter((c) => c.type === CardType.EVENT) as EventCard[];
  const playableEvents = eventCards.filter((c) => c.level <= player.fileArea.length);

  if (playableEvents.length === 0) {
    return null;
  }

  // 証拠追加イベントを優先
  const evidenceEvents = playableEvents.filter(
    (e) => e.id === 'event_hint' || e.id === 'event_deduction'
  );
  if (evidenceEvents.length > 0) {
    return {
      type: ActionType.PLAY_EVENT,
      cardId: evidenceEvents[0].id,
    };
  }

  // 相手の証拠を減らすイベント
  if (opponent.evidenceArea.length > 0) {
    const confusionEvent = playableEvents.find((e) => e.id === 'event_confusion');
    if (confusionEvent) {
      return {
        type: ActionType.PLAY_EVENT,
        cardId: confusionEvent.id,
      };
    }
  }

  return {
    type: ActionType.PLAY_EVENT,
    cardId: playableEvents[0].id,
  };
}

/**
 * 最適な攻撃アクションを探す
 */
function findBestAttackAction(player: PlayerState, opponent: PlayerState): PlayerAction | null {
  const activeChars = player.field.filter((fc) => fc.state === CardState.ACTIVE);
  if (activeChars.length === 0) {
    return null;
  }

  // APが高いキャラで攻撃
  activeChars.sort((a, b) => b.card.ap - a.card.ap);
  const attacker = activeChars[0];

  // 相手のキャラがいれば狙う（APが低い相手を優先）
  if (opponent.field.length > 0) {
    const targets = [...opponent.field];
    targets.sort((a, b) => a.card.ap - b.card.ap);

    // 勝てる相手を探す
    const winnable = targets.find((t) => attacker.card.ap > t.card.ap);
    if (winnable) {
      return {
        type: ActionType.ATTACK,
        cardId: attacker.card.id,
        targetId: winnable.card.id,
      };
    }
  }

  // 直接攻撃（事件カード）
  return {
    type: ActionType.ATTACK,
    cardId: attacker.card.id,
  };
}
