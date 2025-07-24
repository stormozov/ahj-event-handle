import BoardManager from './BoardManager';
import ScopeManager from './ScoreManager';
import { IGoblinGame } from './types/interface';

/**
 * Класс игры "Гоблин"
 */
export default class GoblinGame implements IGoblinGame {
  private _scopeManager: ScopeManager;
  private _boardManager: BoardManager;
  private _personMovingInterval: number;
  private _boardSelector: string;

  constructor(boardSelector: string = '.board') {
    this._boardSelector = boardSelector;
    this._scopeManager = new ScopeManager();
    this._boardManager = new BoardManager(
      4,
      this._boardSelector,
      this._scopeManager
    );
    this._personMovingInterval = 1000;
  }

  /**
   * Инициализация игры
   */
  init(): void {
    // Инициализация игрового поля
    this._boardManager.drawBoard();
    this._boardManager.movingPersonThroughTheCells(this._personMovingInterval);
    this._boardManager.initEvents();

    // Инициализация менеджера баллов
    this._scopeManager.createScoreDisplay(this._boardSelector);
  }
}
