
function toHex(str) {
    let ret = '';
    for (let i=0; i<str.length; i++) {
        ret += str.charCodeAt(i).toString(16) + ' ';
    }
    return ret;
}
function setHexStr(id) {
    document.getElementById(id+'16').value = toHex(document.getElementById(id).value);
}
function setToHexEvent(id) {
    document.getElementById(id).addEventListener('change', function(){ setHexStr(id); } );
    document.getElementById(id).addEventListener('keyup', function(){ setHexStr(id); } );
}

function hexToStr(hex) {
    let ret = '';
    let spl = hex.split(' ');
    for (let i=0; i<spl.length; i++) {
        if (spl[i].length > 0) {
            ret += String.fromCharCode(parseInt(spl[i], 16));
        }
    }
    return ret;
}

function encrypt(str, e, p, q) {
    let ret = '';
    let spl = str.split(' ');
    for (let i=0; i<spl.length; i++) {
        if (spl[i].length > 0) {
            let a = parseInt(spl[i], 16);
            let r = modPow(a, e, (p * q));
            ret += r.toString(16) + ' ';
        }
    }
    return ret;
}
function modPow(a,b,m) {
    let ret = 1;
    while (b > 0) {
        if (b & 1 == 1) ret = (ret * a) % m;
        a = (a * a) % m;
        b /= 2;
    }
    return ret;
}
function aboutPow(b) {
    let div10 = Math.floor(b/10);
    let ret = 1;
    let sufIndex = 0;
    let sup = 1
    for (let i=0; i<div10; i++) {
        sup += 3
    }
    ret = ret * Math.pow(2, b % 10);
    if (ret > 10000) {
        ret /= 10000;
        sufIndex++;
        sup += 4
    }
    // 300年を約 10^10 秒
    let sec = Math.floor(sup/17);
    let time = "";
    let year = 0;
    if (sup >= 17) {
        if (sec >= 10) {
            year = (sec/10) * 300
        }
    } else {
        time = "1秒未満";
    }
    return Math.pow(2, b % 10) + "×10の" + sup + "乗";
}
function isPrime(n) {
    let sqrt = Math.sqrt(n);
    let m = 2;
    while (m <= sqrt) {
        if (n%m == 0) return false;
        m++;
    }
    return true;
}
let pOk = false;
let qOk = false;
function primeCheck(id, resultId, pId, qId, nId, fId, eId) {
    let n = document.getElementById(id).value * 1;
    let result = isPrime(n);
    displayCheckResult(result, resultId);
    if (id.indexOf('p') != -1 ) pOk = result;
    if (id.indexOf('q') != -1 ) qOk = result;
    if (pOk && qOk) {
        let p = document.getElementById(pId).value * 1;
        let q = document.getElementById(qId).value * 1;
        let n = p*q;
        document.getElementById(nId).innerText = n;
        let f = (p-1)*(q-1);
        document.getElementById(fId).innerText = f;
        coprimeList(p, q, eId);
    };
}
function isCoprime(a, b) {
    while(a != b) {
        if (a > b) a -= b;
        else b -= a;
    }
    return a == 1;
}
function coprimeCheck(aId, bId, resultId) {
    let a = document.getElementById(aId).value * 1;
    let b = document.getElementById(bId).value * 1;
    let result = isCoprime(a, b);
    displayCheckResult(result, resultId);
}
function coprimeList(p, q, listId) {
    let list = document.getElementById(listId);
    while(list.lastChild) {
		list.removeChild(list.lastChild);
	}
    let n = p*q;
    let f = (p-1)*(q-1);
    for (let e=2; e < n; e++) {
        if (isCoprime(e,f)) {
            let option = document.createElement("option");
            option.value = e;
            option.innerHTML = e;
            list.appendChild(option);
        }
    }
}
function selectE(eId, pId, qId, dId) {
    let p = document.getElementById(pId).value * 1;
    let q = document.getElementById(qId).value * 1;
    let e = document.getElementById(eId).value * 1;
    let d = calcD(e, p, q);
    document.getElementById(dId).innerText = d;
}
function calcD(e, p, q) {
    for(let d=2; d<=p*q; d++) {
        let j=1;
        while(e*d - ((p-1)*(q-1)*j) > 0) {
            if (e*d - ((p-1)*(q-1)*j) == 1) {
                return d;
            }
            j++;
        }
    }
    return -1;
}
function displayCheckResult(result, resultId) {
    document.getElementById(resultId).innerText = (result?"OK":"NG");
}
function finishKeyMake(pId, qId, eId, dId, resultPId, resultQId, resultNId, resultEId, resultDId) {
    let p = document.getElementById(pId).value * 1;
    let q = document.getElementById(qId).value * 1;
    let e = document.getElementById(eId).value * 1;
    let d = document.getElementById(dId).innerText * 1;
    document.getElementById(resultPId).innerText = p;
    document.getElementById(resultQId).innerText = q;
    document.getElementById(resultEId).innerText = e;
    document.getElementById(resultDId).innerText = d;
    let n = p*q;
    document.getElementById(resultNId).innerText = n;
}
function setEncryptStr(idFrom, idTo, idSel, p ,q) {
    document.getElementById(idTo+'16').value = encrypt(document.getElementById(idFrom+'16').value, document.getElementById(idSel).value, p ,q);
    document.getElementById(idTo).value = hexToStr(document.getElementById(idTo+'16').value);
}
function setEncryptEvent(idBtn, idFrom, idTo, idSel, p ,q) {
    document.getElementById(idBtn).addEventListener('click', function(){ setEncryptStr(idFrom, idTo, idSel, p ,q); } );
}
function calcByMakedKey(specId, tableId, pId, qId) {
    let p = document.getElementById(pId).value * 1;
    let q = document.getElementById(qId).value * 1;
    powTable(specId, tableId, p, q);
}
function powTable(specId, tableId, p, q) {
    let n = p*q;
    document.getElementById(specId).innerHTML = "a<sup>b</sup>(mod "+n+")　※縦軸a、横軸b";
    let str = "<table class='m'>";
    str += "<tr><th class='fixed01'></th>";
    let max = n;
    if (max > 200) max = 200;
    for (let j=1; j<max; j++) {
        str += "<th class='m fixed02'>"+j+"</th>"
    }
    str += "</tr>";
    
    for (let i=2; i<max; i++) {
        str += "<tr><th class='m fixed02'>"+i+"</th>";
        let tmp = i%n;
        for (let j=1; j<max; j++) {
            str += "<td class='m'>"+tmp+"</td>"
            tmp *= i;
            tmp %= n;
        }
        str += "</tr>";
    }
    str += "</table>";
    document.getElementById(tableId).innerHTML = str;
}

function init() {
    setToHexEvent('1_plain');
    // setToHexEvent('1_encrypt');
    // setToHexEvent('1_decrypt');
    let p = document.getElementById('1_p').value;
    let q = document.getElementById('1_q').value;
    
    setEncryptEvent('1_enc_btn', '1_plain',   '1_encrypt', '1_enc_sel', p, q);
    setEncryptEvent('1_dec_btn', '1_encrypt', '1_decrypt', '1_dec_sel', p, q);
}