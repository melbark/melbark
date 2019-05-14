// global settings
window.settings = {};

var keyboardElem = document.querySelector('.keyboard');

var customArps = localStorage.getItem('customArps');
customArps = customArps ? JSON.parse( customArps ) : [];

function saveCustomArps() {
  localStorage.setItem( 'customArps', JSON.stringify( customArps ) );
}
