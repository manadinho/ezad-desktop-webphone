const { ipcRenderer } = require("electron");

window.addEventListener("message", (event) => {
  // handle incoming call event
  if (event.data.action === "onIncomingCall") {
    ipcRenderer.send("onIncomingCall", event.data.data);
  }
});

ipcRenderer.on("phone-number", (event, phoneNumber) => {
  const iframe = document.querySelector("#ezad-softphone-iframe");
  iframe.contentWindow.postMessage(
    { action: "doDial", data: { phoneNumber } },
    "*"
  );
});
