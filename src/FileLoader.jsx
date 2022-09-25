import React from 'react';
import { css } from '@emotion/react';

// Loading the price paid CSV file using File System Access API:
// https://wicg.github.io/file-system-access/
export function FileLoader() {
  const onOpenFileClick = async () => {
    const [fileHandle] = await window.showOpenFilePicker(filePickerOptions);
    const file = await fileHandle.getFile();
    // const contents = await file.text();
    const stream = await file.stream();
    const reader = stream.getReader();
  };

  const onDrop = async (e) => {
    e.preventDefault();

    const fileHandlesPromises = [...e.dataTransfer.items]
      .filter((item) => item.kind === 'file')
      .map((item) => item.getAsFileSystemHandle());

    for await (const handle of fileHandlesPromises) {
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
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        css={dropZoneStyle}
      ></div>
      <button onClick={onOpenFileClick}>Open file...</button>
    </div>
  );
}

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

const dropZoneStyle = css({
  borderRadius: '10%',
  width: '100px',
  height: '100px',
  backgroundColor: 'pink',
  '&:hover': {
    backgroundColor: 'violet'
  },
  transition: 'background-color 1s',
});

const containerStyle = css({
  display: 'flex',
  flexFlow: 'column',
  alignItems: 'center',
  gap: '10px'
});