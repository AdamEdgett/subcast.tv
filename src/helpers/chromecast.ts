const chrome = (window as any).chrome;
const ENV = process.env.NODE_ENV || "development";
const APP_ID = ENV === "production" ? "E5754F81" : "1BB93C2D";
const APP_NAMESPACE = ENV === "production" ? "urn:x-cast:subcast" : "urn:x-cast:subcast-dev";
let session: any;
let sessionCallback: (session?: any) => void;

function setSession(newSession: any) {
  session = newSession;
}

function onError(message: string) {
  console.error(`onError: ${JSON.stringify(message)}`);
}

function onSuccess(message: string) {
  console.log(`onSuccess: ${JSON.stringify(message)}`);
}

function onInitSuccess() {
  console.log("onInitSuccess");
}

function onStopAppSuccess() {
  console.log("onStopAppSuccess");
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
function sessionUpdateListener(isAlive: boolean) {
  let message = isAlive ? "Session Updated" : "Session Removed";
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
function receiverMessage(namespace: string, message: string) {
  console.log(`receiverMessage: ${namespace}, ${message}`);
}

/**
 * session listener during initialization
 */
function sessionListener(event: Event) {
  session = event;
  console.log(`New session ID: ${session.sessionId}`);
  session.addUpdateListener(sessionUpdateListener);
  session.addMessageListener(APP_NAMESPACE, receiverMessage);
  setSession(session);
  sessionCallback(session);
}

function requestSession(callback?: (session: any) => void) {
  chrome.cast.requestSession((newSession: any) => {
    sessionListener(newSession);
    if (callback) callback(session);
  }, onError);
}

/**
 * receiver listener during initialization
 */
function receiverListener(event: string) {
  if (event === "available") {
    console.log("receiver found");
  } else {
    console.log("receiver list empty");
  }
}

function initializeApi(initSessionCallback: any) {
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
function sendMessage(type: string, data: any) {
  const message = { type, data };
  if (session) {
    session.sendMessage(APP_NAMESPACE, message, () => onSuccess(`Message sent: ${message}`), onError);
  } else {
    requestSession((newSession) => {
      if (newSession) newSession.sendMessage(APP_NAMESPACE, message, () => onSuccess(`Message sent: ${message}`), onError);
    });
  }
}

function isConnected() {
  return session && session.receiver;
}

export { initializeApi, requestSession, stopApp, setSession, sendMessage, isConnected };
