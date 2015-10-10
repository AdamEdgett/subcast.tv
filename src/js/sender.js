const CAST_API_INITIALIZATION_DELAY = 1000;
const APP_ID = 'E5754F81';
const APP_NAMESPACE = 'urn:x-cast:castit';

let session;

if (!chrome.cast || !chrome.cast.isAvailable) {
  setTimeout(initializeCastApi, CAST_API_INITIALIZATION_DELAY);
}

function initializeCastApi() {
  const sessionRequest = new chrome.cast.SessionRequest(APP_ID);
  const apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

function onInitSuccess() {
  console.log('onInitSuccess');
}

function onError(message) {
  console.log(`onError: ${JSON.stringify(message)}`);
}

function onSuccess(message) {
  console.log(`onSuccess: ${message}`);
}

function onStopAppSuccess() {
  console.log('onStopAppSuccess');
}

/**
 * session listener during initialization
 */
function sessionListener(e) {
  console.log(`New session ID: ${e.sessionId}`);
  session = e;
  session.addUpdateListener(sessionUpdateListener);
  session.addMessageListener(APP_NAMESPACE, receiverMessage);
}

/**
 * listener for session updates
 */
function sessionUpdateListener(isAlive) {
  let message = isAlive ? 'Session Updated' : 'Session Removed';
  message += `: ${session.sessionId}`;
  console.log(message);
  if (!isAlive) {
    session = null;
  }
};

/**
 * utility function to log messages from the receiver
 * @param {string} namespace The namespace of the message
 * @param {string} message A message string
 */
function receiverMessage(namespace, message) {
  console.log(`receiverMessage: ${namespace}, ${message}`);
};

/**
 * receiver listener during initialization
 */
function receiverListener(e) {
  if( e === 'available' ) {
    console.log('receiver found');
  }
  else {
    console.log('receiver list empty');
  }
}

/**
 * stop app/session
 */
function stopApp() {
  session.stop(onStopAppSuccess, onError);
}

/**
 * send a message to the receiver using the custom namespace
 * receiver CastMessageBus message handler will be invoked
 * @param {string} message A message string
 */
function sendMessage(message) {
  if (session != null) {
    session.sendMessage(APP_NAMESPACE, message, onSuccess.bind(this, `Message sent: ${message}`), onError);
  }
  else {
    chrome.cast.requestSession(function(e) {
        session = e;
        session.sendMessage(APP_NAMESPACE, message, onSuccess.bind(this, `Message sent: ${message}`), onError);
      }, onError);
  }
}

/**
 * utility function to handle text typed in by user in the input field
 */
function update() {
  sendMessage(document.getElementById('input').value);
}
