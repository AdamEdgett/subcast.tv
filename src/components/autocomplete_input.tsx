import React from "react";
import PropTypes from "prop-types";
import Downshift from "downshift";
import Input from "material-ui/Input";
import Paper from "material-ui/Paper";
import { MenuItem } from "material-ui/Menu";

interface SuggestionProps {
  highlightedIndex: number | null;
  index: number;
  itemProps: object;
  selectedItem: string;
  suggestion: string;
}

function Suggestion(props: SuggestionProps) {
  const {
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem
  } = props;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || "").indexOf(suggestion) > -1;

  return (
    <MenuItem
      {...itemProps}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion}
    </MenuItem>
  );
}

function getMatchedSuggestions(suggestions: Array<string>, inputValue: string) {
  let count = 0;

  return suggestions.filter(suggestion => {
    const keep =
      (!inputValue ||
        suggestion.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
      count < 5;

    if (keep) {
      count += 1;
    }

    return keep;
  });
}

interface AutocompleteInputProps {
  suggestions: Array<string>;
  onChange: (value: string) => void;
  defaultInputValue?: string;
  onKeyDown?: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

function AutocompleteInput(props: AutocompleteInputProps) {
  const { suggestions, defaultInputValue, onChange, ...inputProps } = props;
  return (
    <Downshift
      onInputValueChange={onChange}
      defaultInputValue={defaultInputValue}
      onChange={value => console.log("CHANGE", value)}
      onSelect={value => console.log("SELECT", value)}
    >
      {({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex
      }) => (
        <div className="autocomplete-input">
          <Input {...getInputProps()} className="input" {...inputProps} />
          {isOpen ? (
            <Paper square className="suggestions">
              {getMatchedSuggestions(suggestions, inputValue || "").map(
                (suggestion, index) => (
                  <Suggestion
                    suggestion={suggestion}
                    itemProps={getItemProps({ item: suggestion })}
                    highlightedIndex={highlightedIndex}
                    selectedItem={selectedItem}
                    index={index}
                    key={`${suggestion} ${index}`}
                  />
                )
              )}
            </Paper>
          ) : null}
        </div>
      )}
    </Downshift>
  );
}

export default AutocompleteInput;
