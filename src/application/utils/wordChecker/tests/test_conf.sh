#!/bin/bash

input_file="fixtures.json"
output_file="test_fixtures.json"

if [[ ! -f "$input_file" ]]; then
    echo "Input file '$input_file' not found."
    exit 1
fi

jq '[to_entries | .[] | select(.key % 30 == 0) | .value]' "$input_file" > "$output_file"

echo "Processing complete. Output written to '$output_file'."