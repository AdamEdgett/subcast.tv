import React from 'react';
import ReactDOM from 'react-dom';
import { map, partial, pluck, filter } from 'underscore';
import { camelizeKeys } from 'humps';

import Sender from 'components/sender.jsx';

import { initializeApi, sendMessage } from 'helpers/chromecast.js';
import parseYoutubeUrl from 'helpers/parse_youtube_url.js';
import getSubredditLinks from 'helpers/get_subreddit_links.js';

const chrome = window.chrome;
let component;

const CAST_API_INITIALIZATION_DELAY = 1000;

function handleSessionChange() {
  console.log('sessioncb');
  const contentAnchor = document.getElementById('content-anchor');
  component = ReactDOM.render(<Sender {...component.props} />, contentAnchor);
}

if (!chrome.cast || !chrome.cast.isAvailable) {
  setTimeout(partial(initializeApi, handleSessionChange), CAST_API_INITIALIZATION_DELAY);
}

function handleSubredditChange(request) {
  getSubredditLinks(request, handleSubredditLinks);
}

function handleSubredditLinks(resp) {
  const links = camelizeKeys(pluck(resp.data.children, 'data'));
  const videos = filter(links, (link) => link.domain === 'youtube.com' || link.domain === 'youtu.be');
  const contentAnchor = document.getElementById('content-anchor');
  sendMessage('queue', map(videos, (video) => parseYoutubeUrl(video.url)));
  component = ReactDOM.render(<Sender videos={videos} onSubredditChange={handleSubredditChange} />, contentAnchor);
}

window.onload = function onLoad() {
  const contentAnchor = document.getElementById('content-anchor');
  component = ReactDOM.render(<Sender onSubredditChange={handleSubredditChange} />, contentAnchor);
};
