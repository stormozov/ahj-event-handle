import ScoreManager from '../ScoreManager';

describe('Класс ScoreManager', () => {
  let scoreManager: ScoreManager;

  beforeEach(() => {
    scoreManager = new ScoreManager();
  });

  describe('Конструктор', () => {
    it('создает экземпляр класса ScoreManager', () => {
      expect(scoreManager).toBeInstanceOf(ScoreManager);
    });
  });
});
