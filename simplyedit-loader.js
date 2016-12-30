(function createSimplyEditScriptTag(window, document, elementName, functionName, element, siblingElement) {

  function setAttribute(p_sName, p_sValue, p_sHost) {
    if (p_sHost === undefined || p_sHost === window.location.host) {
      element.setAttribute(p_sName, p_sValue);
    }
  }

  element = element || document.createElement(elementName);
  element.async = 1;
  element.src = 'https://cdn.simplyedit.io/1/simply-edit.js';

  siblingElement = siblingElement || document.scripts[0];
  siblingElement.parentNode.insertBefore(element, siblingElement);

  window[functionName] = window[functionName] || {
    key: function (p_sKey, p_sHost) {
      setAttribute('data-api-key', p_sKey, p_sHost);
    },
    set: function (p_sName, p_sValue, p_sHost) {
      setAttribute('data-simply-' + p_sName, p_sValue, p_sHost);
    }
  };
})(window, document, 'script', 'simply');
