import React, { Component } from "react";
import PropTypes from "prop-types";
import { map, first } from "underscore";

import { FormControl, FormHelperText } from "material-ui/Form";
import Button from "material-ui/Button";
import Input, { InputLabel } from "material-ui/Input";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";

import AutocompleteInput from "components/autocomplete_input";

import sorts from "values/sorts";
import sortTimes from "values/sort_times";

const VIDEO_SUBREDDITS = ["videos", "youtubehaiku", "listentothis"];

interface SubredditPickerProps {
  subreddit?: string;
  sort?: string;
  time?: string;
  onSubredditChange: (
    subredditChange: { subreddit: string; sort: string; time: string }
  ) => void;
}

interface SubredditPickerState {
  subreddit: string;
  sort: string;
  time: string;
}

class SubredditPicker extends Component<
  SubredditPickerProps,
  SubredditPickerState
> {
  private subredditInput: HTMLInputElement;

  constructor(props: SubredditPickerProps) {
    super(props);
    this.state = {
      subreddit: props.subreddit || "",
      sort: props.sort || first(sorts) || "hot",
      time: props.time || first(sortTimes as Array<string>) || "hour"
    };
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      (event as any).preventDownshiftDefault = true;
      this.handleView();
    }
  }

  private changeSubreddit(value: string): void {
    this.setState({ subreddit: value });
  }

  private changeSort(event: any): void {
    this.setState({ sort: event.target.value });
  }

  private changeTime(event: any): void {
    this.setState({ time: event.target.value });
  }

  private handleView(): void {
    const { onSubredditChange } = this.props;
    const { subreddit, sort, time } = this.state;
    onSubredditChange({ subreddit, sort, time });
  }

  public render(): JSX.Element {
    const { subreddit, sort, time } = this.state;
    const renderedSorts = map(sorts, (sortValue: string) => {
      return (
        <MenuItem value={sortValue} key={sortValue}>
          {sortValue}
        </MenuItem>
      );
    });

    let timeSelector;
    if (sort === "top" || sort === "controversial") {
      const renderedTimes = map(
        sortTimes as Array<string>,
        (timeLabel: string, timeValue: string) => {
          return (
            <MenuItem value={timeValue} key={timeValue}>
              {timeLabel}
            </MenuItem>
          );
        }
      );

      timeSelector = (
        <FormControl>
          <InputLabel htmlFor="time-input">Time:</InputLabel>
          <Select
            value={time}
            onChange={this.changeTime.bind(this)}
            inputProps={{ id: "time-input" }}
          >
            {renderedTimes}
          </Select>
        </FormControl>
      );
    }

    return (
      <div className="subreddit-picker">
        <FormControl>
          <AutocompleteInput
            suggestions={VIDEO_SUBREDDITS}
            onChange={this.changeSubreddit.bind(this)}
            defaultInputValue={subreddit}
            placeholder="Subreddit"
            autoFocus
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="sort-input">Sort:</InputLabel>
          <Select
            value={sort}
            onChange={this.changeSort.bind(this)}
            inputProps={{ id: "sort-input" }}
          >
            {renderedSorts}
          </Select>
        </FormControl>
        {timeSelector}
        <FormControl className="view-wrapper">
          <Button
            variant="raised"
            color="primary"
            className="view"
            onClick={this.handleView.bind(this)}
          >
            View
          </Button>
        </FormControl>
      </div>
    );
  }
}

export default SubredditPicker;
