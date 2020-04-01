import keys from './keys.js';

class KeyBoard {
  constructor() {
    this.lang = 'ru';
    this.capsLock = false;

    this.keyboard = document.createElement('div');
    this.textArea = document.createElement('textarea');
    this.pageLangBtn = document.createElement('button');
  }

  init() {
    if (localStorage.getItem('lang') === null) {
      localStorage.setItem('lang', this.lang);
    } else this.lang = localStorage.getItem('lang');

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    document.body.append(wrapper);

    this.textArea.classList.add('keyboard__textarea');
    wrapper.append(this.textArea);

    this.pageLangBtn.classList.add('keyboard__langBtn', 'lang');
    this.pageLangBtn.innerHTML = this.lang;
    wrapper.append(this.pageLangBtn);

    this.keyboard.classList.add('keyboard__container');
    wrapper.append(this.keyboard);
  }

  createButtons() {
    keys.forEach((keysRowIndex) => {
      const keysRowContainer = document.createElement('div');
      keysRowContainer.classList.add('row');
      this.keyboard.append(keysRowContainer);

      keysRowIndex.forEach((keyIndex) => {
        const key = document.createElement('button');
        if (keyIndex[0] !== '') key.classList.add('key', `${keyIndex[0]}`);
        else key.classList.add('key');
        keysRowContainer.append(key);
      });
    });
  }
}

const KEYBOARD = new KeyBoard();
KEYBOARD.init();
KEYBOARD.createButtons();
