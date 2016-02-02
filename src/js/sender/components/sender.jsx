import React, { Component, PropTypes } from 'react';
import { map } from 'underscore';

import { sendMessage } from 'helpers/chromecast.js';
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
    sendMessage(query);
  }

  render() {
    const { videos, onSubredditChange } = this.props;
    const renderedVideos = map(videos, (video) => {
      return <Video key={video.id} {...video} onViewVideo={this.handleViewVideo} />;
    });

    return (
      <div className="sender">
        <div className="nav">
          <div className="navbar">
            <span className="logo">Castit</span>
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
