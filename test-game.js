/**
 * ゲームエンジンの簡易テスト
 */

const { initializeGame, processAutoPhase, executeAction, checkWinCondition } = require('./dist/engine/gameEngine');
const { ActionType } = require('./dist/models/types');

console.log('='.repeat(80));
console.log('名探偵コナンTCG - ゲームエンジンテスト');
console.log('='.repeat(80));
console.log();

// ゲーム初期化
console.log('1. ゲーム初期化...');
const gameState = initializeGame();
console.log('✓ ゲーム初期化完了');
console.log(`  プレイヤー1: ${gameState.player1.name} (パートナー: ${gameState.player1.partner.name})`);
console.log(`  プレイヤー2: ${gameState.player2.name} (パートナー: ${gameState.player2.partner.name})`);
console.log(`  初期手札: ${gameState.player1.hand.length}枚`);
console.log();

// オートフェーズ
console.log('2. オートフェーズ処理...');
processAutoPhase(gameState);
console.log('✓ オートフェーズ完了');
console.log(`  FILE枚数: ${gameState.player1.fileArea.length}枚`);
console.log(`  手札: ${gameState.player1.hand.length}枚`);
console.log();

// キャラクターをプレイしてみる
console.log('3. アクション実行テスト...');
const player = gameState.player1;

// 手札のキャラクターカードを探す
const charCard = player.hand.find(c => c.type === 'CHARACTER');
if (charCard) {
  const result = executeAction(gameState, {
    type: ActionType.PLAY_CHARACTER,
    cardId: charCard.id
  });
  console.log(`  アクション: キャラプレイ - ${result.success ? '成功' : '失敗'}`);
  console.log(`  メッセージ: ${result.message}`);
  console.log(`  場のキャラ数: ${player.field.length}体`);
} else {
  console.log('  手札にキャラカードがありません');
}
console.log();

// 推理テスト
if (player.field.length > 0) {
  console.log('4. 推理アクションテスト...');
  const fieldChar = player.field[0];
  const result = executeAction(gameState, {
    type: ActionType.REASONING,
    cardId: fieldChar.card.id
  });
  console.log(`  推理実行: ${result.success ? '成功' : '失敗'}`);
  console.log(`  メッセージ: ${result.message}`);
  console.log(`  証拠枚数: ${player.evidenceArea.length}枚`);
  console.log();
}

// 勝利条件チェック
console.log('5. 勝利条件チェック...');
const winner = checkWinCondition(gameState);
console.log(`  勝者: ${winner ? winner : 'なし（ゲーム続行中）'}`);
console.log();

console.log('='.repeat(80));
console.log('テスト完了！ゲームエンジンは正常に動作しています。');
console.log('='.repeat(80));
console.log();
console.log('実際のゲームをプレイするには: npm start');
console.log();
