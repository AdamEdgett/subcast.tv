import React from 'react';
import ReactDOM from 'react-dom';
import { map, partial, pluck, filter } from 'underscore';
import { camelizeKeys } from 'humps';

import Sender from 'components/sender';

import { initializeApi, sendMessage } from 'helpers/chromecast';
import parseYoutubeUrl from 'helpers/parse_youtube_url';
import getSubredditLinks from 'helpers/get_subreddit_links';

const chrome = window.chrome;
let component;

const CAST_API_INITIALIZATION_DELAY = 1000;

function handleSessionChange() {
  const contentAnchor = document.getElementById('content-anchor');
  component = ReactDOM.render(<Sender {...component.props} />, contentAnchor);
}

if (!chrome.cast || !chrome.cast.isAvailable) {
  setTimeout(partial(initializeApi, handleSessionChange), CAST_API_INITIALIZATION_DELAY);
}

function getLinks(request) {
  getSubredditLinks(request, (resp) => {
    const links = camelizeKeys(pluck(resp.data.children, 'data'));
    const videos = filter(links, (link) => link.domain === 'youtube.com' || link.domain === 'youtu.be');
    if (request.after) {
      const appendedVideos = (component.props.videos || []).concat(videos);
      renderSubredditLinks(request, appendedVideos)
    } else {
      renderSubredditLinks(request, videos)
    }
  });
}

function renderSubredditLinks(request, videos) {
  const contentAnchor = document.getElementById('content-anchor');
  sendMessage('queue', map(videos, (video) => parseYoutubeUrl(video.url)));
  component = ReactDOM.render(<Sender subreddit={request.subreddit} sort={request.sort} time={request.time} videos={videos} getLinks={getLinks} />, contentAnchor);
}

window.onload = function onLoad() {
  const contentAnchor = document.getElementById('content-anchor');
  component = ReactDOM.render(<Sender getLinks={getLinks} />, contentAnchor);
};

if (module.hot) {
  module.hot.accept();
}
