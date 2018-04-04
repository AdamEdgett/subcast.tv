import React, { Component } from "react";
import PropTypes from "prop-types";
import { map, first } from "underscore";

import sorts from "values/sorts";
import sortTimes from "values/sort_times";
import counts from "values/counts";

interface SubredditPickerProps {
  onSubredditChange: (subredditChange: { subreddit: string, sort: string, time: string, count: number }) => void;
}

interface SubredditPickerState {
  sort: string;
  time: string;
  count: number;
}

class SubredditPicker extends Component<SubredditPickerProps, SubredditPickerState> {
  constructor(props: SubredditPickerProps) {
    super(props);
    this.state = {
      sort: first(sorts) || "hot",
      time: first(sortTimes as Array<string>) || "hour",
      count: 25,
    };
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.handleView();
    }
  }

  private changeSort(event: React.FormEvent<HTMLSelectElement>): void {
    this.setState({ sort: event.currentTarget.value });
  }

  private changeTime(event: React.FormEvent<HTMLSelectElement>): void {
    this.setState({ time: event.currentTarget.value });
  }

  private changeCount(event: React.FormEvent<HTMLSelectElement>): void {
    this.setState({ count: parseInt(event.currentTarget.value, 10) });
  }

  private handleView(): void {
    const { onSubredditChange } = this.props;
    const subreddit = (this.refs.subredditInput as HTMLInputElement).value;
    const { sort, time, count } = this.state;
    onSubredditChange({ subreddit, sort, time, count });
  }

  public render(): JSX.Element {
    const { sort, time, count } = this.state;
    const renderedSorts = map(sorts, (sortValue: string) => {
      return <option value={sortValue} key={sortValue}>{sortValue}</option>;
    });

    const renderedCounts = map(counts, (countValue: string) => {
      return <option value={countValue} key={countValue}>{countValue}</option>;
    });

    let timeSelector;
    if (sort === "top" || sort === "controversial") {
      const renderedTimes = map(sortTimes as Array<string>, (timeLabel: string, timeValue: string) => {
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

export default SubredditPicker;
