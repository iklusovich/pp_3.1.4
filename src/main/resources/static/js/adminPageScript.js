const adminUsersUrl = '/admin/api/users';
const adminRolesUrl = '/admin/api/roles';

const getUsersData = async () => {
    const response = await fetch(adminUsersUrl);
    const {currentUser, allUsers} = await response.json();
    await getCurrentUserInfo(currentUser);
    await createTableUsersData(allUsers);
    await getAllUsersInfo(allUsers, currentUser);
}

const getRolesData = async () => {
    const response = await fetch(adminRolesUrl);
    return await response.json();
}

const getCurrentUserInfo = (currentUser) => {
    document.getElementById("currentUserEmail").innerText = currentUser.email + " " + document.getElementById("currentUserEmail").innerText;
    document.getElementById("currentUserRoles").innerText = currentUser.roles.map(role => role.name.replace("ROLE_", "")).join(" ");
}

const getAllUsersInfo = async (allUsers, currentUser) => {
    allUsers.forEach(user => {
        document.getElementById("allUsersNavItem").innerHTML += currentUser.id === user.id ? `
            <li class="nav-item mb-0" >
<a class="nav-link active" aria-current="page" href="@{/admin(id=${user.id})}"> ${user.firstName} <a/><li>` :
            `<li class="nav-item mb-0" ><a class="nav-link"
                   aria-current="page" href="@{/admin(id=${user.id})}">${user.firstName}</a></li>`
    })
}

const allRolesListHelper = async (parentId = "", user = null, deleteMode = false) => {
    let allRoles = await getRolesData();
    const prepareRoles = allRoles.map(role => {
        let isSelected = false;
        if (user) {
            isSelected = user.roles.map(elem => elem.name).includes(role.name) && !deleteMode;
        }
        return isSelected ? `<option selected value=${role.id}><span>${role.name.replace("ROLE_", "")} </span></option>`
            : `<option value=${role.id}><span>${role.name.replace("ROLE_", "")} </span></option>`

    })
    prepareRoles.forEach(role => document.getElementById(parentId).innerHTML += role)
}


const createTableUsersData = (allUsers) => {
    const tableUsersData = document.getElementById("tableUsersData");

    allUsers.forEach((user, index) => {
        return tableUsersData.innerHTML += `<tr id="tr"
                                class=${index % 2 === 1 ? 'bg-light border-top lh-lg' : 'bg-white border-top lh-lg'}>
                                <td class="ps-3 lh-lg pb-3 pt-3">${user.id}</td>
                                <td>${user.firstName}</td>
                                <td>${user.lastName}</td>
                                <td>${user.age}</td>
                                <td>${user.email}</td>
                                <td><span>${user.roles.map(role => role.name.replace("ROLE_", "")).join(" ")}</span>
                                </td>
                                <td>
                                    <button 
                                    class="bg-info text-white border-0 rounded" 
                                    type="submit"
                                    onclick=${openEditModal(user)}
                                    data-bs-toggle="modal" 
                                    data-bs-target=${'#editModal' + user.id}>
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button class="bg-danger text-white border-0 rounded"
                                     type="submit"
                                     onclick=${openDeleteModal(user)}
                                     data-bs-toggle="modal"
                                     data-bs-target=${'#deleteModal' + user.id}>
                                        Delete
                                     </button>
                                </td>
                            </tr>`
    })
}

const openDeleteModal = (user) => {
    const td = document.createElement("td");
    td.innerHTML = createModalHelper(user, "delete")();
    document.body.appendChild(td)
    const modal = document.getElementById('deleteModal' + user.id);
    if (modal) {
        const inputs = modal.querySelectorAll("input");
         modal.querySelectorAll("select")[0].setAttribute("disabled", "disabled");
        [...inputs].map(input => input.setAttribute("disabled", "disabled"))
    }


}

const openEditModal = (user) => {
    const td = document.createElement("td");
    td.innerHTML = createModalHelper(user, "edit")();
    document.body.appendChild(td)
}

const createModalHelper = (user, mode = "edit") =>  ()=>
     `<div class="modal fade" id=${mode === "edit" ? 'editModal' + user.id : 'deleteModal' + user.id} tabindex="-1"
                                     aria-labelledby="deleteModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="deleteModalLabel">${mode === "edit" ? 'Edit user' : 'Delete user'}</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                        aria-label="Закрыть"></button>
                                            </div>
                                            <div class="modal-body d-flex justify-content-center">
                                                <form method="GET"
                                                      onsubmit=${updateUser(user)}
                                                      action=${mode === "edit" ? '/admin/edit?id=' + user.id : '/admin/delete?id=' + user.id}
                                                      class="col-6 d-flex flex-column justify-content-center align-content-center">
                                                    <div class="d-flex justify-content-center align-content-center">
                                                        <div class="pt-4 bg-white p-3 d-flex justify-content-center flex-column">

                                                            <label for=${mode === "edit" ? 'idEdit' + user.id : 'idDelete' + user.id}"
                                                                   class="fw-bold align-self-center">ID</label>
                                                            <input type="text" id=${mode === "edit" ? 'idEdit' + user.id : 'idDelete' + user.id}
                                                                   value=${user.id}
                                                                   disabled
                                                                   class="rounded p-1 border-1  mb-2 p-1" 
                                                                   >
                                                            <label for=${mode === "edit" ? 'firstNameEdit' + user.id : 'firstNameDelete' + user.id}
                                                                   class="fw-bold align-self-center">First name</label>
                                                            <input type="text"
                                                                   id=${mode === "edit" ? 'firstNameEdit' + user.id : 'firstNameDelete' + user.id}
                                                                   value=${user.firstName}
                                                                   class="rounded p-1 border-1  mb-2 p-1">
                                                            <label for=${mode === "edit" ? 'lastNameEdit' + user.id : 'lastNameDelete' + user.id}
                                                                   class="fw-bold align-self-center">Last name</label>
                                                            <input type="text"
                                                                   id=${mode === "edit" ? 'lastNameEdit' + user.id : 'lastNameDelete' + user.id}
                                                                   value=${user.lastName}
                                                                   class="rounded p-1 border-1  mb-2 p-1 ">
                                                            <label for=${mode === "edit" ? 'ageEdit' + user.id : 'ageDelete' + user.id}
                                                                   class="fw-bold align-self-center">Age</label>
                                                            <input type="number" id=${mode === "edit" ? 'ageEdit' + user.id : 'ageDelete' + user.id}
                                                                   value=${user.age}
                                                                   class="rounded p-1 border-1  mb-2 p-1">
                                                            <label for=${mode === "edit" ? 'emailEdit' + user.id : 'emailDelete' + user.id}
                                                                   class="fw-bold align-self-center">Email</label>
                                                            <input type="email" id=${mode === "edit" ? 'emailEdit' + user.id : 'emailDelete' + user.id}
                                                                   value=${user.email}
                                                                   class="rounded p-1 border-1  mb-2 p-1">
                                                            <label for=${mode === "edit" ? 'roleEdit' + user.id : 'roleDelete' + user.id}
                                                                   class="fw-bold align-self-center">Role</label>
                                                            <select name="roles" id=${mode === "edit" ? 'roleEdit' + user.id : 'roleDelete' + user.id}
                                                                    multiple
                                                                    class="mb-2 ps-2" size="2">
                                                                ${mode === "edit" ? allRolesListHelper(mode === "edit" ? 'roleEdit' + user.id : 'roleDelete' + user.id, user) : allRolesListHelper('roleDelete' + user.id, user, true)}
                                                            </select>

                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                                    Close
                                                </button> 
                                                    ${mode === "edit" ?
        '<button type="submit" class="btn btn-primary">Edit</button>' :
        '<button type="button" class="btn btn-danger">Delete</button>'}
                                           
                                            </div>
                                        </div>


`
const updateUser = async (user) => {
    console.log(user.id)
    const form = document.getElementById("userCreateForm");
    const formData = new FormData(form);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const age = formData.get('age');
    const email = formData.get('email');
    const password = formData.get('password');
    let roles = formData.getAll("roles");
    const listRole = []
    roles.map(role => {
        listRole.push({id: role})
    })

    await fetch(adminUsersUrl, {
        method:"PATCH",
        body: JSON.stringify({firstName, lastName, age,email, password,roles:listRole}),
        headers: {
            'content-type': 'application/json'
        },
    })
    document.getElementById("tableUsersData").innerText = "";
    document.getElementById("allUsersNavItem").innerText = "";
    document.getElementById("adminPanel-tab").click()
    await getUsersData();
}

const createNewUser = async () => {

    const form = document.getElementById("userCreateForm");
    const formData = new FormData(form);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const age = formData.get('age');
    const email = formData.get('email');
    const password = formData.get('password');
    let roles = formData.getAll("roles");
    const listRole = []
    roles.map(role => {
         listRole.push({id: role})
    })

    await fetch(adminUsersUrl, {
        method:"POST",
        body: JSON.stringify({firstName, lastName, age,email, password,roles:listRole}),
        headers: {
            'content-type': 'application/json'
        },
    })
    document.getElementById("tableUsersData").innerText = "";
    document.getElementById("allUsersNavItem").innerText = "";
    document.getElementById("adminPanel-tab").click()
    await getUsersData();
}

const createUserFormHelper = () => {
    const form = document.getElementById("userCreateForm");

    form.innerHTML = `
    <label for="firstName" class="fw-bold align-self-center">First name</label>
                            <input type="text"
                                   id="firstName"
                                   name="firstName"
                                   class="rounded p-1 border-1  mb-2 p-1">
                            <label for="lastName" class="fw-bold align-self-center">Last name</label>
                            <input type="text"
                                   id="lastName"
                                   name="lastName"
                                   class="rounded p-1 border-1  mb-2 p-1">
                            <label for="age" class="fw-bold align-self-center">Age</label>
                            <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    class="rounded p-1 border-1  mb-2 p-1">
                            <label for="email" class="fw-bold align-self-center">Email</label>
                            <input type="email" id="email" name="email" class="rounded p-1 border-1  mb-2 p-1">
                            <label for="password"
                                   class="fw-bold align-self-center">Password</label>
                            <input type="password" id="password" name="password"
                                   class="rounded p-1 border-1  mb-2 p-1">
                            <label for="roles" class="fw-bold align-self-center">Role</label>
                            <select name="roles" id="roles" multiple class="mb-2 ps-2" size="2">
                                ${allRolesListHelper("roles")}
                            </select>

                            <button type="button" th:value="Add" onclick="createNewUser()"
                                    class="fs-5 border-0 bg-success text-white w-50 align-self-center rounded p-2">Add
                                new user
                            </button>`
}
getUsersData();
