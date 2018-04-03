import React, { Component } from 'react';

interface VideoProps {
  domain: string;
  subreddit: string;
  subredditId: string;
  id: string;
  author: string;
  numComments: number;
  score: number;
  title: string;
  url: string;
  name: string;
  createdUtc: number;
  permalink: string;
  thumbnail: string;
  onViewVideo: (url: string) => void;
}

class Video extends Component<VideoProps> {
  handleViewVideo(event: Event) {
    event.preventDefault();

    const { url, onViewVideo } = this.props;
    onViewVideo(url);
  }

  handleCommentsClick(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    const { permalink } = this.props;
    const url = `http://reddit.com${permalink}`;
    window.open(url, '_blank');
  }

  render() {
    const { id, title, thumbnail, url, score } = this.props;
    return (
      <a
        className="video card"
        key={id}
        onClick={this.handleViewVideo.bind(this)}
        href={`/#${url}`}
      >
        <div className="thumbnail-container">
          <div className="thumbnail">
            <img src={thumbnail} />
          </div>
        </div>
        <div className="score">
          <span className="score-value">{score}</span>
        </div>
        <div className="content">
          <span className="title">{title}</span>
          <div className="info">
            <div
              className="comments"
              onClick={this.handleCommentsClick.bind(this)}
            >
              Comments
            </div>
          </div>
        </div>
      </a>
    );
  }
}

export default Video;
