import React, { Component, PropTypes } from 'react';
import { map } from 'underscore';

import { requestSession, sendMessage, isConnected } from 'helpers/chromecast.js';
import parseYoutubeUrl from 'helpers/parse_youtube_url.js';

import SubredditPicker from 'components/subreddit_picker.jsx';
import Video from 'components/video.jsx';

const propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape(Video.propTypes)
  ),
  onSubredditChange: PropTypes.func,
};

class Sender extends Component {
  handleViewVideo(url) {
    const query = parseYoutubeUrl(url);
    window.history.replaceState(null, null, `/#${url}`);
    window.history.replaceState(null, null, '/');
    sendMessage(query);
  }

  handleConnectClick() {
    requestSession();
  }

  render() {
    const { videos, onSubredditChange } = this.props;

    if (!isConnected()) {
      return (
        <div className="sender">
          <div className="disconnected-overlay" onClick={this.handleConnectClick}>
            <div className="container">
            <div className="content">
              <img src="/img/cast.svg" />
              <div className="title">
                Disconnected
                <div className="subtitle">
                  Click to connect to a Chromecast
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      );
    }

    const renderedVideos = map(videos, (video) => {
      return <Video key={video.id} {...video} onViewVideo={this.handleViewVideo} />;
    });

    return (
      <div className="sender">
        <div className="nav">
          <div className="navbar">
            <span className="logo">Subcast.tv</span>
            <SubredditPicker onSubredditChange={onSubredditChange} />
          </div>
        </div>
        <div className="videos">
          {renderedVideos}
        </div>
      </div>
    );
  }
}

Sender.propTypes = propTypes;

export default Sender;
