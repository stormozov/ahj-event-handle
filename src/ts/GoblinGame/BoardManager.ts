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
  private _boardCells: NodeListOf<HTMLElement> | null;
  private _currentPosition: number | null = null;
  private _scoreManager: ScoreManager;
  private _missedGoblinCount: number = 0;
  private _goblinClicked: boolean = false;
  private _moveIntervalId: number | null = null;

  constructor(
    boardSize: number = 4,
    boardSelector: string,
    scoreManager: ScoreManager
  ) {
    this._board = document.querySelector(boardSelector);
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
    const boardSize = this.boardSize;

    for (let i = 0; i < boardSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      this._board?.appendChild(cell);
    }

    this._boardCells =
      this._board?.querySelectorAll<HTMLElement>('.cell') || null;

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
    if (this._moveIntervalId !== null) return;
    this._moveIntervalId = window.setInterval(() => {
      // Проверяем, был ли гоблин пойман с момента последнего перемещения
      if (!this._goblinClicked) {
        this._incrementMissedCount();
      } else {
        // Сбрасываем флаг после успешного клика
        this._goblinClicked = false;
      }

      // Если достигнуто 5 промахов — завершаем игру
      if (this._missedGoblinCount >= 5) {
        this._endGame();
        return;
      }

      // Удаляем персонажа с текущей позиции
      this._removePersonFromCurrentCell();

      // Перемещаем персонажа на новую случайную позицию
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

    if (this._boardCells === null) return;

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
    if (!this._board) return;

    // Удаляем старый обработчик, чтобы избежать дублирования
    this._board.removeEventListener('click', this._handleBoardClick);
    this._board.addEventListener('click', this._handleBoardClick);
  }

  /**
   * Внешний обработчик клика (привязан к экземпляру)
   *
   * @private
   */
  private _handleBoardClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;

    if (target.classList.contains('person')) {
      this._onGoblinHit(target);
    } else if (target.classList.contains('cell')) {
      this._onEmptyCellClick();
    }
  };

  /**
   * Вызывается при попадании по гоблину
   *
   * @private
   */
  private _onGoblinHit(personElement: HTMLElement): void {
    this._scoreManager.score += 1;
    personElement.remove();
    this._goblinClicked = true;
  }

  /**
   * Вызывается при клике по пустой ячейке
   *
   * @private
   */
  private _onEmptyCellClick(): void {
    this._missedGoblinCount++;
    if (this._missedGoblinCount >= 5) this._endGame();
  }

  /**
   * Увеличивает счётчик промахов и проверяет, нужно ли завершить игру
   *
   * @private
   */
  private _incrementMissedCount(): void {
    this._missedGoblinCount++;
  }

  /**
   * Удаляет персонажа с текущей ячейки
   *
   * @private
   */
  private _removePersonFromCurrentCell(): void {
    if (this._currentPosition === null || this._boardCells === null) return;

    const currentCell = this._boardCells[this._currentPosition];
    const person = currentCell.querySelector('.person');

    if (person) person.remove();
  }

  /**
   * Завершает игру: отправляет событие и останавливает движение гоблинов
   *
   * @private
   */
  private _endGame(): void {
    if (this._board) {
      const event = new CustomEvent('gameOver', {
        detail: { missedCount: this._missedGoblinCount },
      });
      this._board.dispatchEvent(event);
    }

    if (this._moveIntervalId !== null) {
      clearInterval(this._moveIntervalId);
      this._moveIntervalId = null;
    }
  }
}
