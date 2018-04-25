import React from "react";
import { hot } from "react-hot-loader";
import { map, isEmpty } from "underscore";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import CastIcon from "@material-ui/icons/Cast";
import deepOrange from "material-ui/colors/deepOrange";
import indigo from "material-ui/colors/indigo";

import { requestSession, sendMessage, isConnected } from "helpers/chromecast";
import parseYoutubeUrl from "helpers/parse_youtube_url";
import VideoType from "helpers/video_type";

import SubredditPicker from "components/subreddit_picker";
import Video from "components/video";

interface SenderProps {
  subreddit?: string;
  videos: Array<Video>;
  onSubredditChange: () => void;
}

interface SenderState {
  expandedNav: boolean;
}

function handleViewVideo(url: string) {
  const query = parseYoutubeUrl(url);
  sendMessage("video", query);
}

function handleConnectClick() {
  requestSession();
}

class Sender extends React.Component<SenderProps, SenderState> {
  constructor(props: SenderProps) {
    super(props);

    this.state = {
      expandedNav: false
    };
    this.toggleExpandedNav = this.toggleExpandedNav.bind(this);
  }

  private toggleExpandedNav() {
    this.setState({ expandedNav: !this.state.expandedNav });
  }

  render(): JSX.Element {
    const { subreddit, videos, onSubredditChange } = this.props;
    const { expandedNav } = this.state;

    const theme = createMuiTheme({
      palette: {
        primary: deepOrange,
        secondary: indigo
      }
    });

    if (!isConnected()) {
      return (
        <MuiThemeProvider theme={theme}>
          <div className="sender">
            <div className="disconnected-overlay" onClick={handleConnectClick}>
              <div className="content">
                <CastIcon />
                <div className="title">
                  Disconnected
                  <div className="subtitle">
                    Click to connect to a Chromecast
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      );
    }

    if (isEmpty(videos)) {
      return (
        <MuiThemeProvider theme={theme}>
          <div className="sender">
            <div className="subreddit-overlay">
              <SubredditPicker onSubredditChange={onSubredditChange} />
            </div>
          </div>
        </MuiThemeProvider>
      );
    }

    const renderedVideos = map(videos, (video: VideoType) => {
      return <Video key={video.id} {...video} onViewVideo={handleViewVideo} />;
    });

    let renderedSubreddit;
    if (subreddit) {
      renderedSubreddit = (
        <div className="subreddit" onClick={this.toggleExpandedNav}>
          {`/r/${subreddit}`}
        </div>
      );
    }

    let pickerExpanded;
    if (expandedNav) {
      pickerExpanded = "expanded";
    }

    return (
      <MuiThemeProvider theme={theme}>
        <div className="sender">
          <div className="nav">
            <div className="nav-content">
              <span className="logo">Subcast.tv</span>
              {renderedSubreddit}
            </div>
            <div className={`picker ${pickerExpanded || ""}`}>
              <div className="nav-content">
                <SubredditPicker
                  subreddit={subreddit}
                  onSubredditChange={onSubredditChange}
                />
              </div>
            </div>
          </div>
          <div className={`videos ${pickerExpanded || ""}`}>
            {renderedVideos}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default hot(module)(Sender);
