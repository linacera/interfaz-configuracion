const { remote, ipcRenderer } = require('electron');
const mainProcces = remote.require('./index');

const tableBody = document.getElementById('room-table-body');
const createRoom = document.getElementById('create-room');
const currentWindow = remote.getCurrentWindow();

ipcRenderer.on('loaded-rooms', (event, rooms)=>{
    rooms.forEach(room => {
        let tr = document.createElement('tr');
        let tdRoomName = document.createElement('td');
        tdRoomName.textContent = room.dataValues.room_name;
        let tdRoomID = document.createElement('td');
        tdRoomID.textContent = room.dataValues.room_id;
        let tdRoomDevices = document.createElement('td');
        let buttonRoomDevices = document.createElement('button');
        buttonRoomDevices.className = "no-background-button";
        buttonRoomDevices.addEventListener('click',() => {
            ipcRenderer.send('see-room-devices', room.dataValues.room_id);
            currentWindow.reload();
        });  
        let imgOpen = document.createElement('img');
        imgOpen.src="../icons/box-arrow-right.svg";  
        buttonRoomDevices.append(imgOpen);
        let tdButtonDeleteRoom = document.createElement('td');
        let buttonDeleteRoom  = document.createElement('button');
        buttonDeleteRoom.className = "no-background-button";
        buttonDeleteRoom.addEventListener('click',() => {
            ipcRenderer.send('delete-room', room.dataValues.room_id);
        })
        let imgDelete = document.createElement('img');
        imgDelete.src="../icons/trash.svg";
        buttonDeleteRoom.appendChild(imgDelete);
        tdButtonDeleteRoom.appendChild(buttonDeleteRoom);
        tdRoomDevices.appendChild(buttonRoomDevices);
        tr.appendChild(tdRoomID);
        tr.appendChild(tdRoomName);
        tr.appendChild(tdRoomDevices);
        tr.appendChild(tdButtonDeleteRoom);
        tableBody.appendChild(tr);
    });
})

createRoom.addEventListener('click', ()=>{
    let roomNameInput = document.getElementById('room_name');
    if(roomNameInput.value != ""){
        ipcRenderer.send('create-room',roomNameInput.value );
        currentWindow.reload();
    }
    
})
