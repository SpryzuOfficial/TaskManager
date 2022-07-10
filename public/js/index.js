const url = (window.location.hostname.includes('localhost'))
                ? 'http://localhost:8080'
                : 'http://localhost:8080'; // <-- Web server url

const signupDiv = document.getElementById('signupDiv');
const loginDiv = document.getElementById('loginDiv');

const errorMsgSg = document.getElementById('errorMsg-sg');
const usernameTextSg = document.getElementById('usernameText-sg');
const emailTextSg = document.getElementById('emailText-sg');
const passwordTextSg = document.getElementById('passwordText-sg');
const cPasswordTextSg = document.getElementById('cpasswordText-sg');

const errorMsgLg = document.getElementById('errorMsg-lg');
const userTextLg = document.getElementById('userText-lg');
const passwordTextLg = document.getElementById('passwordText-lg');

const tasksCardDiv = document.getElementById('tasksCardDiv');
const tasksList = document.getElementById('tasksList');

const taskErrorMsg = document.getElementById('errorTaskMsg');
const taskNameText = document.getElementById('taskNameText');
const taskDescriptionText = document.getElementById('taskDescriptionText');

const addTaskButton = document.getElementById('addTaskButton');

const saveTaskButton = document.getElementById('saveTaskButton');
saveTaskButton.disabled = true;

const forumStyle = "forumCard";
const tasksStyle = "tasksCard";

let editing = false;
let elementEditing;

const hideDiv = (div) =>
{
    const childrenList = div.children;
    for(let i = 0; i < childrenList.length; i++)
    {
        childrenList.item(i).hidden = true;
    }
    div.className = "divHide";
}

const showDiv = (div, className) =>
{
    const childrenList = div.children;
    for(let i = 0; i < childrenList.length; i++)
    {
        if(childrenList.item(i).tagName !== 'P')
        {
            childrenList.item(i).hidden = false;
        }
    }
    div.className = className;
}

const loadTasks = () =>
{
    fetch(url + '/tasks', 
        {
            method: 'GET', 
            headers: new Headers({
                'Content-Type': 'application/json',
                'user-email': localStorage.getItem('user')
            })
        })
        .then(response => response.json())
        .then(response =>
        {
            if(response.ok)
            {
                response.tasks.forEach(element => 
                {
                    appendTask(element.name, element.description, element.done, element._id);
                });
            }
        })
        .catch(console.warn);
}

const appendTask = (nameValue, descValue, check, id) =>
{
    const newTask = document.createElement('li');
    const checkbox = document.createElement('input');
    const taskName = document.createElement('span');
    const deleteButton = document.createElement('button');
    const taskDesc = document.createElement('span');

    checkbox.type = 'checkbox';
    checkbox.addEventListener('click', checkTask);
    checkbox.checked = check;

    taskName.innerHTML = nameValue;
    taskDesc.innerHTML = descValue;

    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', deleteTask);

    newTask.id = id;
    newTask.addEventListener('click', selectTask);
    newTask.className = 'unselectedItem';
    newTask.appendChild(checkbox);
    newTask.appendChild(taskName);
    newTask.appendChild(deleteButton);
    newTask.appendChild(taskDesc);

    tasksList.appendChild(newTask);
}

if(localStorage.getItem('user'))
{
    hideDiv(loginDiv);
    hideDiv(signupDiv);
    
    showDiv(tasksCardDiv, tasksStyle);

    loadTasks();
}

const addTask = () =>
{
    const nameValue = taskNameText.value;
    const descValue = taskDescriptionText.value;

    const payload = {
        name: nameValue,
        description: descValue
    };

    fetch(url + '/tasks/add',
        {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'user-email': localStorage.getItem('user')
            }),
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(response =>
        {
            if(response.errors)
            {
                taskErrorMsg.innerHTML = response.errors[0].msg;
                taskErrorMsg.hidden = false;
            }
            else
            {
                if(!response.ok)
                {
                    taskErrorMsg.innerHTML = response.msg;
                    taskErrorMsg.hidden = false;
                }
                else
                {
                    taskErrorMsg.hidden = true;

                    response.user.tasks.forEach(element =>
                    {
                        if(element.name === nameValue)
                        {
                            appendTask(nameValue, descValue, false, element._id);
                        } 
                    });
    
                    taskNameText.value = '';
                    taskDescriptionText.value = '';
                }
            }
        })
        .catch(console.warn);
}

const deleteTask = (e) =>
{
    if(editing) return;
    
    const task = e.target.parentElement;

    const taskName = task.children.item(1).innerHTML;

    if(confirm(`Task ${taskName} will be deleted, are you sure?`))
    {
        const payload = {id: task.id};

        fetch(url + '/tasks/delete',
        {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'user-email': localStorage.getItem('user')
            }),
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(response =>
        {
            tasksList.removeChild(task);
        })
        .catch(console.warn);
    }
}

const selectTask = (e) =>
{
    if(e.target.tagName !== 'LI') return;

    const nameValue = e.target.children.item(1).innerHTML;
    const descValue = e.target.children.item(3).innerHTML;

    if(elementEditing)
    {
        if(e.target == elementEditing)
        {
            editing = !editing;
        }
        else
        {
            elementEditing.className = 'unselectedItem';
            e.target.className = 'selectedItem';
            elementEditing = e.target;
        }
    }
    else
    {
        editing = !editing;
    }

    if(editing)
    {
        elementEditing = e.target;

        taskNameText.value = nameValue;
        taskDescriptionText.value = descValue;

        addTaskButton.disabled = true;
        saveTaskButton.disabled = false;

        e.target.className = 'selectedItem';
    }
    else
    {
        elementEditing = undefined;

        taskNameText.value = '';
        taskDescriptionText.value = '';

        addTaskButton.disabled = false;
        saveTaskButton.disabled = true;

        e.target.className = 'unselectedItem';
    }
}

const editTask = (e) =>
{
    if(!elementEditing) return;

    const payload = {id: elementEditing.id, name: taskNameText.value, description: taskDescriptionText.value};

    fetch(url + '/tasks/edit',
        {
            method: 'PUT',
            headers: new Headers({
                'Content-Type': 'application/json',
                'user-email': localStorage.getItem('user')
            }),
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(response =>
        {
            elementEditing.children.item(1).innerHTML = taskNameText.value;
            elementEditing.children.item(3).innerHTML = taskDescriptionText.value;

            addTaskButton.disabled = false;
            saveTaskButton.disabled = true;

            taskNameText.value = '';
            taskDescriptionText.value = '';

            elementEditing.className = 'unselectedItem';
            editing = !editing;
            elementEditing = undefined;
        })
        .catch(console.warn);
}

const checkTask = (e) =>
{
    const id = e.target.parentElement.id;

    const payload = {id};

    fetch(url + '/tasks/check',
        {
            method: 'PUT',
            headers: new Headers({
                'Content-Type': 'application/json',
                'user-email': localStorage.getItem('user')
            }),
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(response =>
        {
            console.log(response);
        })
        .catch(console.warn);
}

const login = () =>
{   
    const payload = {username: userTextLg.value, email: userTextLg.value, password: passwordTextLg.value};

    fetch(url + '/users/login',
        {
            method: 'POST', 
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(response =>
        {
            if(response.errors)
            {
                errorMsgLg.innerHTML = response.errors[0].msg;
                errorMsgLg.hidden = false;
            }
            else
            {
                if(response.ok)
                {
                    hideDiv(loginDiv);
                    showDiv(tasksCardDiv, tasksStyle);
                    userMail = response.user.email;

                    localStorage.removeItem('user');
                    localStorage.setItem('user', response.user.email);

                    tasksList.innerHTML = '';

                    loadTasks();
                }
                else if(response.msg)
                {
                    errorMsgLg.innerHTML = response.msg;
                    errorMsgLg.hidden = false;
                }
                else
                {
                    errorMsgLg.hidden = true;
                }
            }
        })
        .catch(console.warn);
}

const signup = () =>
{
    if(passwordTextSg.value !== cPasswordTextSg.value)
    {
        errorMsgSg.innerHTML = 'Passwords not match';
        errorMsgSg.hidden = false;

        return;
    }

    const payload = {username: usernameTextSg.value, email: emailTextSg.value, password: passwordTextSg.value};

    fetch(url + '/users', 
        {
            method: 'POST', 
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(response =>
        {
            if(response.errors)
            {
                errorMsgSg.innerHTML = response.errors[0].msg;
                errorMsgSg.hidden = false;
            }
            else
            {
                if(response.ok)
                {
                    hideDiv(signupDiv);
                    showDiv(tasksCardDiv, tasksStyle);
                    localStorage.removeItem('user');
                    localStorage.setItem('user', response.user.email);
                }
                else if(response.msg)
                {
                    errorMsgSg.innerHTML = response.msg;
                    errorMsgSg.hidden = false;
                }
                else
                {
                    errorMsgSg.hidden = true;
                }
            }
        })
        .catch(console.warn);
}

const loginPage = () =>
{
    tasksList.innerHTML = '';
    hideDiv(tasksCardDiv);
    hideDiv(signupDiv);

    showDiv(loginDiv, forumStyle);
}

const signupPage = () =>
{
    tasksList.innerHTML = '';
    hideDiv(tasksCardDiv);
    hideDiv(loginDiv);

    showDiv(signupDiv, forumStyle);
}