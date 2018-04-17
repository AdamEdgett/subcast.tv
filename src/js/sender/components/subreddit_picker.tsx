import React, { Component } from "react";
import PropTypes from "prop-types";
import { map, first } from "underscore";

import sorts from "values/sorts";
import sortTimes from "values/sort_times";

interface SubredditPickerProps {
  onSubredditChange: (subredditChange: { subreddit: string, sort: string, time: string }) => void;
}

interface SubredditPickerState {
  sort: string;
  time: string;
}

class SubredditPicker extends Component<SubredditPickerProps, SubredditPickerState> {
  constructor(props: SubredditPickerProps) {
    super(props);
    this.state = {
      sort: first(sorts) || "hot",
      time: first(sortTimes as Array<string>) || "hour",
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

  private handleView(): void {
    const { onSubredditChange } = this.props;
    const subreddit = (this.refs.subredditInput as HTMLInputElement).value;
    const { sort, time } = this.state;
    onSubredditChange({ subreddit, sort, time });
  }

  public render(): JSX.Element {
    const { sort, time } = this.state;
    const renderedSorts = map(sorts, (sortValue: string) => {
      return <option value={sortValue} key={sortValue}>{sortValue}</option>;
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
              autoFocus
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
            <button onClick={this.handleView.bind(this)}>View</button>
          </li>
        </ul>
      </div>
    );
  }
}

export default SubredditPicker;
