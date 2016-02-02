const APP_NAMESPACE = 'urn:x-cast:castit';

const { cast } = window;

function getYoutubeUrl(videoInfo) {
  const src = `https://www.youtube.com/embed/${videoInfo.videoId}?autoplay=1`;
  return `<iframe width="100%" height="100%" src="${src}" frameborder="0"></iframe>`;
}

function updateVideo(videoInfo) {
  document.getElementById('content').innerHTML = getYoutubeUrl(videoInfo);
  window.castReceiverManager.setApplicationState(videoInfo.videoId);
}

window.onload = () => {
  cast.receiver.logger.setLevelValue(0);
  window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  console.log('Starting Receiver Manager');

  window.castReceiverManager.onReady = (event) => {
    console.log(`Received Ready event: ${JSON.stringify(event.data)}`);
    window.castReceiverManager.setApplicationState('Application status is ready...');
  };

  window.castReceiverManager.onSenderConnected = (event) => {
    console.log(`Received Sender Connected event: ${event.data}`);
    console.log(window.castReceiverManager.getSender(event.data).userAgent);
  };

  window.castReceiverManager.onSenderDisconnected = (event) => {
    console.log(`Received Sender Disconnected event: ${event.data}`);
    if (window.castReceiverManager.getSenders().length === 0) {
      window.close();
    }
  };

  window.castReceiverManager.onSystemVolumeChanged = (event) => {
    console.log(`Received System Volume Changed event: ${event.data.level} ${event.data.muted}`);
  };

  // create a CastMessageBus to handle messages for a custom namespace
  window.messageBus = window.castReceiverManager.getCastMessageBus(APP_NAMESPACE, cast.receiver.CastMessageBus.MessageType.JSON);
  window.messageBus.onMessage = (event) => {
    console.log(`Message [${event.senderId}]: ${event.data}`);
    // display the message from the sender
    updateVideo(event.data);
    // inform all senders on the CastMessageBus of the incoming message event
    // sender message listener will be invoked
    window.messageBus.send(event.senderId, event.data);
  };

  // initialize the CastReceiverManager with an application status message
  window.castReceiverManager.start({statusText: 'Application is starting'});
  console.log('Receiver Manager started');
};
