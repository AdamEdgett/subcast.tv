var APP_NAMESPACE = 'urn:x-cast:castit';

window.onload = function() {
  cast.receiver.logger.setLevelValue(0);
  window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  console.log('Starting Receiver Manager');

  castReceiverManager.onReady = function(event) {
    console.log(`Received Ready event: ${JSON.stringify(event.data)}`);
    window.castReceiverManager.setApplicationState("Application status is ready...");
  };

  castReceiverManager.onSenderConnected = function(event) {
    console.log(`Received Sender Connected event: ${event.data}`);
    console.log(window.castReceiverManager.getSender(event.data).userAgent);
  };

  castReceiverManager.onSenderDisconnected = function(event) {
    console.log(`Received Sender Disconnected event: ${event.data}`);
    if (window.castReceiverManager.getSenders().length == 0) {
      window.close();
    }
  };

  castReceiverManager.onSystemVolumeChanged = function(event) {
    console.log(`Received System Volume Changed event: ${event.data['level']} ${event.data['muted']}`);
  };

  // create a CastMessageBus to handle messages for a custom namespace
  window.messageBus = window.castReceiverManager.getCastMessageBus(APP_NAMESPACE, cast.receiver.CastMessageBus.MessageType.JSON);
  window.messageBus.onMessage = function(event) {
    console.log(`Message [${event.senderId}]: ${event.data}`);
    // display the message from the sender
    updateVideo(event.data);
    // inform all senders on the CastMessageBus of the incoming message event
    // sender message listener will be invoked
    window.messageBus.send(event.senderId, event.data);
  }

  // initialize the CastReceiverManager with an application status message
  window.castReceiverManager.start({statusText: "Application is starting"});
  console.log('Receiver Manager started');
};

function getYoutubeUrl(videoInfo) {
  return `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoInfo.videoId}?autoplay=1" frameborder="0"></iframe>`;
};

function updateVideo(videoInfo) {
  document.getElementById("content").innerHTML = getYoutubeUrl(videoInfo);
  window.castReceiverManager.setApplicationState(videoInfo.videoId);
};
