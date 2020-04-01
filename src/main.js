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

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    document.body.append(wrapper);

    this.textArea.classList.add('keyboard__textarea');
    wrapper.append(this.textArea);

    this.pageLangBtn.classList.add('keyboard__langBtn', 'lang');
    this.pageLangBtn.innerHTML = this.lang;
    wrapper.append(this.pageLangBtn);

    this.keyBoard.classList.add('keyboard__container');
    wrapper.append(this.keyBoard);
  }
}

const KEYBOARD = new KeyBoard();
KEYBOARD.init();
