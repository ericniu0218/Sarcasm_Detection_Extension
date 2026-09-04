// background.js
chrome.runtime.onInstalled.addListener(() => {
    // Create a context menu for selected text
    chrome.contextMenus.create({
      id: "detect-sarcasm",
      title: "Detect Sarcasm",
      contexts: ["selection"]
    });
  });
  
  // Listen for clicks on your context menu item
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "detect-sarcasm") {
      const selectedText = info.selectionText || "";
      
      // 1. CALL YOUR AI MODEL HERE
      //    For instance, if you have a function in sarcasmModel.js
      //    you'd either import it or have it globally accessible.
      //    Example placeholder below:
      // const isSarcastic = detectSarcasm(selectedText);
  
      // 2. For demonstration, we’ll just do a random guess
      const isSarcastic = Math.random() > 0.5;
      
      // 3. Show the result to the user
      //    We can alert it, or inject it into the page, etc.
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (text, result) => {
          alert(`Sarcasm Detection for "${text}":\n${result}`);
        },
        args: [selectedText, isSarcastic ? "Sarcastic!" : "Not sarcastic."]
      });
    }
  });
  
