const adminUsersUrl = '/admin/api/users';
const adminRolesUrl = '/admin/api/roles';

const getUsersData = async () => {
    const response = await fetch(adminUsersUrl);
    const {currentUser, allUsers, user, showUser} = await response.json();
    await getCurrentUserInfo(currentUser);
    await createTableUsersData(allUsers);
    await getAllUsersInfo(allUsers, currentUser);
}

const getRolesData = async () => {
    const response = await fetch(adminRolesUrl);
    return await response.json();
}

const getCurrentUserInfo =  (currentUser) => {
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

const allRolesListHelper =  async (parentId = "", user = null, deleteMode = false) => {
    let allRoles = await getRolesData();
    const prepareRoles = allRoles.map(role => {
        let isSelected = false;
        if (user) {
            isSelected = user.roles.map(elem => elem.name).includes(role.name) && !deleteMode;
        }
        return isSelected ? `<option selected><span>${role.name.replace("ROLE_", "")} </span></option>`
                : `<option><span>${role.name.replace("ROLE_", "")} </span></option>`

    })
    prepareRoles.forEach(role => document.getElementById(parentId).innerHTML += role)
}


const createTableUsersData = async (allUsers) => {
    const tableUsersData = document.getElementById("tableUsersData");


    allUsers.forEach((user, index) => {
        return tableUsersData.innerHTML += `<tr
                                class=${index % 2 === 1 ? 'bg-light border-top lh-lg' : 'bg-white border-top lh-lg'}>
                                <td class="ps-3 lh-lg pb-3 pt-3">${user.id}</td>
                                <td>${user.firstName}</td>
                                <td>${user.lastName}</td>
                                <td>${user.age}</td>
                                <td>${user.email}</td>
                                <td><span>${user.roles.map(role => role.name.replace("ROLE_", "")).join(" ")}</span>
                                </td>
                                <td>
                                    <button class="bg-info text-white border-0 rounded" type="submit"
                                            data-bs-toggle="modal" data-bs-target=${'#editModal' + user.id}>
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <a>
                       
            <button class="bg-danger text-white border-0 rounded"
                  
                    type="submit"
                    data-bs-toggle="modal"
                    data-bs-target=${'#deleteModal' + user.id}>Delete
            </button>
                                    </a>
                                </td>
                                <div class="modal fade" id=${'editModal' + user.id} tabindex="-1"
                                     aria-labelledby="editModalLabel"
                                     aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="EditModalLabel">Edit user</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                        aria-label="Закрыть"></button>
                                            </div>
                                            <form method="GET"
                                                  action="/admin/id=${user.id}"
                                                  class="col-6 d-flex flex-column justify-content-center align-content-center">
                                                <div class="modal-body">
                                                    <div>
                                                        <div class="pt-4 bg-white p-3 d-flex justify-content-center flex-column">

                                                            <label for="${'idEdit' + user.id}"
                                                                   class="fw-bold align-self-center">ID</label>
                                                            <input type="text" id="${'idEdit' + user.id}"
                                                                   value=${user.id}
                                                                   name="id"
                                                                   class="rounded p-1 border-1  mb-2 p-1" disabled>
                                                            <label for="${'firstNameEdit' + user.id}"
                                                                   class="fw-bold align-self-center">First name</label>
                                                            <input type="text" id="${'firstNameEdit' + user.id}"
                                                                   value=${user.firstName}
                                                                   name="firstName"
                                                                   class="rounded p-1 border-1  mb-2 p-1">
                                                            <label for="${'lastNameEdit' + user.id}"
                                                                   class="fw-bold align-self-center">Last name</label>
                                                            <input type="text" id="${'lastNameEdit' + user.id}"
                                                                   value=${user.lastName}
                                                                   name="lastName"
                                                                   class="rounded p-1 border-1  mb-2 p-1">
                                                            <label for="ageEdit + ${user.id}"
                                                                   class="fw-bold align-self-center">Age</label>
                                                            <input type="number" id="ageEdit + ${user.id}"
                                                                   value=${user.age}
                                                                   name="age"
                                                                   class="rounded p-1 border-1  mb-2 p-1">
                                                            <label for="emailEdit + ${user.id}"
                                                                   class="fw-bold align-self-center">Email</label>
                                                            <input type="email" id="emailEdit + ${user.id}"
                                                                   value=${user.email}
                                                                   name="email"
                                                                   class="rounded p-1 border-1 mb-2 p-1">
                                                            <label for="passwordEdit + ${user.id}"
                                                                   class="fw-bold align-self-center">Password</label>
                                                            <input type="password"
                                                                   id="passwordEdit + ${user.id}"
                                                                   class="rounded p-1 border-1  mb-2 p-1"
                                                                   name="password"
                                                            >
                                                            <label for="rolesEdit + ${user.id}"
                                                                   class="fw-bold align-self-center">Role</label>
                                                            <select name="roles" id=${'rolesEdit' + user.id}
                                                                    multiple
                                                                    class="mb-2 ps-2" size="2">
                                                                ${allRolesListHelper('rolesEdit' + user.id, user)}
                                                            </select>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary"
                                                            data-bs-dismiss="modal">
                                                        Close
                                                    </button>
                                                    <button type="submit" class="btn btn-primary">Edit</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal fade" id=${'deleteModal' + user.id} tabindex="-1"
                                     aria-labelledby="deleteModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="deleteModalLabel">Delete user</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                        aria-label="Закрыть"></button>
                                            </div>
                                            <div class="modal-body">
                                                <form method="GET"
                                                      action="/admin/delete?id=${user.id}"
                                                      class="col-6 d-flex flex-column justify-content-center align-content-center">
                                                    <div>
                                                        <div class="pt-4 bg-white p-3 d-flex justify-content-center flex-column">

                                                            <label for="'idDelete' + ${user.id}"
                                                                   class="fw-bold align-self-center">ID</label>
                                                            <input type="text" id="'idDelete' + ${user.id}"
                                                                   value=${user.id}
                                                                   class="rounded p-1 border-1  mb-2 p-1" disabled>
                                                            <label for="'firstNameDelete' + ${user.id}"
                                                                   class="fw-bold align-self-center">First name</label>
                                                            <input type="text"
                                                                   id="'firstNameDelete' + ${user.id}"
                                                                   value=${user.firstName}
                                                                   class="rounded p-1 border-1  mb-2 p-1" disabled>
                                                            <label for="'lastNameDelete' + ${user.id}"
                                                                   class="fw-bold align-self-center">Last name</label>
                                                            <input type="text"
                                                                   id="'lastNameDelete' + ${user.id}"
                                                                   value=${user.lastName}
                                                                   class="rounded p-1 border-1  mb-2 p-1 " disabled>
                                                            <label for="'ageDelete' + ${user.id}"
                                                                   class="fw-bold align-self-center">Age</label>
                                                            <input type="number" id="'ageDelete' + ${user.id}"
                                                                   value=${user.age}
                                                                   class="rounded p-1 border-1  mb-2 p-1" disabled>
                                                            <label for="'emailDelete' + ${user.id}"
                                                                   class="fw-bold align-self-center">Email</label>
                                                            <input type="email" id="'emailDelete' + ${user.id}"
                                                                   value=${user.email}
                                                                   class="rounded p-1 border-1  mb-2 p-1" disabled>
                                                            <label for="'roleDelete' + ${user.id}"
                                                                   class="fw-bold align-self-center">Role</label>
                                                            <select name="roles" id=${'roleDelete' + user.id}
                                                                    multiple
                                                                    class="mb-2 ps-2" size="2" disabled>
                                                                ${allRolesListHelper( 'roleDelete' + user.id, user, true)}
                                                            </select>

                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                                    Close
                                                </button> 
                                                    <button type="submit" class="btn btn-danger">Delete</button>
                                            
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </tr>`
    })
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


                            <button type="submit" th:value="Add"
                                    class="fs-5 border-0 bg-success text-white w-50 align-self-center rounded p-2">Add
                                new user
                            </button>`
}
getUsersData();
