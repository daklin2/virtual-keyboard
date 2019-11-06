let typeOfKey = {
    KeyQ: "й", Keyw: "ц", KeyE: "у", KeyR: "к", KeyT: "е", KeyY: "н", KeyU: "г", KeyI: "ш", KeyO: "щ", KeyP: "з",
    BracketLeft: "х", BracketRight: "ъ",
    KeyA: "ф", KeyS: "ы", KeyD: "в", KeyF: "а", KeyG: "п", KeyH: "р", KeyJ: "о", KeyK: "л", KeyL: "д",
    Semicolon: "ж", Quote: "э", Backslash: "ё",
    KeyZ: "я", KeyX: "ч", KeyC: "с", KeyV: "м", KeyB: "и", KeyN: "т", KeyM: "ь",
    Comma: "б", Period: "ю", 
}

document.addEventListener('keyup', function(event) {
    code = event.code.substring(0, 3).toLowerCase()
    if(code === "key" || code === "bra" || code === "sem" || code === "quo" || code === "bac" || code === "com" || code === "per"){
        if(keyboard.properties.language == "eng"){
            if(code === "com" || code === "per"){key = event.key.toLowerCase()}
            else{key = event.code.replace('Key', '').toLowerCase()}
        }else{
            if(event.key.toLowerCase() === "backspace"){key = event.key.toLowerCase()}
            else{key = typeOfKey[event.code]}
        }
    }else{key = event.key.toLowerCase()}
    tapKey = document.getElementsByClassName(key)[0]
    // console.log(event.code, event.key, key, tapKey)
    tapKey.click()
});

const keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        language: "eng"
    },

    init(){
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        this.elements.main.classList.add("keyboard");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            this.keyClick(element.value, currentValue => {
                element.value = currentValue;
            });
        });
    },

    _createKeys() {
        const keyLayout_rus = [
            "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", '.',
            "capslock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
            "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ",", "?","!", "/", 
            "alt", "space"
        ]
        const keyLayout_eng = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "tab","q", "w", "e", "r", "t", "y", "u", "i", "o", "p", ".",
            "capslock", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", "?", "!", "/",
            "alt", "space",
        ];

        const fragment = document.createDocumentFragment();

        if(this.properties.language === "rus"){
            keyLayout = keyLayout_rus;
        }else{
            keyLayout = keyLayout_eng;
        }
        

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button")
            const insertLineBreak = ["backspace", ".", "enter", "/"].indexOf(key) !== -1

            keyElement.setAttribute("type", "button")
            keyElement.classList.add("keyboard__key", key)

            switch (key) {
                case "backspace":
                    keyElement.textContent = key.toLowerCase();
                    keyElement.classList.add("keyboard__key--wide");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput")
                        this._animate(keyElement)

                    });
                    break;

                case "capslock":
                    keyElement.textContent = key.toLowerCase();
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock()
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock)
                        this._animate(keyElement)
                    });

                    break;

                case "enter":
                    keyElement.textContent = key.toLowerCase();
                    keyElement.classList.add("keyboard__key--wide");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n"
                        this._triggerEvent("oninput")
                        this._animate(keyElement)
                    });

                    break;

                case "space":
                    keyElement.textContent = key.toLowerCase();
                    keyElement.classList.add("keyboard__key--extra-wide");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " "
                        this._triggerEvent("oninput")
                        this._animate(keyElement)
                    });

                    break;

                case "tab":
                    keyElement.textContent = key.toLowerCase();
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "   "
                        this._triggerEvent("oninput")
                        this._animate(keyElement)
                    });
                    break

                case "alt":
                    keyElement.textContent = key.toLowerCase();
                    keyElement.addEventListener("click", () => {
                        this._toggleLanguage()
                        this._triggerEvent("oninput")
                        this._animate(keyElement)
                    });
                    break

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput")
                        this._animate(keyElement)
                    });
                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    keyClick(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    _toggleLanguage() {
        if(this.properties.language === "rus"){this.properties.language = "eng"}
        else{this.properties.language = "rus"}

        document.getElementsByClassName("keyboard__keys")[0].innerHTML = "";
        this.elements.keysContainer.appendChild(this._createKeys());
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _animate(tapKey) {
        tapKey.classList.add("active")
        setTimeout(function() {
          tapKey.classList.remove("active")
        }, 500)
    },
}

window.addEventListener("DOMContentLoaded", function () {
    let textarea = document.createElement('textarea');
    textarea.classList.add("use-keyboard-input");
    textarea.setAttribute("readonly", 'true');
    textarea.setAttribute("tabindex", '-1');
    document.body.append(textarea);

    keyboard.init();
});
