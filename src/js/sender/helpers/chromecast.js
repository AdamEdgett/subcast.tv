const chrome = window.chrome;
const APP_ID = 'E5754F81';
const APP_NAMESPACE = 'urn:x-cast:subcast';
let session;
let sessionCallback;

function setSession(newSession) {
  session = newSession;
}

function onError(message) {
  console.error(`onError: ${JSON.stringify(message)}`);
}

function onSuccess(message) {
  console.log(`onSuccess: ${JSON.stringify(message)}`);
}

function onInitSuccess() {
  console.log('onInitSuccess');
}

function onStopAppSuccess() {
  console.log('onStopAppSuccess');
}

/**
 * stop app/session
 */
function stopApp() {
  session.stop(onStopAppSuccess, onError);
}

/**
 * listener for session updates
 */
function sessionUpdateListener(isAlive) {
  let message = isAlive ? 'Session Updated' : 'Session Removed';
  message += `: ${session.sessionId}`;
  console.log(message);
  if (!isAlive) {
    setSession(session = null);
  }
  sessionCallback();
}

/**
 * utility function to log messages from the receiver
 * @param {string} namespace The namespace of the message
 * @param {string} message A message string
 */
function receiverMessage(namespace, message) {
  console.log(`receiverMessage: ${namespace}, ${message}`);
}

/**
 * session listener during initialization
 */
function sessionListener(event) {
  session = event;
  console.log(`New session ID: ${session.sessionId}`);
  session.addUpdateListener(sessionUpdateListener);
  session.addMessageListener(APP_NAMESPACE, receiverMessage);
  setSession(session);
  sessionCallback(session);
}

function requestSession(callback) {
  chrome.cast.requestSession((newSession) => {
    sessionListener(newSession);
    if (callback) callback(session);
  }, onError);
}

/**
 * receiver listener during initialization
 */
function receiverListener(event) {
  if (event === 'available') {
    console.log('receiver found');
  } else {
    console.log('receiver list empty');
  }
}

function initializeApi(initSessionCallback = undefined) {
  sessionCallback = initSessionCallback;
  const sessionRequest = new chrome.cast.SessionRequest(APP_ID);
  const apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

/**
 * send a message to the receiver using the custom namespace
 * receiver CastMessageBus message handler will be invoked
 * @param {string} message A message string
 */
function sendMessage(message) {
  if (session !== null) {
    session.sendMessage(APP_NAMESPACE, message, onSuccess.bind(this, `Message sent: ${message}`), onError);
  } else {
    requestSession((newSession) => {
      newSession.sendMessage(APP_NAMESPACE, message, onSuccess.bind(this, `Message sent: ${message}`), onError);
    });
  }
}

function isConnected() {
  return session && session.receiver;
}

export { initializeApi, requestSession, stopApp, setSession, sendMessage, isConnected };
