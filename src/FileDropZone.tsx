import React, { FC, useState } from 'react';
import { css } from '@emotion/react';

type FileDropZoneProps = {
  message?: string;
}

export const FileDropZone: FC<FileDropZoneProps> = (props) => {
  const {
    message = 'Drop files or folders here'
  } = props;

  const [dragOver, setDragOver] = useState(false);

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
  );
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