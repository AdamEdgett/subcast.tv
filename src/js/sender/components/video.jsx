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

  stopPropagation(event) {
    event.stopPropagation();
  }

  render() {
    const { id, url, title, thumbnail, permalink } = this.props;
    return (
      <div className="video card" key={id} onClick={this.handleViewVideo.bind(this)}>
        <div className="thumbnail-container">
          <div className="thumbnail">
            <img src={thumbnail} />
          </div>
        </div>
        <div className="content">
          <span className="title">{title}</span>
          <div className="info">
            <a
              className="comments"
              target="_blank"
              href={`http://reddit.com${permalink}`}
              onClick={this.stopPropagation}
            >
              Comments
            </a>
          </div>
        </div>
      </div>
    );
  }
}

Video.propTypes = propTypes;

export default Video;
