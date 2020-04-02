import keyboardKeys from './keys.js';

class KeyBoard {
  constructor() {
    this.lang = 'en';
    this.capsLock = false;
    this.isShiftPress = false;

    this.symbol = '';
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

  createKeys() {
    keyboardKeys.forEach((keyboardRowValues) => {
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

  regUp() {
    this.isShiftPress = true;

    document.querySelectorAll('.on').forEach((key) => {
      key.children[0].classList.remove('show');
      key.children[0].classList.add('hide');
      key.children[1].classList.add('show');
      key.children[1].classList.remove('hide');
    });
  }

  regDown() {
    this.isShiftPress = false;

    document.querySelectorAll('.on').forEach((key) => {
      key.children[0].classList.add('show');
      key.children[0].classList.remove('hide');
      key.children[1].classList.remove('show');
      key.children[1].classList.add('hide');
    });
  }

  langChange() {
    (this.lang === 'en') ? this.lang = 'ru' : this.lang = 'en';
    localStorage.setItem('lang', this.lang);

    this.keyboard.querySelectorAll('.key').forEach((key) => {
      if (key.children[0].classList.contains('on')) {
        key.children[0].classList.remove('on');
        key.children[0].classList.add('off');
        key.children[1].classList.remove('off');
        key.children[1].classList.add('on');
      } else {
        key.children[0].classList.remove('off');
        key.children[0].classList.add('on');
        key.children[1].classList.remove('on');
        key.children[1].classList.add('off');
      }
    });
  }

  keyDown(event) {
    if (event.shiftKey) this.regUp();

    if (event.shiftKey && event.altKey) this.langChange();

    this.textArea.focus();
    this.symbol = '';

    keyboardKeys.forEach((keyboardRowValues) => {
      keyboardRowValues.forEach((keyValue) => {
        if (
          keyValue[1] === event.code
          && event.key !== 'Backspace'
          && event.key !== 'Tab'
          && event.key !== 'Delete'
          && event.key !== 'CapsLock'
          && event.key !== 'Control'
          && event.key !== 'Meta'
          && event.key !== 'Enter'
          && event.key !== 'Alt'
          && event.key !== 'Shift'
          && event.key !== 'ArrowRight'
          && event.key !== 'ArrowLeft'
          && event.key !== 'ArrowUp'
          && event.key !== 'ArrowDown'
        ) {
          event.preventDefault();
          const [, , ruLow, ruUp, enLow, enUp] = keyValue;
          switch (this.lang) {
            case 'en':
              (this.isShiftPress) ? this.symbol = enUp : this.symbol = enLow;
              break;
            case 'ru':
              (this.isShiftPress) ? this.symbol = ruUp : this.symbol = ruLow;
              break;
            default:
              break;
          }
        }
      });
    });

    this.textArea.setRangeText(
      this.symbol,
      this.textArea.selectionStart,
      this.textArea.selectionEnd,
      'end',
    );

    this.keyboard.querySelectorAll('.row').forEach((row) => {
      row.querySelectorAll('.key').forEach((key) => {
        if (event.code === key.children[0].classList[0]) {
          if (event.key === 'CapsLock') {
            if (this.capsLock) {
              this.capsLock = false;
              key.classList.remove('active');
              this.regDown();
              this.isShiftPress = false;
            } else {
              this.capsLock = true;
              key.classList.add('active');
              this.regUp();
              this.isShiftPress = true;
            }
          } else {
            key.classList.add('active');
          }
        }
      });
    });
  }

  keyUp(event) {
    if (event.key === 'Shift') this.regDown();

    this.keyboard.querySelectorAll('.row').forEach((row) => {
      row.querySelectorAll('.key').forEach((key) => {
        if (event.code === key.children[0].classList[0] && event.key !== 'CapsLock') {
          key.classList.remove('active');
        }
      });
    });
  }
}

const KEYBOARD = new KeyBoard();
KEYBOARD.init();
KEYBOARD.createKeys();

document.addEventListener('keydown', (event) => {
  KEYBOARD.keyDown(event);
});
document.addEventListener('keyup', (event) => {
  KEYBOARD.keyUp(event);
});
