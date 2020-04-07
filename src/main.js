import keyboardKeys from './keyBoardKeys.js';

const ignoreKeys = [
  'Backspace',
  'Delete',
  'CapsLock',
  'Control',
  'Meta',
  'Enter',
  'Alt',
  'Shift',
  'ArrowRight',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
];

class KeyBoard {
  constructor() {
    this.lang = 'en';
    this.isCapsLockPress = false;
    this.isShiftPress = false;

    this.symbol = '';
    this.keyboard = document.createElement('div');
    this.textArea = document.createElement('textarea');
    this.pageLangBtn = document.createElement('button');
  }

  // move our cursor with clicks to arrow
  setCaretPosition(pos) {
    if (this.textArea.setSelectionRange) {
      this.textArea.setSelectionRange(pos, pos);
    }
  }

  // function for check capsLock
  checkCaps() {
    if (this.isCapsLockPress) {
      this.isCapsLockPress = false;
      this.changeRegister();
    } else {
      this.isCapsLockPress = true;
      this.changeRegister();
    }
  }

  // initializing keyboard
  init() {
    if (localStorage.getItem('lang') === null) {
      localStorage.setItem('lang', this.lang);
    } else this.lang = localStorage.getItem('lang');

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    document.body.append(wrapper);

    this.textArea.classList.add('keyboard__textarea');
    this.textArea.innerHTML = 'Tested on macOs';
    wrapper.append(this.textArea);

    this.pageLangBtn.classList.add('keyboard__langBtn', 'lang');
    this.pageLangBtn.innerHTML = this.lang;
    wrapper.append(this.pageLangBtn);

    this.keyboard.classList.add('keyboard__container');
    wrapper.append(this.keyboard);

    this.createKeys();
  }

  // create html structure for keyboard keys
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

        // if !== '' then it's special symbol
        const classOfKey = (keyValue[0] !== '') ? ['key', keyValue[0]] : ['key'];
        key.classList.add(...classOfKey);


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

  // change to low case or up case || show special symbol
  changeRegister() {
    if (this.isShiftPress || this.isCapsLockPress) {
      // upper
      document.querySelectorAll('.on').forEach((key) => {
        key.children[0].classList.remove('show');
        key.children[0].classList.add('hide');
        key.children[1].classList.add('show');
        key.children[1].classList.remove('hide');
      });
    } else {
      // lower
      document.querySelectorAll('.on').forEach((key) => {
        key.children[0].classList.add('show');
        key.children[0].classList.remove('hide');
        key.children[1].classList.remove('show');
        key.children[1].classList.add('hide');
      });
    }
  }

  // switch language
  langChange() {
    if (this.lang === 'en') this.lang = 'ru';
    else this.lang = 'en';
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
    this.pageLangBtn.innerHTML = this.lang;
    this.changeRegister();
  }

  // when key press down need to call that
  keyDown(event) {
    if (!this.isCapsLockPress && event.key === 'Shift') {
      this.isShiftPress = true;
      this.changeRegister();
    }

    if (event.shiftKey && event.altKey) this.langChange();

    this.textArea.focus();
    this.symbol = '';

    keyboardKeys.forEach((keyboardRowValues) => {
      keyboardRowValues.forEach((keyValue) => {
        if (keyValue[1] === event.code && !ignoreKeys.includes(event.key)) {
          event.preventDefault();
          if (event.key === 'Tab') this.symbol = '  ';
          else {
            const [, , ruLow, ruUp, enLow, enUp] = keyValue;
            switch (this.lang) {
              case 'en':
                if (this.isShiftPress || this.isCapsLockPress) this.symbol = enUp;
                else this.symbol = enLow;
                break;
              case 'ru':
                if (this.isShiftPress || this.isCapsLockPress) this.symbol = ruUp;
                else this.symbol = ruLow;
                break;
              default:
                break;
            }
          }
        }
      });
    });

    // show what we are click to button
    this.keyboard.querySelectorAll('.row').forEach((row) => {
      row.querySelectorAll('.key').forEach((key) => {
        if (event.code === key.children[0].classList[0]) {
          if (!this.isShiftPress && event.key === 'CapsLock') {
            this.checkCaps();
          } else {
            key.classList.add('active');
          }
        }
      });
    });

    // print symbol to textarea
    this.textArea.setRangeText(
      this.symbol,
      this.textArea.selectionStart,
      this.textArea.selectionEnd,
      'end',
    );
  }

  // when key press up use that
  keyUp(event) {
    if (this.isCapsLockPress !== true && event.key === 'Shift') {
      this.isShiftPress = false;
      this.changeRegister();
    }

    // show what we are stop clicking to button
    this.keyboard.querySelectorAll('.row').forEach((row) => {
      row.querySelectorAll('.key').forEach((key) => {
        if (event.code === key.children[0].classList[0] && event.key !== 'CapsLock') {
          key.classList.remove('active');
        }
      });
    });
  }

  // interactive to mouse click
  clickPrint(event) {
    this.textArea.focus();

    this.symbol = '';
    const targetBtn = event.target.closest('button');

    if (targetBtn) {
      const targetSpan = targetBtn.querySelector('.on');
      const targetBtnName = targetSpan.className.split(' ')[0];
      const specialBtn = targetBtn.classList[1];

      targetBtn.classList.add('active');
      setTimeout(() => {
        targetBtn.classList.remove('active');
      }, 150);

      keyboardKeys.forEach((row) => {
        row.forEach((keyValue) => {
          if (keyValue[1] === targetBtnName && (specialBtn === undefined || specialBtn === 'space')) {
            const [, , ruLow, ruUp, enLow, enUp] = keyValue;
            switch (this.lang) {
              case 'en':
                if (this.isShiftPress || this.isCapsLockPress) this.symbol = enUp;
                else this.symbol = enLow;
                break;
              case 'ru':
                if (this.isShiftPress || this.isCapsLockPress) this.symbol = ruUp;
                else this.symbol = ruLow;
                break;
              default:
                break;
            }
          }
        });
      });

      if (specialBtn === 'tab') {
        this.symbol = '  ';
      }

      if (specialBtn === 'enter') {
        this.symbol = '\n';
      }

      if (specialBtn === 'backspace') {
        if (this.textArea.selectionStart > 0) {
          const pos = this.textArea.selectionStart;
          this.textArea.value = this.textArea.value.slice(0, pos - 1)
            + this.textArea.value.slice(pos, this.textArea.value.length);
          this.textArea.setRangeText('', pos - 1, pos - 1, 'end');
        }
      }

      if (specialBtn === 'del') {
        const pos = this.textArea.selectionStart;
        if (this.textArea.selectionStart <= this.textArea.value.length) {
          this.textArea.value = this.textArea.value.slice(0, pos)
            + this.textArea.value.slice(pos, this.textArea.value.length);
          this.textArea.setRangeText('', pos, pos + 1, 'end');
        }
      }

      if (!this.isShiftPress && specialBtn === 'capslock') {
        this.checkCaps();
      }

      if (specialBtn === 'arrow') {
        const pos = this.textArea.selectionStart;
        if (targetBtnName === 'ArrowUp') this.setCaretPosition(pos - this.textArea.value.length);
        else if (targetBtnName === 'ArrowDown') this.setCaretPosition(pos + this.textArea.value.length);
        else if (targetBtnName === 'ArrowRight') this.setCaretPosition(pos + 1);
        else if (targetBtnName === 'ArrowLeft') {
          if (this.textArea.selectionStart > 0) this.setCaretPosition(pos - 1);
        }
      }

      // print symbol to textarea
      this.textArea.setRangeText(
        this.symbol,
        this.textArea.selectionStart,
        this.textArea.selectionEnd,
        'end',
      );
    }
  }
}


const keyBoard = new KeyBoard();
keyBoard.init();


const wrapper = document.querySelector('.wrapper');
wrapper.addEventListener('click', (event) => {
  if (event.target.classList.contains('lang')) {
    keyBoard.langChange(event);
  } else {
    keyBoard.clickPrint(event);
  }
});


document.addEventListener('keydown', (event) => {
  keyBoard.keyDown(event);
});
document.addEventListener('keyup', (event) => {
  keyBoard.keyUp(event);
});
