window.onload = function () {
    getData();
    sessionStorage.setItem("user", "");
};

let managerValue = "";
let prodValue = "";
let markValue = "";

let mailArr = [];
let prodArr = [];
let markArr = [];
let allProds = [];

async function getData() {
    let response = await fetch('http://localhost:4000/api/users');
    let products = await response.json();

    allProds = products;

    let manager = new Set();
    products.forEach(i => manager.add(i.TradeMarketMail));

    mailArr = [...manager];
    mailArr.map(i => {
        let managerOption = document.createElement('option');
        managerOption.innerHTML = `${i}`;

        document.getElementById('manager').prepend(managerOption);
    });

    // ProdName select

    let prod = new Set();

    products.forEach(i => prod.add(i.ProdName));
    prodArr = [...prod];

    // MarkName select

    let mark = new Set();
    products.forEach(i => mark.add(i.MarkName));
    markArr = [...mark];

}

document.getElementById('manager').onchange = function () {
    managerValue = this.value;

    resetManager();

    let set = new Set();

    allProds.map(i => {
        if (i.TradeMarketMail === managerValue) {
            set.add(i.ProdName)
        }
    });

    [...set].map(i => {
        let prodOption = document.createElement('option');
        prodOption.innerHTML = `${i}`;

        document.getElementById('prod').prepend(prodOption);
    });

};

document.getElementById('prod').onchange = function () {
    prodValue = this.value;

    resetProd();

    let set = new Set();

    allProds.map(i => {
        if (i.TradeMarketMail === managerValue && i.ProdName === prodValue) {
            set.add(i.MarkName);
        }
    });

    [...set].map(i => {
        let prodOption = document.createElement('option');
        prodOption.innerHTML = `${i}`;

        document.getElementById('mark').prepend(prodOption);
    });
};

document.getElementById('mark').onchange = function () {
    markValue = this.value;

    resetMark();

    allProds.map(i => {
        let tr = document.createElement('tr');
        let SortNO = document.createElement('td');
        let CSKUID = document.createElement('td');
        let CSKU = document.createElement('td');
        let ItemName = document.createElement('td');
        let check = document.createElement('input');

        SortNO.innerText = i.SortNO;
        CSKUID.innerText = i.CSKUID;
        CSKU.innerText = i.CSKU;
        ItemName.innerText = i.ItemName;
        check.type = "checkbox";

        check.classList.add('check');
        check.checked = "true";

        tr.append(SortNO);
        tr.append(CSKUID);
        tr.append(CSKU);
        tr.append(ItemName);
        tr.append(check);

        tr.classList.add('checker');


        if (i.TradeMarketMail === managerValue && i.ProdName === prodValue && i.MarkName === markValue) {
            document.getElementById('tbl').append(tr);
        }

    });
};

let sendingResult = [];

document.getElementById('send').onclick = () => {
    sendingResult = [...document.getElementsByClassName('checker')].filter(i => i.lastChild.checked === true);

    sendingResult = sendingResult.map(i => [...i.cells].map(i => i.innerText));

    sendingResult = sendingResult.map(i => i[1]);

    sendingResult = allProds.filter(i => sendingResult.includes(i.CSKUID));

    let d = Date(Date.now());
    let dateNow = d.toString();

    if (
        document.getElementById("aInitiator").value !== '' &&
        document.getElementById("sdate").value !== '' &&
        document.getElementById("fdate").value !== '' &&
        document.getElementById("acomment").value !== '' &&
        document.getElementById("aType").value !== '' &&
        document.getElementById("budget").value !== '' &&
        document.getElementById("aTypeAddition").value !== '' &&
        document.getElementById("aTypeRange").value !== '' &&
        document.getElementById("budgetVal").value !== '' &&
        document.getElementById("cbf").value !== '' &&
        document.getElementById("cbt").value !== '' &&
        document.getElementById("cbc").value !== '' &&
        document.getElementById("budgetType").value !== '' &&
        document.getElementById("discount").value !== '' &&
        document.getElementById("manager").value !== '' &&
        document.getElementById("prod").value !== '' &&
        document.getElementById("mark").value !== '' &&
        sendingResult.length !== 0
    ) {
        sendRes(
            dateNow,
            sessionStorage.getItem("user"),
            sessionStorage.getItem("mail"),
            document.getElementById("aInitiator").value,
            document.getElementById("sdate").value,
            document.getElementById("fdate").value,
            document.getElementById("acomment").value,
            document.getElementById("aType").value,
            document.getElementById("budget").value,
            document.getElementById("aTypeAddition").value,
            document.getElementById("aTypeRange").value,
            document.getElementById("budgetVal").value,
            document.getElementById("cbf").value,
            document.getElementById("cbt").value,
            document.getElementById("cbc").value,
            document.getElementById("budgetType").value,
            document.getElementById("discount").value,
            document.getElementById("manager").value,
            document.getElementById("prod").value,
            document.getElementById("mark").value,
            sendingResult
        );
        alert("Дата отправлена!");
        location.reload();
    } else {
        alert("Вы допустили ошибку при заполнении формы! \n Все поля обязательны! \n В таблице должно быть помечено галочкой хотя бы одно поле!")
    }

};



async function sendRes(
    dateNow, userName, userMail, actionInitiator, startDate, finishDate, actionComment,
    actionType, budgetQuantity, actionTypeAdditional, actionTypeLocale,
    budgetNumber, affiliateBudget, ttBudget, cskuBudget, budgetType,
    discount, manager, prod, mark, sendingResult
) {

    const response = await fetch("http://localhost:4000/api/res", {
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            dateNow: dateNow,
            userName: userName,
            userMail: userMail,
            actionInitiator: actionInitiator,
            startDate: startDate,
            finishDate: finishDate,
            actionComment: actionComment,
            actionType: actionType,
            budgetQuantity: budgetQuantity,
            actionTypeAdditional: actionTypeAdditional,
            actionTypeLocale: actionTypeLocale,
            budgetNumber: budgetNumber,
            affiliateBudget: affiliateBudget,
            ttBudget: ttBudget,
            cskuBudget: cskuBudget,
            budgetType: budgetType,
            discount: discount,
            manager: manager,
            prod: prod,
            mark: mark,
            order: sendingResult
        })
    });
}

async function sendMail(selection) {

    const response = await fetch("http://localhost:4000/api/send", {
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify(
            selection
        )
    });
}

// reseters
function resetManager() {
    document.getElementById('prod').innerHTML = '';

    let prodOption = document.createElement('option');
    prodOption.innerHTML = `select product`;

    document.getElementById('prod').prepend(prodOption);

    resetProd();
    resetMark();
}

function resetProd() {
    document.getElementById('mark').innerHTML = '';

    let prodOption = document.createElement('option');
    prodOption.innerHTML = `select mark`;

    document.getElementById('mark').prepend(prodOption);

    resetTable();
}

function resetMark() {

    resetTable();
}

function resetTable() {
    document.getElementById('tbl').innerHTML = '';
    let tr = document.createElement('tr');
    let SortNO = document.createElement('th');
    let CSKUID = document.createElement('th');
    let CSKU = document.createElement('th');
    let ItemName = document.createElement('th');
    let check = document.createElement('th');

    SortNO.innerText = "SortNO";
    CSKUID.innerText = "CSKUID";
    CSKU.innerText = "CSKU";
    ItemName.innerText = "ItemName";
    check.innerText = "Send";

    tr.append(SortNO);
    tr.append(CSKUID);
    tr.append(CSKU);
    tr.append(ItemName);
    tr.append(check);

    document.getElementById('tbl').append(tr);
}

