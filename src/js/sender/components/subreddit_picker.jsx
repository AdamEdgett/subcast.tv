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

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleView();
    }
  }

  changeSort(event) {
    this.setState({ sort: event.target.value });
  }

  changeTime(event) {
    this.setState({ time: event.target.value });
  }

  changeCount(event) {
    this.setState({ count: parseInt(event.target.value, 10) });
  }

  handleView() {
    const { onSubredditChange } = this.props;
    const subreddit = this.refs.subredditInput.value;
    const { sort, time, count } = this.state;
    onSubredditChange({ subreddit, sort, time, count });
  }

  render() {
    const { sort, time, count } = this.state;
    const renderedSorts = map(sorts, (sortValue) => {
      return <option value={sortValue} key={sortValue}>{sortValue}</option>;
    });

    const renderedCounts = map(counts, (countValue) => {
      return <option value={countValue} key={countValue}>{countValue}</option>;
    });

    let timeSelector;
    if (sort === 'top' || sort === 'controversial') {
      const renderedTimes = map(sortTimes, (timeLabel, timeValue) => {
        return <option value={timeValue} key={timeValue}>{timeLabel}</option>;
      });

      timeSelector = (
        <li>
          <label htmlFor="time-input">Time:</label>
          <select value={time} onChange={this.changeTime.bind(this)}>
            {renderedTimes}
          </select>
        </li>
      );
    }

    return (
      <div className="subreddit-picker">
        <ul>
          <li>
            <input
              type="text"
              ref="subredditInput"
              placeholder="Subreddit"
              onKeyDown={this.handleKeyDown.bind(this)}
            />
          </li>
          <li>
            <label htmlFor="sort-input">Sort:</label>
            <select value={sort} onChange={this.changeSort.bind(this)}>
              {renderedSorts}
            </select>
          </li>
          {timeSelector}
          <li>
            <select value={count} onChange={this.changeCount.bind(this)}>
              {renderedCounts}
            </select>
          </li>
          <li>
            <button onClick={this.handleView.bind(this)}>View</button>
          </li>
        </ul>
      </div>
    );
  }
}

SubredditPicker.propTypes = propTypes;

export default SubredditPicker;
