browser.runtime.onInstalled.addListener(function() {
    const colorSet = [];
    for (let i = 0; i <= 25; i++) {
        colorSet.push({ on: false, color: '#000000' });
    }
    browser.storage.sync.set({ toggle: "on", color: "#000000", colorSet }, function() {
        console.log("storage initialized!");
        browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            browser.tabs.sendMessage(tabs[0].id, { message: "status_changed" });
        });
    });
});

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("message received in the background script!");
    return true;
});