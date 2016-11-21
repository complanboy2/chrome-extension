// Check if email addresses are available for the current domain and update the
// color of the browser icon
//
function LaunchColorChange() {
  chrome.tabs.query(
    {currentWindow: true, active : true},
    function(tabArray){
      if (tabArray[0]["url"] != window.currentDomain) {
        window.currentDomain = url_domain(tabArray[0]["url"]).replace("www.", "");
        updateIconColor();
      }
    }
  );
}


// When an URL changes
//
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  LaunchColorChange();
});


// When active tab changes
//
chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
  LaunchColorChange();
});


// API call to check if there is at least one email address
// Documentation: https://hunter.io/api/v2/docs#email-count
//
function updateIconColor() {
  $.ajax({
    url : 'https://api.hunter.io/v2/email-count?domain=' + window.currentDomain,
    type : 'GET',
    success : function(json){
      if (json.data.total > 0) { setColoredIcon(); }
      else { setGreyIcon(); }
    },
    error : function() {
      setColoredIcon();
    }
  });
}

function setGreyIcon() {
  chrome.browserAction.setIcon({
    path : {
      "19": chrome.extension.getURL("shared/img/icon19_grey.png"),
      "38": chrome.extension.getURL("shared/img/icon38_grey.png")
    }
  });
}

function setColoredIcon() {
  chrome.browserAction.setIcon({
    path : {
      "19": chrome.extension.getURL("shared/img/icon19.png"),
      "38": chrome.extension.getURL("shared/img/icon38.png")
    }
  });
}

function url_domain(data) {
  var    a      = document.createElement('a');
         a.href = data;
  return a.hostname;
}

// Add context links on right click on the icon
//
function addBrowserMenuLinks() {
  chrome.contextMenus.create({
    "id": "dashboard",
    "title": "Dashboard",
    "contexts": ['browser_action'],
  });

  chrome.contextMenus.create({
    "id": "leads",
    "title": "My leads",
    "contexts": ['browser_action'],
  });

  chrome.contextMenus.create({
    "id": "upgrade",
    "title": "Upgrade",
    "contexts": ['browser_action'],
  });

  chrome.contextMenus.create({
    "id": "faqs",
    "title": "FAQs",
    "contexts": ['browser_action'],
  });
}

addBrowserMenuLinks();
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  switch (info.menuItemId) {
    case "dashboard":
      chrome.tabs.create({ url: "https://hunter.io/dashboard?utm_source=chrome_extension&utm_medium=extension&utm_campaign=extension&utm_content=context_menu_browser_action" });
      break;
    case "leads":
      chrome.tabs.create({ url: "https://hunter.io/leads_lists?utm_source=chrome_extension&utm_medium=extension&utm_campaign=extension&utm_content=context_menu_browser_action" });
      break;
    case "upgrade":
      chrome.tabs.create({ url: "https://hunter.io/subscriptions?utm_source=chrome_extension&utm_medium=extension&utm_campaign=extension&utm_content=context_menu_browser_action" });
      break;
    case "faqs":
      chrome.tabs.create({ url: "https://hunter.io/help/faq_categories/14?utm_source=chrome_extension&utm_medium=extension&utm_campaign=extension&utm_content=context_menu_browser_action" });
      break;
  }
});
