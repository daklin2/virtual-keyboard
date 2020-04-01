import keyboardKeys from './keys.js';

class KeyBoard {
  constructor() {
    this.lang = 'en';
    this.capsLock = false;
    this.isShiftPress = false;

    this.keyboard = document.createElement('div');
    this.textArea = document.createElement('textarea');
    this.pageLangBtn = document.createElement('button');
  }

  init() {
    // if (localStorage.getItem('lang') === null) {
    //   localStorage.setItem('lang', this.lang);
    // } else this.lang = localStorage.getItem('lang');

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

  createKeys() {
    keyboardKeys.forEach((keyboardRowValues, i) => {
      const keyboardRowContainer = document.createElement('div');
      keyboardRowContainer.classList.add('row');
      this.keyboard.append(keyboardRowContainer);

      keyboardRowValues.forEach((keyValue) => {
        const status = {
          en: 'on',
          ru: 'off',
        };
        const key = document.createElement('button');
        const spanEn = document.createElement('span');
        const spanEnUp = document.createElement('span');
        const spanEnLow = document.createElement('span');
        const spanRu = document.createElement('span');
        const spanRuUp = document.createElement('span');
        const spanRuLow = document.createElement('span');

        switch (this.lang) {
          case 'en':
            status.en = 'on';
            status.ru = 'off';
            break;
          case 'ru':
            status.en = 'off';
            status.ru = 'on';
            break;
          default:
            break;
        }

        // если не пустая - спец символ, помечаем это
        if (keyValue[0] !== '') key.classList.add('key', `${keyValue[0]}`);
        else key.classList.add('key');

        keyboardRowContainer.append(key);

        spanEn.classList.add(`${keyValue[1]}`, 'en', status.en);
        spanRu.classList.add(`${keyValue[1]}`, 'ru', status.ru);

        key.append(spanEn);
        key.append(spanRu);

        spanRuLow.classList.add('show');
        spanRu.append(spanRuLow);
        spanRuLow.insertAdjacentText('afterbegin', keyValue[2]);

        spanRuUp.classList.add('hide');
        spanRu.append(spanRuUp);
        spanRuUp.insertAdjacentText('afterbegin', keyValue[3]);

        spanEnLow.classList.add('show');
        spanEn.append(spanEnLow);
        spanEnLow.insertAdjacentText('afterbegin', keyValue[4]);

        spanEnUp.classList.add('hide');
        spanEn.append(spanEnUp);
        spanEnUp.insertAdjacentText('afterbegin', keyValue[5]);
      });
    });
  }
}

const KEYBOARD = new KeyBoard();
KEYBOARD.init();
KEYBOARD.createKeys();

