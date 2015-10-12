import React, { Component } from 'react';

import { sendMessage } from 'helpers/chromecast.js';
import parseYoutubeUrl from 'helpers/parse_youtube_url.js';

class Sender extends Component {
  handleView() {
    const url = this.refs.videoInput.value;
    const query = parseYoutubeUrl(url);
    console.log(query);
    console.log(query.videoId);
    sendMessage(query);
  }

  render() {
    return (
      <div className="sender">
        <label htmlFor="input">Video ID:</label>
        <input id="input" type="text" size="30" ref="videoInput" />
        <button onClick={this.handleView.bind(this)}>View</button>
      </div>
    );
  }
}

export default Sender;
