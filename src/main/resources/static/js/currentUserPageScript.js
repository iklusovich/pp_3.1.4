const adminUsersUrl = '/user/api';

const getUser = async () => {
    const response = await fetch(adminUsersUrl)
    return await response.json();
}

const getUserInfo = (user) => {
    document.getElementById("userEmail").innerText = user.email + " " + document.getElementById("userEmail").innerText;
    document.getElementById("userRoles").innerText = user.roles.map(role => role.name.replace("ROLE_", "")).join(" ");
}

const getUserName =  (currentUser) => {
        document.getElementById("allUsersNavItem").innerHTML =
                `<li class="nav-item mb-0">
<a class="nav-link active" aria-current="page">${currentUser.firstName}</a>
</li>`
}

const createUserTable = async () => {
    const {currentUser} = await getUser();


    const tr = document.getElementById("userInfoTr");

    tr.innerHTML = `                <td class="ps-3">${currentUser.id}</td>
                <td>${currentUser.firstName}</td>
                <td>${currentUser.lastName}</td>
                <td>${currentUser.age}</td>
                <td>${currentUser.email}</td>
                <td><span>${currentUser.roles.map(role => role.name.replace("ROLE_", "")).join(" ")}</span>`
}

const getPage = async () => {
    const {currentUser} = await getUser();
    getUserInfo(currentUser);
    getUserName(currentUser);
    await createUserTable();
}

getPage();