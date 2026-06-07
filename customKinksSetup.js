var customKinksScript = document.createElement('script');
customKinksScript.src = chrome.runtime.getURL('customKinks.js');
customKinksScript.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(customKinksScript);
