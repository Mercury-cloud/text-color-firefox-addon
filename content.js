// Content Script
// Last Update: 2020/12/08

class ColorizeText {
    constructor() {
        this.listenStatus();
        this.init();
    }
    listenStatus() {
        chrome.runtime.onMessage.addListener((request, sender) => {
            console.log(
                "Contentscript has received a message from from popup script: '" +
                request.message +
                "'"
            );
            // this.onChangeColor();
            this.onChangeColorSet();
        });
    }
    init() {
        console.log("ColorizeText class has been initialized.");
        // this.onChangeColor();
        this.onChangeColorSet();
    }

    //start
    // change color
    async onChangeColorSet() {
        // const color = await this.getColor();
        const colorSet = await this.getColorSet();
        const status = await this.getState();
        if (status === "on") {
            console.log("enable colorize------");
            this.colorizeText(colorSet);
        } else {
            console.log("disable colorize------");
            this.disableColorize();
        }
    }

    // colorize Text
    async colorizeText(colorSet) {
        const colorizeTags = await this.getTags();
        [...colorizeTags].forEach((tagName) => {
            const tags = document.getElementsByTagName(tagName);
            [...tags].forEach((element) => {
                // element.children.length !== 0 ||
                if ((tagName == 'font' && element.classList.contains("added-span-extension-123456789"))) return;
                if (element.innerHTML) {
                    const htmlStr = element.innerHTML;
                    const array1 = htmlStr.split('<');
                    const resultArray1 = [];
                    array1.forEach((eachStr1, index) => {
                        const array2 = eachStr1.split('>');
                        const resultArray2 = [];
                        resultArray2.push(array2[0]);
                        for (let i = 1; i < array2.length; i++) {
                            const eachStr2 = array2[i];
                            const updateArray = [];
                            for (let j = 0; j < eachStr2.length; j++) {
                                updateArray[j] = null;
                                [...colorSet].forEach((colorObj, index) => {
                                    if (colorObj.on) {
                                        const upperLetter = String.fromCharCode(index + 65);
                                        const lowerLetter = upperLetter.toLowerCase();
                                        const color = colorObj.color;
                                        if (eachStr2[j] === upperLetter) {
                                            updateArray[j] = { letter: upperLetter, color };
                                        } else if (eachStr2[j] === lowerLetter) {
                                            updateArray[j] = { letter: lowerLetter, color };
                                        }
                                    }
                                });
                            }
                            let resultStr2 = '';
                            for (let j = 0; j < eachStr2.length; j++) {
                                if (updateArray[j]) {
                                    resultStr2 += `<font class="added-span-extension-123456789" style="color: ${updateArray[j].color};">${updateArray[j].letter}</font>`;
                                } else {
                                    resultStr2 += eachStr2[j];
                                }
                            }
                            resultArray2.push(resultStr2);
                        }
                        const resultStr1 = resultArray2.join('>');
                        resultArray1.push(resultStr1);
                    })
                    element.innerHTML = resultArray1.join('<');
                }
            })
        })
    }

    // disable Colorize
    async disableColorize() {
        // const colorizeTags = await this.getTags();
        $('.added-span-extension-123456789').css('color', '');
    }

    // colorize Text
    // async colorizeText(color) {
    //     const colorizeTags = await this.getTags();
    //     for (let i = 0; i < colorizeTags.length; i++) {
    //         const element = colorizeTags[i];
    //         $(element).css('color', color);
    //     }
    // }

    // disable Colorize
    // async disableColorize() {
    //     const colorizeTags = await this.getTags();

    //     for (let i = 0; i < colorizeTags.length; i++) {
    //         const element = colorizeTags[i];
    //         $(element).css('color', '');
    //     }
    // }

    //state from storage
    getState() {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.get("toggle", (res) => {
                    console.log(res);
                    resolve(res.toggle);
                });
            } catch (e) {
                resolve([]);
            }
        });
    }

    //color from storage
    // getColor() {
    //     return new Promise((resolve, reject) => {
    //         try {
    //             chrome.storage.sync.get("textColor", (res) => {
    //                 console.log(res);
    //                 resolve(res.textColor);
    //             });
    //         } catch (e) {
    //             resolve([]);
    //         }
    //     });
    // }

    //colorSet from storage
    getColorSet() {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.get("colorSet", (res) => {
                    console.log(res);
                    resolve(res.colorSet);
                });
            } catch (e) {
                resolve([]);
            }
        });
    }

    //tags from storage
    getTags() {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.get("colorizableDOMs", function(res) {
                    if (res.colorizableDOMs) {
                        resolve(res.colorizableDOMs);
                    } else {
                        resolve([]);
                    }
                });
            } catch (e) {
                resolve([]);
            }
        });
    }

}
window.onload = () => {
    window._colorizeTextClassObject = new ColorizeText();
}