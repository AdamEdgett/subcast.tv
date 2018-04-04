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

    const { id, url, onViewVideo } = this.props;
    const watched = JSON.parse(localStorage.getItem('watched') || '{}');
    const updatedWatched = { ...watched, [id]: true };
    localStorage.setItem('watched', JSON.stringify(updatedWatched));
    onViewVideo(url);
    this.forceUpdate();
  }

  render() {
    const { id, title, thumbnail, url, permalink, score } = this.props;

    let renderedThumbnail;
    if (thumbnail === 'nsfw') {
      renderedThumbnail = <img src='img/nsfw.png' className='thumbnail' />;
    } else if (thumbnail === 'default') {
      renderedThumbnail = <img src='img/default.png' className='thumbnail' />;
    } else {
      renderedThumbnail = (
        <div className='thumbnail'>
          <img src={thumbnail} />
        </div>
      );
    }

    const watched = JSON.parse(localStorage.getItem('watched') || '{}');
    let visitedClass;
    if (watched[id]) {
      visitedClass = 'visited';
    }

    return (
      <div
        className={`video card ${visitedClass}`}
        key={id}
        onClick={this.handleViewVideo.bind(this)}
      >
        <div className="thumbnail-container">{renderedThumbnail}</div>
        <div className="score">
          <span className="score-value">{score}</span>
        </div>
        <div className="content">
          <span className="title">{title}</span>
          <div className="info">
            <a
              className="comments"
              href={`https://reddit.com${permalink}`}
              target="_blank"
              onClick={event => event.stopPropogation()}
            >
              Comments
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Video;
