const inarea = document.getElementById('in');
const outarea = document.getElementById('out');

function autoResize() {
    // 現在のheightと移動先のheightを取得
    const currentHeight = inarea.offsetHeight;
    inarea.style.height = 'auto';
    const newHeight = inarea.scrollHeight;
    inarea.style.height = `${currentHeight}px`;

    if (currentHeight !== newHeight) {
        // アニメーションを確実に動作させるため、次のフレームで高さを適用
        requestAnimationFrame(() => {
            inarea.style.height = `${newHeight}px`;
            outarea.style.height = `${newHeight}px`;
        });
    }
}

inarea.addEventListener('input', autoResize);

// 初期実行（ロード時に高さを設定）
document.addEventListener('DOMContentLoaded', () => {
    inarea.style.height = `${inarea.scrollHeight}px`;
    outarea.style.height = `${inarea.scrollHeight}px`;
});

const soft = document.getElementById('soft');
const hard = document.getElementById('hard');
let softState = true;
let hardState = false;
changeSoft();
changeHard();

function clickSoft() {
    if (!softState) {
        softState = true;
        hardState = false;
        changeSoft();
        changeHard();
    }
    update();
}

function clickHard() {
    if (!hardState) {
        softState = false;
        hardState = true;
        changeSoft();
        changeHard();
    }
    update();
}

function changeSoft() {
    if (softState) {
        soft.style.backgroundColor = 'rgb(144, 255, 144)';
    } else {
        soft.style.backgroundColor = 'rgb(144, 144, 144)';
    }
}

function changeHard() {
    if (hardState) {
        hard.style.backgroundColor = 'rgb(255, 144, 144)';
    } else {
        hard.style.backgroundColor = 'rgb(144, 144, 144)';
    }
}

inarea.addEventListener('input', update);

const DELIMIT = { ' ': ' ', '　': '　', ',': ',', '.': '.', '、': '、', '。': '。', '\n': '\n', '_': '' };

function update() {
    let inText = inarea.value;
    let words = new Array();
    let ptr = 0;
    let temp = "";
    for (let i = 0; i < inText.length; i++) {
        if (inText[i] in DELIMIT) {
            words[ptr] = temp; // %2==0
            ptr++;
            temp = "";
            words[ptr] = inText[i]; //%2==1
            ptr++;

        } else {
            temp += inText[i];
        }
    }
    if (temp !== "") {
        words[ptr] = temp;
    }

    let retText = "";
    for (let i = 0; i < words.length; i++) {
        if (i % 2 === 0) {
            if (softState) {
                retText += softShuffle(words[i]);
            } else {
                retText += hardShuffle(words[i]);
            }
        } else {
            retText += DELIMIT[words[i]];
        }
    }
    outarea.innerHTML = retText;
}

function softShuffle(word) {
    if (word.length <= 3) {
        return word;
    }
    let wordArr = Array.from(word);
    let first = wordArr.shift();
    let last = wordArr.pop();

    /* ※以下、"バイアスをつけたシャッフルアルゴリズム"です。詳細は聞かないでください */
    maxBias = 2;
    return first +
        wordArr.map((value, index) => ({ value, sortKey: index + (Math.random() * 2 - 1) * maxBias }))
            .sort((a, b) => a.sortKey - b.sortKey)
            .map(item => item.value)
            .join('')
        + last;
}

function hardShuffle(word) {
    if (word.length <= 3) {
        return word;
    }
    let wordArr = Array.from(word);
    let first = wordArr.shift();
    let last = wordArr.pop();

    /* Fisher-Yates Shuffle 完全シャッフル */
    for (let i = 0; i < wordArr.length - 1; i++) {
        r = parseInt(Math.random() * (wordArr.length - i));
        temp = wordArr[r];
        wordArr[r] = wordArr[wordArr.length - 1 - i];
        wordArr[wordArr.length - 1 - i] = temp;
    }
    return first + wordArr.join('') + last;
}

function clipboardCopy() {
    navigator.clipboard.writeText(outarea.value);
}