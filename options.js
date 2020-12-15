const domArray = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'label', 'span', 'li'];
let currentArray = [];
window.onload = () => {
    chrome.storage.sync.get("domArray", function(res) {
        const arrayData = res.domArray ? res.domArray : domArray;
        currentArray = arrayData;
        for (let i = 0; i < arrayData.length; i++) {
            const element = arrayData[i];
            const newCheck = $('<div></div>').addClass('checkbox-element mx-3').html(
                `<input type="checkbox" class="dom-check" id="check_${element}"><label for="check_${element}" class="ml-2">${element}</label>`
            );
            $('.checkbox-container').append(newCheck);
        }
    });

    chrome.storage.sync.get("colorSet", function(res) {
        const colorSet = res.colorSet ? res.colorSet : [];
        for (let i = 0; i <= 25; i++) {
            const newPair = $('<div></div>').addClass('one-row').html(`<label class="common-cell" id="label_${i}">${String.fromCharCode(i + 65)}</label>`);
            newPair.append($('<input>').addClass('common-cell').attr({ 'id': `check_${i}`, 'type': 'checkbox', 'checked': colorSet[i] ? colorSet[i].on : false }));
            newPair.append($('<input>').addClass('common-cell').attr({ 'id': `color_${i}`, 'type': 'color', 'value': colorSet[i] ? colorSet[i].color : '#000000' }));
            $('.letter-color-pair').append(newPair);
        }
    });

    chrome.storage.sync.get("colorizableDOMs", function(res) {
        if (res.colorizableDOMs) {
            for (let i = 0; i < res.colorizableDOMs.length; i++) {
                const element = res.colorizableDOMs[i];
                $(`#check_${element}`).attr('checked', true);
            }
        }
    });

    $('.save-btn').on('click', function() {
        const colorizableDOMs = [];
        for (let i = 0; i < $('.dom-check').length; i++) {
            const element = $('.dom-check')[i];
            if (element.checked) {
                colorizableDOMs.push(element.id.split('_')[1]);
            }
        }
        const colorSet = [];
        for (let i = 0; i <= 25; i++) {
            colorSet.push({ on: $(`#check_${i}`)[0].checked, color: $(`#color_${i}`).val() });
        }
        chrome.storage.sync.set({ colorizableDOMs, colorSet }, function() {
            console.log("stored colorizableDOMs--", colorizableDOMs)
            console.log("stored colorSet--", colorSet)
            chrome.tabs.getAllInWindow(null, function(tabs) {
                for (let i = 0; i < tabs.length; i++) {
                    chrome.tabs.sendMessage(tabs[i].id, { message: "dom_changed" });
                }
            });
        });
    });

    $('.DOM-input').on('keypress', function(evt) {
        if (evt.key == 'Enter') {
            const element = $('.DOM-input').val();
            currentArray.push(element);
            chrome.storage.sync.set({ domArray: currentArray }, function() {
                const newCheck = $('<div></div>').addClass('checkbox-element').html(
                    `<input type="checkbox" class="dom-check" id="check_${element}"><label for="check_${element}" class="ml-2">${element}</label>`
                );
                $('.checkbox-container').append(newCheck);
                $('.DOM-input').val('');
            });
        }
    });

    $('#add_btn').on('click', function() {
        const element = $('.DOM-input').val();
        currentArray.push(element);
        chrome.storage.sync.set({ domArray: currentArray }, function() {
            const newCheck = $('<div></div>').addClass('checkbox-element').html(
                `<input type="checkbox" class="dom-check" id="check_${element}"><label for="check_${element}" class="ml-2">${element}</label>`
            );
            $('.checkbox-container').append(newCheck);
            $('.DOM-input').val('');
        });
    });

}