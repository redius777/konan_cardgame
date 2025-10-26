/**
 * 名探偵コナンTCG - メインエントリーポイント
 */

import {
  GameState,
  TurnPhase,
  ActionType,
  PlayerAction,
  CardType,
  CharacterCard,
  EventCard,
} from './models/types';
import {
  initializeGame,
  processAutoPhase,
  executeAction,
  checkWinCondition,
} from './engine/gameEngine';
import { getAIAction } from './ai/simpleAI';
import {
  displayGameState,
  getUserInput,
  displayMenu,
  displayWinner,
  waitForEnter,
} from './ui/consoleUI';

/**
 * メインゲームループ
 */
async function main() {
  console.log('='.repeat(80));
  console.log('名探偵コナン トレーディングカードゲーム'.padStart(50));
  console.log('='.repeat(80));
  console.log();
  console.log('ゲームを開始します...');
  await waitForEnter();

  // ゲーム初期化
  let gameState: GameState = initializeGame();

  // ゲームループ
  while (!gameState.winner) {
    // 勝利条件チェック
    const winner = checkWinCondition(gameState);
    if (winner) {
      gameState.winner = winner;
      break;
    }

    // オートフェーズ処理
    if (gameState.phase === TurnPhase.AUTO) {
      processAutoPhase(gameState);
    }

    // メインフェーズ
    if (gameState.phase === TurnPhase.MAIN) {
      const currentPlayer = gameState[gameState.currentPlayer];

      // AIのターン
      if (currentPlayer.id === 'player2') {
        displayGameState(gameState);
        console.log('AIのターン...');
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // AIが複数のアクションを実行
        let aiActionCount = 0;
        const maxAIActions = 10; // 無限ループ防止

        while (aiActionCount < maxAIActions) {
          const aiAction = getAIAction(gameState);

          if (aiAction.type === ActionType.END_TURN) {
            const result = executeAction(gameState, aiAction);
            console.log(`AI: ${result.message}`);
            break;
          }

          const result = executeAction(gameState, aiAction);
          console.log(`AI: ${result.message}`);

          if (!result.success) {
            // 失敗したらターン終了
            executeAction(gameState, { type: ActionType.END_TURN });
            break;
          }

          if (result.gameState) {
            gameState = result.gameState;
          }

          // 勝利チェック
          if (gameState.winner) {
            break;
          }

          aiActionCount++;
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        await waitForEnter();
        continue;
      }

      // プレイヤーのターン
      displayGameState(gameState);
      displayMenu();

      const input = await getUserInput('選択 > ');
      const choice = parseInt(input);

      if (choice === 0) {
        console.log('ゲームを終了します。');
        process.exit(0);
      }

      let action: PlayerAction | null = null;

      switch (choice) {
        case 1: // キャラクターをプレイ
          action = await handlePlayCharacter(gameState);
          break;

        case 2: // イベントをプレイ
          action = await handlePlayEvent(gameState);
          break;

        case 3: // 推理
          action = await handleReasoning(gameState);
          break;

        case 4: // アクション（攻撃）
          action = await handleAttack(gameState);
          break;

        case 5: // パートナーのアシスト
          action = { type: ActionType.PARTNER_ASSIST };
          break;

        case 6: // 事件解決
          action = { type: ActionType.CASE_RESOLUTION };
          break;

        case 9: // ターン終了
          action = { type: ActionType.END_TURN };
          break;

        default:
          console.log('無効な選択です。');
          await waitForEnter();
          continue;
      }

      if (action) {
        const result = executeAction(gameState, action);
        console.log();
        console.log(`結果: ${result.message}`);

        if (result.gameState) {
          gameState = result.gameState;
        }

        await waitForEnter();
      }
    }
  }

  // ゲーム終了
  displayWinner(gameState);
}

/**
 * キャラクターをプレイする処理
 */
async function handlePlayCharacter(gameState: GameState): Promise<PlayerAction | null> {
  const player = gameState[gameState.currentPlayer];
  const charCards = player.hand.filter((c) => c.type === CardType.CHARACTER);

  if (charCards.length === 0) {
    console.log('手札にキャラクターカードがありません。');
    await waitForEnter();
    return null;
  }

  console.log('どのキャラクターをプレイしますか？');
  charCards.forEach((card, i) => {
    const charCard = card as CharacterCard;
    console.log(`  ${i + 1}. ${charCard.name} [Lv${charCard.level}] AP:${charCard.ap} LP:${charCard.lp}`);
  });

  const input = await getUserInput('選択 (0=キャンセル) > ');
  const choice = parseInt(input);

  if (choice === 0 || choice < 1 || choice > charCards.length) {
    return null;
  }

  return {
    type: ActionType.PLAY_CHARACTER,
    cardId: charCards[choice - 1].id,
  };
}

/**
 * イベントをプレイする処理
 */
async function handlePlayEvent(gameState: GameState): Promise<PlayerAction | null> {
  const player = gameState[gameState.currentPlayer];
  const eventCards = player.hand.filter((c) => c.type === CardType.EVENT);

  if (eventCards.length === 0) {
    console.log('手札にイベントカードがありません。');
    await waitForEnter();
    return null;
  }

  console.log('どのイベントをプレイしますか？');
  eventCards.forEach((card, i) => {
    const eventCard = card as EventCard;
    console.log(`  ${i + 1}. ${eventCard.name} [Lv${eventCard.level}] - ${eventCard.effect}`);
  });

  const input = await getUserInput('選択 (0=キャンセル) > ');
  const choice = parseInt(input);

  if (choice === 0 || choice < 1 || choice > eventCards.length) {
    return null;
  }

  return {
    type: ActionType.PLAY_EVENT,
    cardId: eventCards[choice - 1].id,
  };
}

/**
 * 推理を行う処理
 */
async function handleReasoning(gameState: GameState): Promise<PlayerAction | null> {
  const player = gameState[gameState.currentPlayer];

  console.log('誰で推理を行いますか？');
  console.log(`  0. パートナー: ${player.partner.name} [${player.partnerState}]`);

  player.field.forEach((fc, i) => {
    console.log(`  ${i + 1}. ${fc.card.name} LP:${fc.card.lp} [${fc.state}]`);
  });

  const input = await getUserInput('選択 (-1=キャンセル) > ');
  const choice = parseInt(input);

  if (choice === -1) {
    return null;
  }

  if (choice === 0) {
    return {
      type: ActionType.REASONING,
      cardId: player.partner.id,
    };
  }

  if (choice < 1 || choice > player.field.length) {
    return null;
  }

  return {
    type: ActionType.REASONING,
    cardId: player.field[choice - 1].card.id,
  };
}

/**
 * アクション（攻撃）を行う処理
 */
async function handleAttack(gameState: GameState): Promise<PlayerAction | null> {
  const player = gameState[gameState.currentPlayer];
  const opponent = gameState[gameState.currentPlayer === 'player1' ? 'player2' : 'player1'];

  if (player.field.length === 0) {
    console.log('場にキャラクターがいません。');
    await waitForEnter();
    return null;
  }

  console.log('どのキャラクターで攻撃しますか？');
  player.field.forEach((fc, i) => {
    console.log(`  ${i + 1}. ${fc.card.name} AP:${fc.card.ap} [${fc.state}]`);
  });

  const input = await getUserInput('選択 (0=キャンセル) > ');
  const choice = parseInt(input);

  if (choice === 0 || choice < 1 || choice > player.field.length) {
    return null;
  }

  const attacker = player.field[choice - 1];

  // ターゲット選択
  console.log('攻撃対象を選択してください:');
  console.log('  0. 直接攻撃（事件カード）');

  opponent.field.forEach((fc, i) => {
    console.log(`  ${i + 1}. ${fc.card.name} AP:${fc.card.ap}`);
  });

  const targetInput = await getUserInput('選択 (-1=キャンセル) > ');
  const targetChoice = parseInt(targetInput);

  if (targetChoice === -1) {
    return null;
  }

  if (targetChoice === 0) {
    return {
      type: ActionType.ATTACK,
      cardId: attacker.card.id,
    };
  }

  if (targetChoice < 1 || targetChoice > opponent.field.length) {
    return null;
  }

  return {
    type: ActionType.ATTACK,
    cardId: attacker.card.id,
    targetId: opponent.field[targetChoice - 1].card.id,
  };
}

// ゲーム開始
main().catch((error) => {
  console.error('エラーが発生しました:', error);
  process.exit(1);
});
