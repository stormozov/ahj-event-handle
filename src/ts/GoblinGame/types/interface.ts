/**
 * Интерфейс для класса GoblinGame
 *
 * @interface
 */
export interface IGoblinGame {
  init: () => void;
}

/**
 * Интерфейс для класса BoardManager
 */
export interface IBoardManager {
  drawBoard: () => void;
  movingPersonThroughTheCells: (interval: number) => void;
  initEvents: () => void;

  get boardSize(): number;
}

/**
 * Интерфейс для класса ScoreManager
 */
export interface IScoreManager {
  createScoreDisplay: (boardSelector: string) => void;

  get score(): number;
  set score(value: number);
}
