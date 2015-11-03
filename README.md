Very simple chrome noscript extension.

With [`beforeload`
gone](https://code.google.com/p/chromium/issues/detail?id=333318) and
[`beforescriptexecute`](https://developer.mozilla.org/en-US/docs/Web/Events/beforescriptexecute)
not yet supported this uses `webRequest` to block loading JavaScript files.
Note that this will not block inline JavaScript.
