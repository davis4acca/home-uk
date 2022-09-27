import React, { FC, useState } from 'react';
import { css } from '@emotion/react';
import { Button } from '@mui/material';

type FileLoaderProps = {
  message: string;
}

// Loading the price paid CSV file using File System Access API:
// https://wicg.github.io/file-system-access/
export const FileLoader: FC<FileLoaderProps> = (props) => {
  const {
    message = 'Drop files or folders here'
  } = props;

  const [dragOver, setDragOver] = useState(false);

  const onOpenFileClick = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker(filePickerOptions);
      console.log(`File: ${fileHandle.name}`);

      const file = await fileHandle.getFile();
      // const contents = await file.text();
      const stream = await file.stream();
      const reader = stream.getReader();
    } catch (e) {
      console.error(e);
    }
  };

  const onDragEnd = () => setDragOver(false);

  const onDrop: React.DragEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault();
    onDragEnd();

    const fileHandlesPromises = [...event.dataTransfer.items]
      .filter(item => item.kind === 'file')
      .map(item => item.getAsFileSystemHandle());

    for await (const handle of fileHandlesPromises) {
      if (!handle) {
        continue;
      }
      if (handle.kind === 'directory') {
        console.log(`Directory: ${handle.name}`);
      } else {
        console.log(`File: ${handle.name}`);
      }
    }
  };

  return (
    <div
      css={containerStyle}>
      <div
        aria-label='CSV File Drop Zone'
        onDragOver={event => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={onDragEnd}
        onDragEnd={onDragEnd}
        onDrop={onDrop}
        css={dropZoneStyle(dragOver)}
      >
        <div>{message}</div>
      </div>
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

const dropZoneStyle = (dragOver: boolean) => css({
  width: '120px',
  height: '80px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  userSelect: 'none',
  backgroundColor: dragOver ? 'violet' : 'pink',
  borderStyle: 'solid',
  borderColor: 'black',
  borderRadius: '5px',
  boxSizing: 'border-box',
  transitionProperty: 'background',
  transitionDuration: '0.5s',
  transitionTimingFunction: 'ease-out'
});

const containerStyle = css({
  display: 'flex',
  flexFlow: 'column',
  alignItems: 'center',
  gap: '10px'
});