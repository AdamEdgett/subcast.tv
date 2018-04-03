import { reject, isEqual } from 'underscore';
const APP_NAMESPACE = 'urn:x-cast:subcast';

const { cast } = window;
let player;
let queue;

function createPlayer(onPlayerReady) {
  player = new window.YT.Player('content', {
    height: '100%',
    width: '100%',
    playerVars: { 'autoplay': 1, 'controls': 0, 'showinfo': 0, 'rel': 0 },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
    },
  });
  window.player = player;
}

function updateVideo(videoInfo) {
  queue = reject(queue, (queuedVideo) => isEqual(queuedVideo, videoInfo));
  const onPlayerReady = () => { player.loadVideoById(videoInfo.videoId); };
  if (!player) {
    createPlayer(onPlayerReady);
  } else {
    onPlayerReady();
  }
  window.castReceiverManager.setApplicationState(videoInfo.videoId);
}

function onPlayerStateChange(event) {
  if (event.data === window.YT.PlayerState.ENDED && queue && queue.length > 0) {
    updateVideo(queue[0]);
  }
}

function updateQueue(newQueue) {
  queue = newQueue;
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
    if (event.data.type === 'video') {
      updateVideo(event.data.data);
    } else if (event.data.type === 'queue') {
      updateQueue(event.data.data);
    }
    // inform all senders on the CastMessageBus of the incoming message event
    // sender message listener will be invoked
    window.messageBus.send(event.senderId, event.data);
  };

  // initialize the CastReceiverManager with an application status message
  window.castReceiverManager.start({statusText: 'Application is starting'});
  console.log('Receiver Manager started');
};
