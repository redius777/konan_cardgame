/**
 * 名探偵コナンTCG - コンソールUI
 */

import * as readline from 'readline';
import {
  GameState,
  PlayerState,
  CardType,
  CardState,
  CasePhase,
  CharacterCard,
  EventCard,
} from '../models/types';

/**
 * ゲーム状態を表示
 */
export function displayGameState(gameState: GameState): void {
  console.clear();
  console.log('='.repeat(80));
  console.log('名探偵コナン トレーディングカードゲーム'.padStart(50));
  console.log('='.repeat(80));
  console.log();

  const currentPlayer = gameState[gameState.currentPlayer];
  const opponent = gameState[gameState.currentPlayer === 'player1' ? 'player2' : 'player1'];

  // 相手の情報（簡略表示）
  console.log(`【相手: ${opponent.name}】`);
  console.log(`  パートナー: ${opponent.partner.name} [${opponent.partnerState}]`);
  console.log(`  事件: ${opponent.caseCard.name} [${opponent.casePhase}]`);
  console.log(`  FILE: ${opponent.fileArea.length}枚 | 証拠: ${opponent.evidenceArea.length}枚 | 手札: ${opponent.hand.length}枚`);
  console.log(`  場のキャラクター (${opponent.field.length}体):`);
  opponent.field.forEach((fc, i) => {
    const state = fc.state === CardState.ACTIVE ? '縦' : '横';
    console.log(`    ${i + 1}. ${fc.card.name} [Lv${fc.card.level}] AP:${fc.card.ap} LP:${fc.card.lp} [${state}]`);
  });
  console.log();

  console.log('-'.repeat(80));
  console.log();

  // 自分の情報（詳細表示）
  console.log(`【あなた: ${currentPlayer.name}】`);
  console.log(`  ターン: ${gameState.turnNumber} | フェーズ: ${gameState.phase}`);
  console.log(`  パートナー: ${currentPlayer.partner.name} [${currentPlayer.partnerState}]`);
  console.log(`  事件: ${currentPlayer.caseCard.name} [${currentPlayer.casePhase}]`);
  const requiredEvidence = currentPlayer.isFirstPlayer ? 7 : 6;
  console.log(`  FILE: ${currentPlayer.fileArea.length}枚 | 証拠: ${currentPlayer.evidenceArea.length}/${requiredEvidence}枚 | デッキ: ${currentPlayer.deck.length}枚`);
  console.log();

  console.log(`  場のキャラクター (${currentPlayer.field.length}体):`);
  if (currentPlayer.field.length === 0) {
    console.log('    (なし)');
  } else {
    currentPlayer.field.forEach((fc, i) => {
      const state = fc.state === CardState.ACTIVE ? '縦' : '横';
      console.log(`    ${i + 1}. ${fc.card.name} [Lv${fc.card.level}] AP:${fc.card.ap} LP:${fc.card.lp} [${state}]`);
    });
  }
  console.log();

  console.log(`  手札 (${currentPlayer.hand.length}枚):`);
  if (currentPlayer.hand.length === 0) {
    console.log('    (なし)');
  } else {
    currentPlayer.hand.forEach((card, i) => {
      if (card.type === CardType.CHARACTER) {
        const charCard = card as CharacterCard;
        console.log(`    ${i + 1}. [キャラ] ${charCard.name} Lv${charCard.level} AP:${charCard.ap} LP:${charCard.lp}`);
      } else if (card.type === CardType.EVENT) {
        const eventCard = card as EventCard;
        console.log(`    ${i + 1}. [イベント] ${eventCard.name} Lv${eventCard.level} - ${eventCard.effect}`);
      }
    });
  }
  console.log();
  console.log('='.repeat(80));
}

/**
 * プレイヤー入力を取得
 */
export function getUserInput(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * メニューを表示
 */
export function displayMenu(): void {
  console.log('【アクションを選択してください】');
  console.log('  1. キャラクターをプレイ');
  console.log('  2. イベントをプレイ');
  console.log('  3. 推理を行う');
  console.log('  4. アクション（攻撃）');
  console.log('  5. パートナーのアシスト');
  console.log('  6. 事件解決');
  console.log('  9. ターン終了');
  console.log('  0. ゲーム終了');
  console.log();
}

/**
 * 勝者を表示
 */
export function displayWinner(gameState: GameState): void {
  console.log();
  console.log('='.repeat(80));
  console.log('【ゲーム終了】'.padStart(45));
  console.log('='.repeat(80));
  console.log();

  if (gameState.winner) {
    const winner = gameState[gameState.winner];
    console.log(`勝者: ${winner.name}`.padStart(45));
    console.log();
    console.log(`${winner.name}が事件を解決しました！`.padStart(50));
  } else {
    console.log('引き分け'.padStart(43));
  }

  console.log();
  console.log('='.repeat(80));
}

/**
 * 待機（Enterキー待ち）
 */
export async function waitForEnter(message: string = '続けるにはEnterキーを押してください...'): Promise<void> {
  await getUserInput(message);
}
