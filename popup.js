const PATTERN_URL = 'https://*.webrtc.org';

document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var incognito = tabs[0].incognito;
    var types = ['microphone', 'camera'];
    types.forEach(function(type) {
      chrome.contentSettings[type] && chrome.contentSettings[type].get({
            primaryUrl: PATTERN_URL + '/*',
            incognito: incognito
          },
          function(details) {
            document.getElementById(type).innerText = details.setting;
          });
    });
  });
});
