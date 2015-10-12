const APP_ID = 'E5754F81';
const APP_NAMESPACE = 'urn:x-cast:castit';
let session;

function setSession(newSession) {
  session = newSession;
}

function onError(message) {
  console.error(`onError: ${JSON.stringify(message)}`);
}

function onSuccess(message) {
  console.log(`onSuccess: ${JSON.stringify(message)}`);
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
    chrome.cast.requestSession(
      (session) => {
        session.sendMessage(APP_NAMESPACE, message, onSuccess.bind(this, `Message sent: ${message}`), onError);
      },
      onError);
  }
}

export { setSession, sendMessage };
