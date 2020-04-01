class KeyBoard {
  constructor() {
    this.lang = 'ru';
    this.capsLock = false;

    this.keyBoard = document.createElement('div');
    this.textArea = document.createElement('textarea');
    this.pageLangBtn = document.createElement('button');
  }

  init() {
    if (localStorage.getItem('lang') === null) {
      localStorage.setItem('lang', this.lang);
    } else this.lang = localStorage.getItem('lang');
  }
}

const KEYBOARD = new KeyBoard();
KEYBOARD.init();