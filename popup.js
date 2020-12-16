// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

window.onload = () => {
    browser.storage.sync.get('textColor', function(res) {
        if (res.textColor) $('#color-picker').val(res.textColor);
    });
}

browser.storage.sync.get("toggle", function(data) {
    var state = data.toggle == "on" ? true : false;
    $("#toggle-trigger").prop("checked", state).change();
});

$("#toggle-trigger").change(function() {
    var state = $(this).prop("checked") == true ? "on" : "off";
    browser.storage.sync.set({ toggle: state }, function() {
        console.log("Switch: " + state);
        browser.tabs.query({ currentWindow: true }, function(tabs) {
            for (let i = 0; i < tabs.length; i++) {
                browser.tabs.sendMessage(tabs[i].id, { message: "status_changed" });
            }
        });
        // browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        //     browser.tabs.sendMessage(tabs[0].id, { message: "status_changed" });
        // });
    });
});

$('#color-picker').change(function() {
    const color = $(this).val();
    browser.storage.sync.set({ textColor: color }, function() {
        console.log("Color: " + color);
        $(this).val(color);
        browser.tabs.query({ currentWindow: true }, function(tabs) {
            for (let i = 0; i < tabs.length; i++) {
                browser.tabs.sendMessage(tabs[i].id, { message: "color_changed" });
            }
        });
        // browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        //     browser.tabs.sendMessage(tabs[0].id, { message: "color_changed" });
        // });
    });
});