const adminUsersUrl = '/admin/api/users';
const adminRolesUrl = '/admin/api/roles';
const adminGetUser = '/admin/api/user';

const getUsersData = async () => {
    const response = await fetch(adminUsersUrl);
    const {currentUser, allUsers} = await response.json();
    await getCurrentUserInfo(currentUser);
    await createTableUsersData(allUsers);
    getAllUsersInfo(allUsers, currentUser);
   // document.querySelectorAll("#divModal").forEach(elem => document.body.removeChild(elem));
   // document.querySelectorAll("#tdModal").forEach(elem => document.body.removeChild(elem));
}

const getRolesData = async () => {
    const response = await fetch(adminRolesUrl);
    return await response.json();
}

const getCurrentUserInfo = (currentUser) => {
    document.getElementById("currentUserEmail").innerText = currentUser.email + " " + document.getElementById("currentUserEmail").innerText;
    document.getElementById("currentUserRoles").innerText = currentUser.roles.map(role => role.name.replace("ROLE_", "")).join(" ");
}

const getAllUsersInfo =  (allUsers, currentUser) => {
    allUsers.forEach(user => {
        document.getElementById("allUsersNavItem").innerHTML += currentUser.id === user.id ? `
            <li class="nav-item mb-0" >
<a class="nav-link active" aria-current="page"  href=/admin/users?id=${user.id}> ${user.firstName} <a/><li>` :
            `<li class="nav-item mb-0" ><a class="nav-link"
                   aria-current="page" href=/admin/users?id=${user.id}>${user.firstName}</a></li>`
    })
}

const allRolesListHelper = async (parentId = "", user = null, deleteMode = false) => {
    document.getElementById(parentId).innerHTML = "";

    let allRoles = await getRolesData();

    const prepareRoles = allRoles.map(role => {
        let isSelected = false;
        if (user) {
            isSelected = user.roles.map(elem => elem.name).includes(role.name) && !deleteMode;
        }

        return isSelected ? `<option selected value=${role.id}><span>${role.name.replace("ROLE_", "")} </span></option>`
            : `<option value=${role.id}><span>${role.name.replace("ROLE_", "")} </span></option>`

    })
    prepareRoles.map(role => document.getElementById(parentId).innerHTML += role)
}


const createTableUsersData = (allUsers) => {
    const tableUsersData = document.getElementById("tableUsersData");
    tableUsersData.innerHTML = `
     <tr class="border-top lh-lg">
                                <th class="ps-3">Id</th>
                                <th>First name</th>
                                <th>Last Name</th>
                                <th>Age</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>`
    allUsers.forEach((user, index) => {

        return tableUsersData.innerHTML += `
<tr id="tr"
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
                                    onClick=${openEditModal(user.id)}
                                    data-bs-toggle="modal" 
                                    data-bs-target=${'#editModal' + user.id}>
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button class="bg-danger text-white border-0 rounded"
                                     type="submit"
                                     onclick=${openDeleteModal(user.id)}
                                     data-bs-toggle="modal"
                                     data-bs-target=${'#deleteModal' + user.id}>
                                        Delete
                                     </button>
                                </td>
                            </tr>`

    })

}

const openDeleteModal = async (id) => {
    const td = document.createElement("td");
    td.id = "tdModal";
    const response = await fetch(adminGetUser +"/" + id)
    const user = await response.json();
    const modal = document.getElementById('deleteModal' + user.id);
    if (modal) {
        const inputs = modal.querySelectorAll("input");
         modal.querySelectorAll("select")[0].setAttribute("disabled", "disabled");
        [...inputs].map(input => input.setAttribute("disabled", "disabled"))
    }
    td.innerHTML =   createModalHelper(user, "delete");
    document.body.appendChild(td);

    await allRolesListHelper("roleDelete" + user.id, user)
}

const openEditModal = async (id) => {
    const response = await fetch(adminGetUser +"/" + id)
    const user = await response.json();
    const td = document.createElement("td");
    td.id = "tdModal";
    td.innerHTML = createModalHelper(user, "edit");
    document.body.append(td);
    await allRolesListHelper("roleEdit" + user.id, user);
}

const createModalHelper =   (user, mode = "edit") =>

      `<div class="modal fade" id=${mode === "edit" ? 'editModal' + user.id : 'deleteModal' + user.id} tabindex="-1"
                                     aria-labelledby=${mode === "edit" ? 'editModalLabel' : 'deleteModalLabel'} aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id=${mode === "edit" ? 'editModalLabel' : 'deleteModalLabel'}>${mode === "edit" ? 'Edit user' : 'Delete user'}</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" id="close"
                                                        aria-label="Закрыть"></button>
                                            </div>
                                            <div class="modal-body d-flex justify-content-center">
                                                <form  
                                                      id=${mode + user.id}  
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
                                                                   name="firstName"
                                                                   class="rounded p-1 border-1  mb-2 p-1"
                                                                  
                                                                   >
                                                            <label for=${mode === "edit" ? 'lastNameEdit' + user.id : 'lastNameDelete' + user.id}
                                                                   class="fw-bold align-self-center">Last name</label>
                                                            <input type="text"
                                                                   id=${mode === "edit" ? 'lastNameEdit' + user.id : 'lastNameDelete' + user.id}
                                                                   value=${user.lastName}
                                                                    name="lastName"
                                                                   class="rounded p-1 border-1  mb-2 p-1"
                                                                   
                                                                   >
                                                            <label for=${mode === "edit" ? 'ageEdit' + user.id : 'ageDelete' + user.id}
                                                                   class="fw-bold align-self-center">Age</label>
                                                            <input type="number" id=${mode === "edit" ? 'ageEdit' + user.id : 'ageDelete' + user.id}
                                                                   value=${user.age}
                                                                   name="age"
                                                                   class="rounded p-1 border-1  mb-2 p-1"
                                                                 
                                                                   >
                                                            <label for=${mode === "edit" ? 'emailEdit' + user.id : 'emailDelete' + user.id}
                                                                   class="fw-bold align-self-center">Email</label>
                                                            <input type="email" id=${mode === "edit" ? 'emailEdit' + user.id : 'emailDelete' + user.id}
                                                                   value=${user.email}
                                                                   name="email"
                                                                   class="rounded p-1 border-1  mb-2 p-1">
                                                                   <label for=${mode === "edit" ? 'passwordEdit' + user.id : 'passwordDelete' + user.id}
                                                                   class="fw-bold align-self-center">Password</label>
                                                            <input type="password" id=${mode === "edit" ? 'passwordEdit' + user.id : 'passwordDelete' + user.id}
                                                                  
                                                                   name="password"
                                                                   class="rounded p-1 border-1  mb-2 p-1">
                                                            <label for=${mode === "edit" ? 'roleEdit' + user.id : 'roleDelete' + user.id}
                                                                   class="fw-bold align-self-center">Role</label>
                                                            <select name="roles" id=${mode === "edit" ? 'roleEdit' + user.id : 'roleDelete' + user.id}
                                                                    multiple
                                                                  
                                                                    class="mb-2 ps-2" size="2">
                                                            </select>

                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id=${'closeButton' + mode + user.id}>
                                                    Close
                                                </button> 
                                                    ${mode === "edit" ?
        `<button type="submit" class="btn btn-primary"  onClick="updateUser(${user.id})" data-value=${user.id}>Edit</button>` :
        `<button type="submit" class="btn btn-danger" onClick="deleteUser(${user.id})"  data-value=${user.id}>Delete</button>`}
                                           
                                            </div>
                                        </div>`



const deleteUser = async (id) =>  {


    document.getElementById("tableUsersData").innerText = "";
    document.getElementById("allUsersNavItem").innerText = "";
    document.getElementById("currentUserEmail").innerText = "";
    document.getElementById(`closeButton` + "delete" + id).click();
    await fetch(adminUsersUrl + "?id=" + id, {
        method:"DELETE",
        headers: {
            'content-type': 'application/json'
        },
    })


    await getUsersData();

}

const  updateUser = async (id) =>    {

    const form = document.getElementById(`edit${id}`);
    const formData = new FormData(form);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const password = formData.get('password');
    const age = formData.get('age');
    const email = formData.get('email');

    let roles = formData.getAll("roles");
    const listRole = []
    roles.map(role => {
        listRole.push({id: role})
    })
    document.getElementById("tableUsersData").innerHTML = "";
    document.getElementById("allUsersNavItem").innerHTML = "";
    document.getElementById("currentUserEmail").innerText = "";

    document.getElementById(`closeButtonedit` + id).click();
    await fetch(adminUsersUrl +"?id=" + id, {
        method:"PATCH",
        body: JSON.stringify({firstName, lastName, age,email, password,roles:listRole}),
        headers: {
            'content-type': 'application/json'
        },
    })
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
    document.getElementById("tableUsersData").innerHTML = "";
    document.getElementById("allUsersNavItem").innerHTML = "";
    document.querySelectorAll("#divModal").forEach(elem => document.body.removeChild(elem));
    document.querySelectorAll("#tdModal").forEach(elem => document.body.removeChild(elem));
    document.getElementById("adminPanel-tab").click();


    await getUsersData();
}

const createUserFormHelper = async () => {

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
                                
                            </select>

                            <button type="button" th:value="Add" onclick="createNewUser()"
                                    class="fs-5 border-0 bg-success text-white w-50 align-self-center rounded p-2">Add
                                new user
                            </button>`
    await  allRolesListHelper("roles");
    document.querySelectorAll("#divModal").forEach(elem => document.body.removeChild(elem));
    document.querySelectorAll("#tdModal").forEach(elem => document.body.removeChild(elem));
}
getUsersData();
