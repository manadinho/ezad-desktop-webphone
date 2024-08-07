const { app, BrowserWindow, ipcMain, systemPreferences } = require("electron");

let mainWindow;

async function createWindow() {
  app.setName("EZ AD Webphone");

  const hasMicrophoneAccess = await systemPreferences.askForMediaAccess('microphone');
  if (!hasMicrophoneAccess) {
    alert('Microphone access denied. Exiting app.');
    app.quit();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 345,
    height: 605,
    icon: __dirname + "/assets/images/pbx.icns",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
    fullscreenable: false,
  });

  mainWindow.loadURL("file://" + __dirname + "/index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  ipcMain.on("onIncomingCall", (event, phoneNumber) => {
    mainWindow.show();
  });
}

app.whenReady().then(createWindow);

// Ensure the app is the default client for 'tel' links
app.setAsDefaultProtocolClient("tel");

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("open-url", (event, url) => {
  event.preventDefault();
  const phoneNumber = url.split(":")[1];
  mainWindow.webContents.send("phone-number", phoneNumber);
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
});
