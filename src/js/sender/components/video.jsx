import React, { Component, PropTypes } from 'react';
import { partial } from 'underscore';

const propTypes = {
  domain: PropTypes.string,
  subreddit: PropTypes.string,
  subredditId: PropTypes.string,
  id: PropTypes.string,
  author: PropTypes.string,
  numComments: PropTypes.number,
  score: PropTypes.number,
  title: PropTypes.string,
  url: PropTypes.string,
  name: PropTypes.string,
  createdUtc: PropTypes.number,
  permalink: PropTypes.string,
  thumbnail: PropTypes.string,
  onViewVideo: PropTypes.func,
};

class Video extends Component {
  handleViewVideo() {
    const { url, onViewVideo } = this.props;
    onViewVideo(url);
  }

  render() {
    const { id, url, title } = this.props;
    return (
      <div className="video card" key={id}>
        <a className="content" onClick={this.handleViewVideo.bind(this)}>{title}</a>
      </div>
    );
  }
}

Video.propTypes = propTypes;

export default Video;
