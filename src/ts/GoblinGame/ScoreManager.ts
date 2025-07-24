import { IScoreManager } from './types/interface';

/**
 * Класс для работы с баллами
 */
export default class ScoreManager implements IScoreManager {
  private _score: number = 0;
  private _scoreDisplayElement: HTMLElement | null = null;

  constructor() {
    this._loadScore();
  }

  /**
   * Возвращает текущее количество баллов
   */
  public get score(): number {
    return this._score;
  }

  /**
   * Устанавливает количество баллов
   *
   * @param {number} value - количество баллов
   */
  public set score(value: number) {
    this._score = value;
    this._saveScore();
    this._updateScoreDisplay();
  }

  /**
   * Создает элемент для отображения баллов
   *
   * @param {string} boardSelector - селектор игрового поля
   */
  public createScoreDisplay(boardSelector: string): void {
    const scoreDisplayElement = document.createElement('div');
    const scoreDisplayText = document.createElement('p');

    scoreDisplayElement.classList.add('score-display');
    scoreDisplayText.classList.add('score-display__text');
    scoreDisplayElement.append(scoreDisplayText);

    this._scoreDisplayElement = scoreDisplayElement;

    const container = document.querySelector(boardSelector)?.parentElement;
    if (container) container.append(this._scoreDisplayElement);

    this._updateScoreDisplay();
  }

  /**
   * Сохраняет текущее количество баллов в localStorage
   *
   * @private
   */
  private _saveScore(): void {
    try {
      localStorage.setItem('goblinGameScore', this._score.toString());
    } catch (e) {
      console.warn('Unable to save score to localStorage', e);
    }
  }

  /**
   * Загружает текущее количество баллов из localStorage
   *
   * @private
   */
  private _loadScore(): void {
    try {
      const savedScore = localStorage.getItem('goblinGameScore');
      if (savedScore !== null) this._score = parseInt(savedScore, 10) || 0;
    } catch (e) {
      console.warn('Unable to load score from localStorage', e);
    }
  }

  /**
   * Обновляет отображение баллов
   *
   * @private
   */
  private _updateScoreDisplay(): void {
    if (this._scoreDisplayElement) {
      const scoreElement = this._scoreDisplayElement.querySelector('p');
      if (scoreElement) scoreElement.textContent = `Баллы: ${this._score}`;
    }
  }
}
