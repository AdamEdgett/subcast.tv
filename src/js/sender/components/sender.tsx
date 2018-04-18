import React from "react";
import { map, isEmpty } from "underscore";

import { requestSession, sendMessage, isConnected } from "helpers/chromecast";
import parseYoutubeUrl from "helpers/parse_youtube_url";
import VideoType from "helpers/video_type";

import SubredditPicker from "components/subreddit_picker";
import Video from "components/video";

interface SenderProps {
  videos: Array<Video>;
  onSubredditChange: () => void;
}

function handleViewVideo(url: string) {
  const query = parseYoutubeUrl(url);
  sendMessage("video", query);
}

function handleConnectClick() {
  requestSession();
}

class Sender extends React.Component<SenderProps> {
  render(): JSX.Element {
    const { videos, onSubredditChange } = this.props;

    if (!isConnected()) {
      return (
        <div className="sender">
          <div className="disconnected-overlay" onClick={handleConnectClick}>
            <div className="container">
              <div className="content">
                <img src="/img/cast.svg" />
                <div className="title">
                  Disconnected
                  <div className="subtitle">Click to connect to a Chromecast</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isEmpty(videos)) {
      return (
        <div className="sender">
          <div className="subreddit-overlay">
            <SubredditPicker onSubredditChange={onSubredditChange} />
          </div>
        </div>
      );
    }

    const renderedVideos = map(videos, (video: VideoType) => {
      return <Video key={video.id} {...video} onViewVideo={handleViewVideo} />;
    });

    return (
      <div className="sender">
        <div className="nav">
          <div className="navbar">
            <span className="logo">Subcast.tv</span>
            <SubredditPicker onSubredditChange={onSubredditChange} />
          </div>
        </div>
        <div className="videos">{renderedVideos}</div>
      </div>
    );
  }
}

export default Sender;
