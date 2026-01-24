import React from 'react';

const ProtectedImage = ({ imageUrl, alt = "Fortune Floors Property" }) => {
  return (
    <img
      src={imageUrl}
      alt={alt}
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
      draggable={false}
    />
  );
};

export default ProtectedImage;
