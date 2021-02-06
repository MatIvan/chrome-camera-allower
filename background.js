const MY_DOMEN = 'webrtc.org';
const PATTERN_URL = 'https://*.' + MY_DOMEN + '/*';
const TYPES_LIST = ['microphone', 'camera'];

let TYPE_STATUS = {};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'loading' && tab.url.includes(MY_DOMEN)) {
    TYPES_LIST.forEach(function (type) {
      TYPE_STATUS[type] = false;
      allow(type, tab.incognito);
    });
  }
});

function allow(type, incognito) {
  chrome.contentSettings[type].set(
    {
      primaryPattern: PATTERN_URL,
      setting: 'allow',
      scope: (incognito ? 'incognito_session_only' : 'regular')
    },
    function () { updateStatus(type); }
  );
}

function updateStatus(type) {
  chrome.contentSettings[type] && chrome.contentSettings[type].get({
    primaryUrl: PATTERN_URL
  },
    function (details) {
      TYPE_STATUS[type] = (details.setting === "allow");
      updateIcon();
    });
}

function updateIcon() {
  let ico = "icon-bad.png";
  if (TYPES_LIST.length > 0 && TYPES_LIST.every((type) => { return TYPE_STATUS[type]; })) {
    ico = "icon-ok.png";
  }
  chrome.browserAction.setIcon({ path: ico });
}
