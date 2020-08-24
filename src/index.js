const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Room = require('./models/room');
const Device = require('./models/device');
const Action = require('./models/action');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, './views/index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-finish-load', async () => {
    rooms = await getRooms();
  //  console.log(rooms);
    mainWindow.webContents.send('loaded-rooms', rooms);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('clicked-room',(event, idRoom) => {
  console.log("En ipcMain clicked: "+idRoom);
})

ipcMain.on('create-room',(event) => {
  //console.log("En ipcMain create roome:");
  const createWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  createWindow.loadFile(path.join(__dirname, './views/create.html'));

  // Open the DevTools.
  createWindow.webContents.openDevTools();

/*  createWindow.webContents.on('did-finish-load', async () => {
    rooms = await getRooms();
    console.log(rooms);
    createWindow.webContents.send('loaded-rooms', rooms);
  });*/

})

async function createRoom(room_name){
  await Room.create({ room_name: room_name });
}

async function deleteRoom(room_id){

}

async function getRooms(){
  let rooms = [];
  try {
  //  console.log('In get rooms');
    rooms = await Room.findAll({attributes: ['room_id', 'room_name']});
    return rooms;
  } catch (error) {
    console.log(error)
  }
}


async function getDevices (room_id) {
  let devices = [];
  try {
    //console.log('In get devices');
    devices = await Device.findAll(
      {
        where: {room_id: room_id}
      });
  //  console.log(devices);
    return devices;
  } catch (error) {
    console.log(error)
  }
}

async function getActions(device_id){
  try {
    //console.log('In get actions');
    actions = await Action.findAll(
      {
        where: {device_id: device_id}
      });
   // console.log(actions);
    return actions;
  } catch (error) {
    console.log(error)
  }
}