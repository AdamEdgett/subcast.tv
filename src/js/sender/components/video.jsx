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
  handleViewVideo(url) {
    this.props.onViewVideo(url);
  }

  render() {
    const { id, url, title } = this.props;
    return (
      <div className="video" key={id}>
        <a onClick={partial(this.handleViewVideo, url)}>{title}</a>
      </div>
    );
  }
}

Video.propTypes = propTypes;

export default Video;
