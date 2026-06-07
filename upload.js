function injectScript(src) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(src);
  script.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

injectScript("resize.js");
injectScript("uploadGallery.js");
