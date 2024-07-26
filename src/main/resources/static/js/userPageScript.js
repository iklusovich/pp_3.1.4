const adminUsersUrl = '/admin/api/users';

const getUser = async () => {
    const params = (new URL(document.location)).searchParams;
    const id = params.get("id");
    const response = await fetch(adminUsersUrl + `?id=${id}`)
    return await response.json();
}

const getUserInfo = (user) => {
    document.getElementById("userEmail").innerText = user.email + " " + document.getElementById("userEmail").innerText;
    document.getElementById("userRoles").innerText = user.roles.map(role => role.name.replace("ROLE_", "")).join(" ");
}

const getAllUsersInfo =  (allUsers, showUser) => {
    allUsers.forEach(user => {
        document.getElementById("allUsersNavItem").innerHTML += showUser.id === user.id ? `
            <li class="nav-item mb-0" >
<a class="nav-link active" aria-current="page"  href=/admin/users?id=${user.id}> ${user.firstName} <a/><li>` :
            `<li class="nav-item mb-0" ><a class="nav-link"
                   aria-current="page" href=/admin/users?id=${user.id}>${user.firstName}</a></li>`
    })
}

const createUserTable = async () => {
    const {showUser} = await getUser();


    const tr = document.getElementById("userInfoTr");

    tr.innerHTML = `                <td class="ps-3">${showUser.id}</td>
                <td>${showUser.firstName}</td>
                <td>${showUser.lastName}</td>
                <td>${showUser.age}</td>
                <td>${showUser.email}</td>
                <td><span>${showUser.roles.map(role => role.name.replace("ROLE_", "")).join(" ")}</span>`
}

const getPage = async () => {
    const {allUsers, showUser} = await getUser();
    getUserInfo(showUser);
    getAllUsersInfo(allUsers, showUser);
    await createUserTable();
}

getPage();