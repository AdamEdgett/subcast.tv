import React from 'react';
import ReactDOM from 'react-dom';
import { pluck, filter } from 'underscore';
import { camelizeKeys } from 'humps';

import Sender from 'components/sender.jsx';

import { setSession } from 'helpers/chromecast.js';
import getSubredditLinks from 'helpers/get_subreddit_links.js';

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
  session = e;
  console.log(`New session ID: ${session.sessionId}`);
  session.addUpdateListener(sessionUpdateListener);
  session.addMessageListener(APP_NAMESPACE, receiverMessage);
  setSession(session);
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

function handleSubredditLinks(resp) {
  const links = camelizeKeys(pluck(resp.data.children, 'data'));
  const videos = filter(links, (link) => link.domain === 'youtube.com');
  const contentAnchor = document.getElementById('content-anchor');
  ReactDOM.render(<Sender videos={videos} onSubredditChange={handleSubredditChange} />, contentAnchor);
}

function handleSubredditChange(request) {
  getSubredditLinks(request, handleSubredditLinks);
}

window.onload = function () {
  const contentAnchor = document.getElementById('content-anchor');
  ReactDOM.render(<Sender onSubredditChange={handleSubredditChange} />, contentAnchor);
};
