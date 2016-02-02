import React, { Component, PropTypes } from 'react';

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
  handleViewVideo(event) {
    event.preventDefault();

    const { url, onViewVideo } = this.props;
    onViewVideo(url);
  }

  handleCommentsClick(event) {
    event.stopPropagation();
    event.preventDefault();

    const { permalink } = this.props;
    const url = `http://reddit.com${permalink}`;
    window.open(url, '_blank');
  }

  render() {
    const { id, title, thumbnail, url } = this.props;
    return (
      <a className="video card" key={id} onClick={this.handleViewVideo.bind(this)} href={`/#${url}`}>
        <div className="thumbnail-container">
          <div className="thumbnail">
            <img src={thumbnail} />
          </div>
        </div>
        <div className="content">
          <span className="title">{title}</span>
          <div className="info">
            <div className="comments" onClick={this.handleCommentsClick.bind(this)}>
              Comments
            </div>
          </div>
        </div>
      </a>
    );
  }
}

Video.propTypes = propTypes;

export default Video;
