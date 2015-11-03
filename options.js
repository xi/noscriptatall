(function() {
	"use strict";

	chrome.storage.sync.get('whitelist', function(values) {
		var whitelist = values.whitelist;

		var form = document.querySelector('form');
		var textarea = document.querySelector('textarea');
		var submit = document.querySelector('input[type=submit]');

		textarea.value = whitelist.join('\n');

		form.addEventListener('submit', function(event) {
			event.preventDefault();
			chrome.storage.sync.set({'whitelist': textarea.value.split('\n')});
		});
	});
})();
