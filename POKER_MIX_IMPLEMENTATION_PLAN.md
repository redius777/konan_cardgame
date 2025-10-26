# ポーカーミックスゲームアプリ 実装計画書

## 1. 技術スタック

### フロントエンド
- **言語**: TypeScript
- **フレームワーク**: Vanilla TypeScript（既存プロジェクトとの整合性）
- **UI**: HTML5 + CSS3
- **ストレージ**: LocalStorage
- **ビルドツール**: TypeScript Compiler (tsc)

### 開発環境
- Node.js 16以上
- npm
- TypeScript 4.x以上

## 2. プロジェクト構造

```
poker-mix-app/
├── src/
│   ├── models/
│   │   ├── poker-types.ts          # ポーカー関連の型定義
│   │   ├── game-definition.ts      # ゲーム定義の型
│   │   ├── mix-game.ts              # ミックスゲームの型
│   │   └── player.ts                # プレイヤーの型
│   │
│   ├── engines/
│   │   ├── base-engine.ts           # ベースゲームエンジン
│   │   ├── holdem-engine.ts         # ホールデム系エンジン
│   │   ├── stud-engine.ts           # スタッド系エンジン
│   │   ├── draw-engine.ts           # ドロー系エンジン
│   │   └── hand-evaluator.ts       # ハンド評価ロジック
│   │
│   ├── data/
│   │   ├── preset-games.ts          # プリセットゲーム定義
│   │   └── card-deck.ts             # デッキ管理
│   │
│   ├── storage/
│   │   ├── game-storage.ts          # ゲームデータ保存
│   │   ├── history-storage.ts       # プレイ履歴保存
│   │   └── settings-storage.ts      # 設定保存
│   │
│   ├── ui/
│   │   ├── game-selector.ts         # ゲーム選択UI
│   │   ├── game-creator.ts          # ゲーム作成UI
│   │   ├── game-player.ts           # ゲームプレイUI
│   │   ├── library.ts               # ライブラリUI
│   │   └── components/              # UIコンポーネント
│   │       ├── card.ts
│   │       ├── player-view.ts
│   │       └── betting-panel.ts
│   │
│   └── index.ts                     # エントリーポイント
│
├── public/
│   ├── index.html                   # メイン画面
│   ├── game-selector.html           # ゲーム選択画面
│   ├── game-creator.html            # ゲーム作成画面
│   ├── game-player.html             # プレイ画面
│   ├── library.html                 # ライブラリ画面
│   └── styles/
│       ├── main.css
│       ├── game-selector.css
│       └── game-player.css
│
├── dist/                            # ビルド出力
├── package.json
├── tsconfig.json
└── README.md
```

## 3. 実装フェーズ

### Phase 1: MVP（基本機能）- 推定 2-3週間

#### Week 1: コア機能実装
**タスク1: プロジェクト構造とデータモデル**
- [ ] プロジェクトのディレクトリ構造を作成
- [ ] TypeScript設定（tsconfig.json）
- [ ] 基本的な型定義（poker-types.ts）
- [ ] ゲーム定義の型（game-definition.ts）
- [ ] カードとデッキの実装（card-deck.ts）

**タスク2: ハンド評価システム**
- [ ] ハンドランキング評価ロジック
  - ハイハンド（ロイヤルフラッシュ〜ハイカード）
  - ローハンド（A-5、2-7）
  - Badugiハンド評価
- [ ] ハンド比較ロジック
- [ ] ユニットテスト作成

#### Week 2: ゲームエンジン実装
**タスク3: ベースゲームエンジン**
- [ ] 抽象ベースクラス（base-engine.ts）
  - ゲーム初期化
  - ベッティングラウンド管理
  - ポット計算
  - プレイヤー管理

**タスク4: ホールデム系エンジン**
- [ ] テキサスホールデムのロジック
  - ホールカード配布
  - フロップ・ターン・リバー
  - ベッティングラウンド
- [ ] オマハのロジック
  - 4枚のホールカード
  - 必ず2枚使用のルール

**タスク5: スタッド系エンジン**
- [ ] セブンカードスタッドのロジック
  - アップカード・ダウンカード管理
  - ストリートごとのベッティング
  - ブリングイン処理

**タスク6: ドロー系エンジン**
- [ ] ファイブカードドローのロジック
  - ドローアクション
  - カード交換
- [ ] Badugiのロジック
  - 3回のドローラウンド
  - 4枚使用の特殊ルール

#### Week 3: UI実装とプリセットゲーム
**タスク7: プリセットゲーム定義**
- [ ] 最低5種類のゲーム定義を作成
  1. Texas Hold'em (No Limit)
  2. Pot Limit Omaha
  3. Seven Card Stud
  4. Five Card Draw
  5. Badugi

**タスク8: 基本UI実装**
- [ ] メイン画面（index.html）
- [ ] ゲーム選択画面
  - カテゴリ別表示
  - ゲームカード表示
  - ゲーム説明モーダル
- [ ] 基本的なプレイ画面
  - カード表示
  - プレイヤー表示
  - ベッティングパネル
  - アクションボタン

**タスク9: ゲームフロー統合**
- [ ] ゲーム選択からプレイまでのフロー
- [ ] ゲーム状態管理
- [ ] ベーシックなAI（シンプルな判断ロジック）

### Phase 2: カスタム機能 - 推定 1-2週間

#### Week 4: カスタムゲーム作成
**タスク10: ゲーム作成UI**
- [ ] ステップバイステップのウィザード
  - Step 1: ゲームタイプ選択
  - Step 2: 基本パラメータ設定
  - Step 3: ベッティング設定
  - Step 4: 特殊ルール設定
  - Step 5: プレビュー＆保存

**タスク11: バリデーション**
- [ ] ルールの妥当性チェック
- [ ] パラメータの整合性確認
- [ ] エラーメッセージ表示

**タスク12: ストレージ実装**
- [ ] LocalStorageへの保存
  - カスタムゲーム保存
  - お気に入り管理
- [ ] データのロード
- [ ] データのエクスポート/インポート（JSON）

#### Week 5: ゲームライブラリ
**タスク13: ライブラリUI**
- [ ] ゲーム一覧表示
  - プリセットゲーム
  - カスタムゲーム
  - お気に入り
- [ ] フィルタリング機能
  - タイプ別
  - ベットリミット別
  - プレイヤー数別
- [ ] 検索機能
- [ ] ソート機能

**タスク14: ゲーム管理**
- [ ] カスタムゲームの編集
- [ ] カスタムゲームの削除
- [ ] お気に入り登録/解除
- [ ] ゲームの複製

### Phase 3: ミックスゲーム - 推定 1週間

#### Week 6: ミックスゲーム機能
**タスク15: ミックスゲームデータモデル**
- [ ] ミックスゲーム型定義（mix-game.ts）
- [ ] ローテーション管理ロジック

**タスク16: ミックスゲーム作成UI**
- [ ] ゲーム選択インターフェース
  - ドラッグ&ドロップ
  - 順序変更
- [ ] ローテーション設定
  - ハンド数設定
  - シーケンシャル/ランダム
- [ ] ミックスゲームの保存

**タスク17: ミックスゲームプレイ**
- [ ] ゲーム切り替えロジック
- [ ] 進行状況表示
- [ ] 現在のゲーム表示

**タスク18: 履歴と統計**
- [ ] プレイ履歴の記録
- [ ] 統計情報の計算
  - ゲーム別プレイ回数
  - 勝率
  - お気に入り率
- [ ] 履歴表示UI

### Phase 4: 拡張機能（オプション） - 推定 2週間以上

**タスク19: UI/UX改善**
- [ ] アニメーション追加
- [ ] サウンド効果
- [ ] レスポンシブデザイン改善
- [ ] ダークモード

**タスク20: 追加ゲーム**
- [ ] 10種類以上のプリセットゲーム追加
- [ ] レアなバリエーション対応

**タスク21: チュートリアル**
- [ ] ゲームルール説明
- [ ] インタラクティブチュートリアル
- [ ] ヘルプドキュメント

**タスク22: マルチプレイヤー（将来）**
- [ ] WebSocket実装
- [ ] バックエンドAPI
- [ ] ユーザー認証
- [ ] ゲーム共有機能

## 4. 実装の優先順位とマイルストーン

### マイルストーン 1: MVP完成（Week 1-3）
**目標**: 基本的な3タイプのゲームがプレイ可能
- ✅ 5種類のプリセットゲームがプレイできる
- ✅ ゲーム選択UIが動作する
- ✅ 基本的なプレイ画面で遊べる
- ✅ ハンド評価が正しく動作する

**デモ可能な機能**:
- テキサスホールデムをプレイ
- オマハをプレイ
- ドロー系ゲームをプレイ

### マイルストーン 2: カスタム機能完成（Week 4-5）
**目標**: ユーザーが独自ゲームを作成できる
- ✅ ゲーム作成ウィザードが完成
- ✅ カスタムゲームが保存・ロードできる
- ✅ ゲームライブラリが動作する
- ✅ フィルタリング・検索が使える

**デモ可能な機能**:
- カスタムゲームを作成
- ライブラリから選択してプレイ
- お気に入り管理

### マイルストーン 3: ミックスゲーム完成（Week 6）
**目標**: 複数ゲームを組み合わせて遊べる
- ✅ ミックスゲームが作成できる
- ✅ ローテーションが正しく動作する
- ✅ 履歴が記録される
- ✅ 統計情報が表示される

**デモ可能な機能**:
- H.O.R.S.E.をプレイ
- カスタムミックスゲームを作成
- プレイ履歴を確認

## 5. 各タスクの詳細仕様

### タスク1: データモデル（poker-types.ts）

```typescript
// カード
enum Suit {
  Hearts = 'H',
  Diamonds = 'D',
  Clubs = 'C',
  Spades = 'S'
}

enum Rank {
  Two = '2', Three = '3', Four = '4', Five = '5',
  Six = '6', Seven = '7', Eight = '8', Nine = '9',
  Ten = 'T', Jack = 'J', Queen = 'Q', King = 'K', Ace = 'A'
}

interface Card {
  suit: Suit;
  rank: Rank;
}

// ゲームタイプ
type GameType = 'holdem' | 'stud' | 'draw';

// ベットリミット
type LimitType = 'no-limit' | 'pot-limit' | 'limit' | 'fixed-limit';

// ハンド評価タイプ
type HandRankingType = 'high' | 'low-ace-five' | 'low-deuce-seven' | 'badugi';

// ゲーム定義
interface GameDefinition {
  id: string;
  name: string;
  type: GameType;
  description: string;
  rules: GameRules;
  isCustom: boolean;
  isFavorite: boolean;
  createdAt: Date;
  playCount: number;
  tags?: string[];
}

interface GameRules {
  // 基本設定
  players: { min: number; max: number };
  holeCards: number;                    // プレイヤーの手札枚数

  // ホールデム系
  boardCards?: number[];                // [3, 1, 1] = フロップ、ターン、リバー

  // スタッド系
  upCards?: number[];                   // 公開カード
  downCards?: number[];                 // 非公開カード
  bringIn?: boolean;                    // ブリングイン有無

  // ドロー系
  drawRounds?: number;                  // ドロー回数
  cardsPerDraw?: number[];              // 各ドローで交換可能な枚数

  // ベッティング
  bettingRounds: number;
  limitType: LimitType;
  blinds?: { small: number; big: number };
  ante?: number;

  // ハンド評価
  handRanking: HandRankingType;
  handSize?: number;                    // 最終ハンドのカード枚数

  // 特殊ルール
  mustUseHoleCards?: number;            // 必須使用枚数（オマハなど）
  specialRules?: Record<string, any>;
}
```

### タスク2: ハンド評価（hand-evaluator.ts）

```typescript
enum HandRank {
  RoyalFlush = 10,
  StraightFlush = 9,
  FourOfAKind = 8,
  FullHouse = 7,
  Flush = 6,
  Straight = 5,
  ThreeOfAKind = 4,
  TwoPair = 3,
  OnePair = 2,
  HighCard = 1
}

interface HandResult {
  rank: HandRank;
  cards: Card[];
  description: string;
  value: number;  // 比較用の数値
}

class HandEvaluator {
  evaluateHigh(cards: Card[]): HandResult;
  evaluateLowAceFive(cards: Card[]): HandResult | null;
  evaluateLowDeuceSeven(cards: Card[]): HandResult | null;
  evaluateBadugi(cards: Card[]): HandResult;
  compareHands(hand1: HandResult, hand2: HandResult): number;
}
```

### タスク3: ベースゲームエンジン（base-engine.ts）

```typescript
abstract class BasePokerEngine {
  protected gameDefinition: GameDefinition;
  protected players: Player[];
  protected deck: Card[];
  protected pot: number;
  protected currentBet: number;
  protected currentPlayerIndex: number;

  abstract dealInitialCards(): void;
  abstract executeBettingRound(): void;
  abstract determineWinner(): Player;

  // 共通メソッド
  initializeGame(players: Player[]): void;
  shuffleDeck(): void;
  dealCard(): Card;
  collectBets(): void;
  distributePot(winner: Player): void;
}
```

## 6. テスト戦略

### ユニットテスト
- [ ] ハンド評価ロジック
- [ ] カード配布ロジック
- [ ] ベッティングラウンド
- [ ] ポット計算

### 統合テスト
- [ ] 各ゲームエンジンの完全なゲームフロー
- [ ] カスタムゲーム作成と実行
- [ ] ミックスゲームのローテーション

### UIテスト
- [ ] ゲーム選択フロー
- [ ] ゲーム作成フロー
- [ ] プレイ画面の操作

## 7. 開発開始手順

### Step 1: 環境準備
```bash
# 新しいブランチ作成
git checkout -b feature/poker-mix-app

# 必要なパッケージをインストール（既存のpackage.jsonに追加）
npm install

# TypeScript設定確認
cat tsconfig.json
```

### Step 2: ディレクトリ構造作成
```bash
mkdir -p src/models src/engines src/data src/storage src/ui/components
mkdir -p public/styles
```

### Step 3: 基本ファイル作成
1. `src/models/poker-types.ts` - 型定義
2. `src/data/card-deck.ts` - カードとデッキ
3. `src/engines/base-engine.ts` - ベースエンジン
4. `public/index.html` - メイン画面

### Step 4: 最初のゲーム実装（テキサスホールデム）
1. `src/engines/holdem-engine.ts` - ホールデムエンジン
2. `src/data/preset-games.ts` - プリセット定義
3. `src/ui/game-player.ts` - プレイUI
4. テストプレイ

## 8. リスクと対策

### 技術的リスク
**リスク**: ハンド評価の複雑さ
- **対策**: 段階的に実装、各ハンドタイプごとにテスト

**リスク**: ゲームエンジンの汎用性
- **対策**: ベースクラスの設計を慎重に、リファクタリングを恐れない

**リスク**: UI/UXの複雑さ
- **対策**: Phase 1は最小限のUI、段階的に改善

### スコープリスク
**リスク**: 機能が多すぎる
- **対策**: MVPに集中、Phase 2以降は必要に応じて実装

## 9. 次のアクション

1. **即座に開始**: プロジェクト構造とデータモデル作成
2. **Week 1の目標**: ハンド評価とベースエンジン完成
3. **Week 2の目標**: 3つのゲームエンジン実装
4. **Week 3の目標**: MVP完成、デモ可能な状態

---

**実装開始準備完了！**
次のコマンドで実装を開始します：
1. 実装計画の確認と承認
2. ディレクトリ構造の作成
3. 型定義の実装開始
