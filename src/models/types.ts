/**
 * 名探偵コナンTCG - データ型定義
 */

// カードの色
export enum CardColor {
  RED = 'RED',
  BLUE = 'BLUE',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  WHITE = 'WHITE',
  BLACK = 'BLACK',
}

// カードタイプ
export enum CardType {
  PARTNER = 'PARTNER',
  CASE = 'CASE',
  CHARACTER = 'CHARACTER',
  EVENT = 'EVENT',
}

// カードの状態
export enum CardState {
  ACTIVE = 'ACTIVE',
  SLEEP = 'SLEEP',
}

// 事件のフェーズ
export enum CasePhase {
  INCIDENT = 'INCIDENT',      // 事件フェーズ
  RESOLUTION = 'RESOLUTION',  // 解決フェーズ
}

// 基本カード情報
export interface BaseCard {
  id: string;
  name: string;
  type: CardType;
  color: CardColor;
}

// パートナーカード
export interface PartnerCard extends BaseCard {
  type: CardType.PARTNER;
  ability: string;  // 能力テキスト
}

// 事件カード
export interface CaseCard extends BaseCard {
  type: CardType.CASE;
  requiredEvidence: number;  // 必要証拠数
  description: string;
}

// キャラクターカード
export interface CharacterCard extends BaseCard {
  type: CardType.CHARACTER;
  level: number;  // プレイに必要なFILE枚数
  ap: number;     // アクションポイント（攻撃力/防御力）
  lp: number;     // ロジックポイント（推理力）
  ability?: string;  // 特殊能力（オプション）
}

// イベントカード
export interface EventCard extends BaseCard {
  type: CardType.EVENT;
  level: number;
  effect: string;  // 効果テキスト
  isCutIn?: boolean;  // カットインカードかどうか
}

// すべてのカード型の統合型
export type Card = PartnerCard | CaseCard | CharacterCard | EventCard;

// 場のキャラクター（状態を持つ）
export interface FieldCharacter {
  card: CharacterCard;
  state: CardState;
  temporaryAP: number;  // 一時的なAP修正値
  temporaryLP: number;  // 一時的なLP修正値
}

// プレイヤーのゲーム状態
export interface PlayerState {
  id: string;
  name: string;
  partner: PartnerCard;
  partnerState: CardState;
  caseCard: CaseCard;
  casePhase: CasePhase;

  // エリア
  deck: Card[];
  hand: Card[];
  field: FieldCharacter[];
  fileArea: Card[];      // 裏向きのFILEエリア
  evidenceArea: Card[];  // 裏向きの証拠エリア
  discardPile: Card[];

  // ステータス
  isFirstPlayer: boolean;  // 先攻フラグ
}

// ターンフェーズ
export enum TurnPhase {
  AUTO = 'AUTO',
  MAIN = 'MAIN',
  END = 'END',
}

// ゲーム全体の状態
export interface GameState {
  player1: PlayerState;
  player2: PlayerState;
  currentPlayer: 'player1' | 'player2';
  turnNumber: number;
  phase: TurnPhase;
  winner: 'player1' | 'player2' | null;
}

// アクションの種類
export enum ActionType {
  PLAY_CHARACTER = 'PLAY_CHARACTER',
  PLAY_EVENT = 'PLAY_EVENT',
  REASONING = 'REASONING',
  ATTACK = 'ATTACK',
  PARTNER_ASSIST = 'PARTNER_ASSIST',
  CASE_RESOLUTION = 'CASE_RESOLUTION',
  NEXT_HINT = 'NEXT_HINT',
  END_TURN = 'END_TURN',
}

// プレイヤーのアクション
export interface PlayerAction {
  type: ActionType;
  cardId?: string;      // 使用するカードのID
  targetId?: string;    // ターゲットのID（攻撃対象など）
}

// アクション結果
export interface ActionResult {
  success: boolean;
  message: string;
  gameState?: GameState;
}
