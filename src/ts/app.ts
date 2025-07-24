import GoblinGame from './GoblinGame/GoblinGame';

const initGoblinGame = (): void => {
  const goblinGame = new GoblinGame('.board');
  goblinGame.init();
};

document.addEventListener('DOMContentLoaded', () => {
  initGoblinGame();
});
