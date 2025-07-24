import BoardManagerError from '../Errors/BoardManagerError';
import ScoreManager from './ScoreManager';
import { IBoardManager } from './types/interface';

/**
 * Менеджер игрового поля
 *
 * Создает игровое поле и перемещает персонажа по нему
 */
export default class BoardManager implements IBoardManager {
  private _board: HTMLElement | null;
  private _boardSize: number;
  private _boardCells: NodeListOf<HTMLElement>;
  private _currentPosition: number | null = null;
  private _boardSelector: string;
  private _scoreManager: ScoreManager;

  constructor(
    boardSize: number = 4,
    boardSelector: string,
    scoreManager: ScoreManager
  ) {
    this._board = document.querySelector(boardSelector);
    this._boardSelector = boardSelector;
    this._scoreManager = scoreManager;

    this._boardSize = boardSize ** 2;
    // Инициализация заглушкой, будет перезаписана в drawBoard
    this._boardCells = [] as unknown as NodeListOf<HTMLElement>;
  }

  /**
   * Возвращает размер игрового поля
   *
   * @returns {number} Размер игрового поля
   */
  get boardSize(): number {
    return this._boardSize;
  }

  /**
   * Отрисовывает игровое поле
   */
  public drawBoard(): void {
    if (!this._board) {
      throw new BoardManagerError(
        `Элемент с селектором "${this._boardSelector}" не найден в DOM`
      );
    }

    const boardSize = this.boardSize;

    for (let i = 0; i < boardSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      this._board.appendChild(cell);
    }

    this._boardCells = this._board.querySelectorAll<HTMLElement>('.cell');
    const startPosition = this._getRandomPosition();
    this._addPersonToCell(startPosition);
    this._currentPosition = startPosition;
  }

  /**
   * Перемещает персонажа по ячейкам поля с заданным интервалом
   *
   * @param {number} interval - интервал в миллисекундах
   */
  public movingPersonThroughTheCells(interval: number): void {
    setInterval(() => {
      if (this._currentPosition !== null) {
        const currentCell = this._boardCells[this._currentPosition];
        const person = currentCell.querySelector('.person');
        if (person) person.remove();
      }

      const newPosition = this._getRandomPosition();
      this._addPersonToCell(newPosition);
      this._currentPosition = newPosition;
    }, interval);
  }

  /**
   * Инициализирует обработчики событий
   */
  public initEvents(): void {
    this._boardClickHandler();
  }

  /**
   * Возвращает случайную позицию
   *
   * @returns {number} Случайная позиция
   *
   * @private
   */
  private _getRandomPosition(): number {
    return Math.floor(Math.random() * this.boardSize);
  }

  /**
   * Добавляет персонажа в указанную ячейку
   *
   * @param {number} position - индекс ячейки
   *
   * @private
   */
  private _addPersonToCell(position: number): void {
    const person = document.createElement('div');
    person.classList.add('person');

    const targetCell = this._boardCells[position];
    if (targetCell) {
      targetCell.appendChild(person);
    } else {
      console.warn(`Ячейка с индексом ${position} не найдена.`);
    }
  }

  /**
   * Обрабатывает клик по игровому полю
   *
   * @private
   */
  private _boardClickHandler(): void {
    this._board?.addEventListener('click', (e) => {
      const targetCell = e.target as HTMLElement;
      if (targetCell.classList.contains('person')) {
        this._scoreManager.score += 1;
        targetCell.remove();
      }
    });
  }
}
