// my bubble speech function 
// averageTabCount function will be removed in next version
// TODO: add exporting to diff formats
// TODO: add locales
// TODO: add logo/favicon

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
        });
    } else if(event.target.id === "backBtn") {
        fetch('tabsloggy-popup.html')
        .then(response => response.text())
        .then(data => {
            document.body.innerHTML = data;
            initializePopupPage();
        });
    }
});

initializePopupPage();
