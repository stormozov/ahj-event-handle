/**
 * Класс ошибок игрового поля
 *
 * @class BoardManagerError
 */
export default class BoardManagerError extends Error {
  /**
   * Создает экземпляр класса BoardManagerError
   *
   * @constructor
   * @param {string} message - Сообщение об ошибке
   */
  constructor(message: string) {
    super(message);
  }
}
