async function createUser(mail, pass, n, s) {

    const response = await fetch("http://localhost:4000/api/user", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            name: n,
            surname: s,
            password: pass,
            mail: mail
        })
    });

    document.getElementById('userMail').value = '';
    document.getElementById('userPass').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('userSurname').value = '';

    document.getElementsByClassName('user-created')[0].classList.remove('dn');

    setTimeout(lightsOff, 1000 );
}

function lightsOff() {
    document.getElementsByClassName('user-created')[0].classList.add('dn');
    document.getElementsByClassName('user-wrong')[0].classList.add('dn');
}

/*userMail
userPass
userName
userSurname*/

document.getElementById('cnu').onclick = function () {
    if (
        document.getElementById('userMail').value !== '' &&
        document.getElementById('userPass').value !== '' &&
        document.getElementById('userName').value !== '' &&
        document.getElementById('userSurname').value !== ''
    ) {
        createUser(
            document.getElementById('userMail').value,
            document.getElementById('userPass').value,
            document.getElementById('userName').value,
            document.getElementById('userSurname').value
        );
    }
};

let allUsers = [];

async function login() {
    let response = await fetch('http://localhost:4000/api/all');
    let users = await response.json();

    allUsers = users;
}

let currentUser = {};
document.getElementById('login').onclick = function () {
    login().then(r => {
        currentUser = allUsers.find(i => document.getElementById('loginMail').value == i.email && document.getElementById('loginPass').value == i.password );

        if (!currentUser) {
            document.getElementsByClassName('user-wrong')[0].classList.remove('dn');

            setTimeout(lightsOff, 1000 );
        } else {
            let fio = currentUser.name + " " + currentUser.surname;
            sessionStorage.setItem("user", fio);
            sessionStorage.setItem("mail", currentUser.email);
            document.getElementById('current-userMail').textContent = currentUser.email;
            document.getElementById('current-fio').textContent = fio;
            document.getElementById('not-auth').classList.add('dn');
        }


    });
};
