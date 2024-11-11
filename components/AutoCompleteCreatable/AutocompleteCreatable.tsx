import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions<OptionType>();

interface OptionType {
  name: string;
  inputValue?: string;
}

interface Props {
  options: OptionType[];
  value: string | null;
  onChange: (value: string | null) => void; // Change to accept a string
  label: string;
}

export default function FreeSoloCreateOption({
  options,
  value,
  onChange,
  label,
}: Props) {
  return (
    <Autocomplete
      value={value} // Value is now a string, not an object
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          onChange(newValue); // Pass the string directly
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          onChange(newValue.inputValue);
        } else {
          onChange(newValue ? newValue.name : null);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.name);
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            name: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.name;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.name}
          </li>
        );
      }}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
