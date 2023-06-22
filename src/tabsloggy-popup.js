// FILE_DESC: my bubble speech function 
// TODO: averageTabCount function will be removed in next version
// DONE: add exporting to diff formats
// TODO: add locales
// TODO: add logo/favicon
// DONE: initialize code inside the DOMContentLoaded event handler
// TODO: save settings
// DONE: generate xml
// DONE: fix generate button after navigating to settings and back
// DONE: remove innerHTML
// DONE: use SAP
// TODO: export all to ZIP
// TODO: "Save" button fix (to work with SAP if possible)

document.addEventListener("DOMContentLoaded", () => {

    function applyTranslations() {
    // Fetch XML file
    fetch(chrome.runtime.getURL('/_locales/en/messages.xml'))
        .then(response => response.text())
        .then(data => {
            // Parse XML data
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(data, "text/xml");

            const elements = Array.from(document.querySelectorAll("[data-i18n]"));

            elements.forEach(element => {
                let key = element.getAttribute("data-i18n");

                // Attempt to get message from JSON file
                let message = chrome.i18n.getMessage(key);

                // If message from JSON is undefined, attempt to get from XML
                if (!message) {
                    let xmlNode = xmlDoc.querySelector(key);
                    if (xmlNode) {
                        // Check if there's an image tag
                        let imageNode = xmlNode.querySelector('image');
                        if (imageNode) {
                            // If the element is an img tag, set the src attribute
                            if (element.tagName === 'IMG') {
                                element.src = imageNode.textContent;
                            }
                        } else {
                            message = xmlNode.querySelector('message').textContent;
                        }
                    }
                }

                if (message) {
                    element.innerText = message.replace(/&quot;/g, "\"");
                } else if (!element.src) { // If it's not an image or a text message, log an error
                    console.error(`No translation available for: ${key}`);
                }
            });
        })
        .catch(err => {
            console.error('Failed to fetch XML:', err);
        });
    }

    function initializePopupPage() {
        Promise.all([
            browser.runtime.sendMessage({command: 'getCurrentWindowTabCount'}),
            browser.runtime.sendMessage({command: 'getAllWindowTabCount'}),
            browser.runtime.sendMessage({command: 'getAverageTabCount'}),
            browser.runtime.sendMessage({command: 'getMostOpenedWebsite'})
        ]).then(([currentWindowTabCount, allWindowTabCount, averageTabCount, mostOpenedWebsite]) => {
            document.getElementById('currentWindowTabCount').textContent = `Current window ${currentWindowTabCount} tabs opened.`;
            document.getElementById('allWindowTabCount').textContent = `Total of ${allWindowTabCount} tabs opened.`;
            document.getElementById('averageTabCount').textContent = `Average: ${averageTabCount.toFixed(2)} tabs per window.`;
            document.getElementById('mostOpenedWebsite').textContent = `Most opened website: ${mostOpenedWebsite}`;
        });
    }

    document.body.addEventListener("click", function(event) {
        if(event.target.id === "settingsBtn") {
            fetch('tabsloggy-settings.html')
            .then(response => response.text())
            .then(data => {
                document.body.innerHTML = data;
                applyTranslations(); 
                assignEventListeners();
            });
        } else if(event.target.id === "backBtn") {
            fetch('tabsloggy-popup.html')
            .then(response => response.text())
            .then(data => {
                document.body.innerHTML = data;
                initializePopupPage(); 
                applyTranslations();  
                assignEventListeners();
            });
        }
    });

    // Initial initialization when the popup loads for the first time
    initializePopupPage();
    applyTranslations(); 
    assignEventListeners();
});
