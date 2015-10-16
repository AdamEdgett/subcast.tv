import React, { Component, PropTypes } from 'react';
import { map, first } from 'underscore';

import sorts from 'values/sorts.js';
import sortTimes from 'values/sort_times.js';
import counts from 'values/counts.js';

const propTypes = {
  onSubredditChange: PropTypes.func.isRequired,
};

class SubredditPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: first(sorts),
      time: first(sortTimes),
      count: 25,
    };
  }

  changeSort(event) {
    this.setState({ sort: event.target.value });
  }

  changeTime(event) {
    this.setState({ time: event.target.value });
  }

  changeCount(event) {
    this.setState({ count: parseInt(event.target.value) });
  }

  handleView() {
    const { onSubredditChange } = this.props;
    const subreddit = this.refs.subredditInput.value;
    const { sort, time, count } = this.state;
    onSubredditChange({ subreddit, sort, time, count });
  }

  render() {
    const { subreddit, sort, time, count } = this.state;
    const renderedSorts = map(sorts, (sort) => {
      return <option value={sort} key={sort}>{sort}</option>;
    });

    const renderedCounts = map(counts, (count) => {
      return <option value={count} key={count}>{count}</option>
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
        <select value={sort} onChange={this.changeSort.bind(this)}>
          {renderedSorts}
        </select>
        {timeSelector}
        <select value={count} onChange={this.changeCount.bind(this)}>
          {renderedCounts}
        </select>
        <button onClick={this.handleView.bind(this)}>View</button>
      </div>
    );
  }
}

SubredditPicker.propTypes = propTypes;

export default SubredditPicker;