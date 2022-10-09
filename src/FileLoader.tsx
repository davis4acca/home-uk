import React, { FC } from 'react';
import { css } from '@emotion/react';
import { Button } from '@mui/material';

// type FileLoaderProps = {
// }

enum PricePaidColumns {
  id,
  price,
  date,
  postcode,
  property_type,
  old,
  duration,
  primary_name, // for example, the house number or name
  secondary_name, // for example, flat number
  street,
  locality,
  town,
  district,
  county
}

type PricePaidRecord = [
  string,
  number,
  Date,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

// Loading the price paid CSV file using File System Access API:
// https://wicg.github.io/file-system-access/
export const FileLoader: FC = () => {
  const onOpenFileClick = async () => {
    const textDecoder = new TextDecoder();
    try {
      const [fileHandle] = await window.showOpenFilePicker(filePickerOptions);
      console.log(`File: ${fileHandle.name}`);

      const file = await fileHandle.getFile();
      // const contents = await file.text();
      const stream = await file.stream();
      const reader = stream.getReader();
      let remainder = '';
      const records: PricePaidRecord[] = [];
      for (; ;) {
        const result = await reader.read();
        if (result.done) {
          break;
        }
        const chunk = remainder + textDecoder.decode(result.value);
        const lastLineBreak = chunk.lastIndexOf('\n');
        remainder = lastLineBreak === chunk.length - 1 ? '' : chunk.substring(lastLineBreak);
        const chunkLines = chunk.split('\n');
        chunkLines.pop(); // the last line is either the remainder or an empty string
        const chunkRecords: PricePaidRecord[] = chunkLines.map(line => {
          const columns = line.split(',').slice(0, -2);
          return columns.map((quotedColumn, i) => {
            const column = quotedColumn.length >= 2 ? quotedColumn.slice(1, -1) : '';
            switch (i) {
              case PricePaidColumns.price:
                return parseInt(column, 10);
              case PricePaidColumns.date:
                return new Date(column);
              default:
                return column;
            }
          }) as PricePaidRecord;
        });
        // Mutating records with splice is faster than using concat and reassigning.
        records.splice(records.length, 0, ...chunkRecords);
      }
      console.log(records.length);
      console.log(records);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      css={containerStyle}>
      <Button
        onClick={onOpenFileClick}
        variant='outlined'>
        Open file...
      </Button>
    </div>
  );
};

const filePickerOptions = {
  types: [
    {
      description: 'CSV files',
      accept: {
        'csv/*': ['.csv']
      }
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false
};

const containerStyle = css({
  display: 'flex',
  flexFlow: 'column',
  alignItems: 'center',
  gap: '10px'
});