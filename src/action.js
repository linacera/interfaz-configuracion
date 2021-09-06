const { remote, ipcRenderer } = require('electron');
const mainProcces = remote.require('./index');

const tableBody = document.getElementById('action-table-body');
const createAction = document.getElementById('create-action');
const idDevice = document.getElementById('device-id');

ipcRenderer.on('loaded-actions', (event, actions, device_id)=>{
    idDevice.id = device_id;
    if(actions.length > 0){
        actions.forEach(action => {
            let tr = document.createElement('tr');
            let tdActionName = document.createElement('td');
            tdActionName.textContent = action.dataValues.action_name;
            let tdActionID = document.createElement('td');
            tdActionID.textContent = action.dataValues.action_id;
            let tdButtonDeleteAction = document.createElement('td');
            let buttonDeleteAction  = document.createElement('button');
            buttonDeleteAction.className = "no-background-button";
            buttonDeleteAction.addEventListener('click',() => {
                ipcRenderer.send('delete-action', action.dataValues.action_id);
                tr.remove()
            })
            let img = document.createElement('img');
            img.src="../icons/trash.svg";
            buttonDeleteAction.appendChild(img);
            tdButtonDeleteAction.appendChild(buttonDeleteAction);
            tr.appendChild(tdActionID);
            tr.appendChild(tdActionName);
            tr.appendChild(tdButtonDeleteAction);
            tableBody.appendChild(tr);
        });
    }
    
})

createAction.addEventListener('click', ()=>{
    
    let actionNameInput = document.getElementById('action_name');
    if(actionNameInput.value != ""){
        ipcRenderer.send('create-action',actionNameInput.value, idDevice.id);
        var window = remote.getCurrentWindow();
        window.reload();
    }
})
