chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('app/index.html', {
    bounds: {
      width: 500,
      height: 400
    }
  });
});