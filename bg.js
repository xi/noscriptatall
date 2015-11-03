(function() {
	"use strict";

	// provide synchronous whitelist access
	var whitelist = [];

	var updateWhitelist = function() {
		chrome.storage.sync.get({whitelist: []}, function(values) {
			whitelist = values.whitelist;
		});
	};

	chrome.storage.onChanged.addListener(updateWhitelist);
	updateWhitelist();


	// actual blocking
	var isAllowed = function(url) {
		var i = whitelist.length;
		while (i--) {
			if (url.match(whitelist[i])) {
				return true;
			}
		}
		return false;
	};

	chrome.webRequest.onBeforeRequest.addListener(function(details) {
		if (details.type === 'script') {
			return {cancel: !isAllowed(details.url)};
		}
	}, {urls: ['<all_urls>']}, ['blocking']);


	// browserAction
	var getOrigin = function(tabId, fn) {
		chrome.tabs.sendMessage(tabId, 'nsaa-origin', null, function(origin) {
			fn(origin);
		});
	};

	var setIcon = function(enabled) {
		var path = enabled ? 'icon.png' : 'icon-disabled.png';
		chrome.browserAction.setIcon({path: path});
	};

	var updateIcon = function(tabId) {
		getOrigin(tabId, function(origin) {
			setIcon(origin && whitelist.indexOf('^' + origin) !== -1);
		});
	};

	chrome.tabs.onUpdated.addListener(updateIcon);
	chrome.tabs.onActivated.addListener(function(data) {
		updateIcon(data.tabId);
	});

	chrome.browserAction.onClicked.addListener(function(tab) {
		getOrigin(tab.id, function(origin) {
			if (origin) {
				var pattern = '^' + origin;
				var index = whitelist.indexOf(pattern);
				if (index === -1) {
					whitelist.push(pattern);
				} else {
					whitelist.splice(index, 1);
				}
				setIcon(index === -1)
				chrome.storage.sync.set({'whitelist': whitelist});
			}
		});
	});
})();
