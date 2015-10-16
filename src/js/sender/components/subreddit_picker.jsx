import React, { Component, PropTypes } from 'react';
import { map, first } from 'underscore';

import sorts from 'values/sorts.js';
import sortTimes from 'values/sort_times.js';

const propTypes = {
  onSubredditChange: PropTypes.func.isRequired,
};

class SubredditPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: first(sorts),
      time: first(sortTimes),
    };
  }

  changeSort(event) {
    this.setState({ sort: event.target.value });
  }

  changeTime(event) {
    this.setState({ time: event.target.value });
  }

  handleView() {
    const { onSubredditChange } = this.props;
    const subreddit = this.refs.subredditInput.value;
    const { sort, time } = this.state;
    onSubredditChange({ subreddit, sort, time });
  }

  render() {
    const { subreddit, sort, time, count } = this.state;
    const renderedSorts = map(sorts, (sort) => {
      return <option value={sort} key={sort}>{sort}</option>;
    });

    let timeSelector;
    if (sort === 'top' || sort === 'controversial') {
      const renderedTimes = map(sortTimes, (timeLabel, time) => {
        return <option value={time} key={time}>{timeLabel}</option>;
      });

      timeSelector = [
        <label key="label" htmlFor="time-input">Time:</label>,
        <select key="select" value={time} onChange={this.changeTime.bind(this)}>
          {renderedTimes}
        </select>
      ];
    }

    return (
      <div className="subreddit-picker">
        <label htmlFor="subreddit-input">Subreddit:</label>
        <input type="text" ref="subredditInput" />
        <label htmlFor="sort-input">Sort:</label>
        <select ref="sortInput" value={sort} onChange={this.changeSort.bind(this)}>
          {renderedSorts}
        </select>
        {timeSelector}
        <button onClick={this.handleView.bind(this)}>View</button>
      </div>
    );
  }
}

SubredditPicker.propTypes = propTypes;

export default SubredditPicker;
