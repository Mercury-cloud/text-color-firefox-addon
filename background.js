chrome.runtime.onInstalled.addListener(function() {
    const colorSet = [];
    for (let i = 0; i <= 25; i++) {
        colorSet.push({ on: false, color: '#000000' });
    }
    chrome.storage.sync.set({ toggle: "on", color: "#000000", colorSet }, function() {
        console.log("storage initialized!");
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "status_changed" });
        });
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("message received in the background script!");
    return true;
});