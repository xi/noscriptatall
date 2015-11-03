(function() {
	'use strict';

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request === 'nsaa-origin') {
			sendResponse(location.origin);
		}
	});
})();
