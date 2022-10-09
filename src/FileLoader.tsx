import React, { FC } from 'react';
import { css } from '@emotion/react';
import { Button } from '@mui/material';
import { MapView } from './MapView';
import { parseStream } from './pricePaidParser';

// type FileLoaderProps = {
// }



// Loading the price paid CSV file using File System Access API:
// https://wicg.github.io/file-system-access/
export const FileLoader: FC = () => {
  const onOpenFileClick = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker(filePickerOptions);
      console.log(`File: ${fileHandle.name}`);

      const file = await fileHandle.getFile();
      const stream = await file.stream();
      parseStream(stream).then(records => {
        console.log(records.length);
        console.log(records);
      });
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
      <MapView />
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