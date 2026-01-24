import React, { useState, useRef, useEffect } from 'react';
import './ImageCropper.css';

const ImageCropper = ({ image, onCropComplete, onCancel, onDeletePhoto }) => {
  console.log('ImageCropper rendered with image:', image ? 'present' : 'null');
  
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState('');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const maxWidth = 500;
      const maxHeight = 400;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
      }

      setImageSize({ width, height });
      
      // Initialize crop area to center
      const cropSize = Math.min(width, height) * 0.8;
      setCrop({
        x: (width - cropSize) / 2,
        y: (height - cropSize) / 2,
        width: cropSize,
        height: cropSize
      });
    };
    img.src = image;
  }, [image]);

  useEffect(() => {
    drawCanvas();
  }, [crop, image, imageSize]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!canvas || !img || imageSize.width === 0) return;

    canvas.width = imageSize.width;
    canvas.height = imageSize.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(img, 0, 0, imageSize.width, imageSize.height);

    // Draw dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area
    ctx.clearRect(crop.x, crop.y, crop.width, crop.height);

    // Draw crop area image
    ctx.drawImage(
      img,
      (crop.x / imageSize.width) * img.width,
      (crop.y / imageSize.height) * img.height,
      (crop.width / imageSize.width) * img.width,
      (crop.height / imageSize.height) * img.height,
      crop.x,
      crop.y,
      crop.width,
      crop.height
    );

    // Draw crop border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);

    // Draw resize handles
    const handleSize = 8;
    ctx.fillStyle = '#fff';
    
    // Corners
    ctx.fillRect(crop.x - handleSize/2, crop.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(crop.x + crop.width - handleSize/2, crop.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(crop.x - handleSize/2, crop.y + crop.height - handleSize/2, handleSize, handleSize);
    ctx.fillRect(crop.x + crop.width - handleSize/2, crop.y + crop.height - handleSize/2, handleSize, handleSize);
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const getHandle = (x, y) => {
    const handleSize = 16;
    const handles = {
      'nw': { x: crop.x, y: crop.y },
      'ne': { x: crop.x + crop.width, y: crop.y },
      'sw': { x: crop.x, y: crop.y + crop.height },
      'se': { x: crop.x + crop.width, y: crop.y + crop.height }
    };

    for (const [key, handle] of Object.entries(handles)) {
      if (Math.abs(x - handle.x) < handleSize && Math.abs(y - handle.y) < handleSize) {
        return key;
      }
    }
    return '';
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    const handle = getHandle(pos.x, pos.y);

    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else if (pos.x >= crop.x && pos.x <= crop.x + crop.width &&
               pos.y >= crop.y && pos.y <= crop.y + crop.height) {
      setIsDragging(true);
    }

    setDragStart(pos);
  };

  const handleMouseMove = (e) => {
    const pos = getMousePos(e);
    const dx = pos.x - dragStart.x;
    const dy = pos.y - dragStart.y;

    if (isDragging) {
      const newCrop = {
        ...crop,
        x: Math.max(0, Math.min(imageSize.width - crop.width, crop.x + dx)),
        y: Math.max(0, Math.min(imageSize.height - crop.height, crop.y + dy))
      };
      setCrop(newCrop);
      setDragStart(pos);
    } else if (isResizing) {
      let newCrop = { ...crop };

      switch (resizeHandle) {
        case 'nw':
          newCrop.x = Math.min(crop.x + crop.width - 50, crop.x + dx);
          newCrop.y = Math.min(crop.y + crop.height - 50, crop.y + dy);
          newCrop.width = crop.width - dx;
          newCrop.height = crop.height - dy;
          break;
        case 'ne':
          newCrop.y = Math.min(crop.y + crop.height - 50, crop.y + dy);
          newCrop.width = Math.max(50, crop.width + dx);
          newCrop.height = crop.height - dy;
          break;
        case 'sw':
          newCrop.x = Math.min(crop.x + crop.width - 50, crop.x + dx);
          newCrop.width = crop.width - dx;
          newCrop.height = Math.max(50, crop.height + dy);
          break;
        case 'se':
          newCrop.width = Math.max(50, crop.width + dx);
          newCrop.height = Math.max(50, crop.height + dy);
          break;
      }

      // Keep crop within bounds
      newCrop.x = Math.max(0, newCrop.x);
      newCrop.y = Math.max(0, newCrop.y);
      newCrop.width = Math.min(imageSize.width - newCrop.x, newCrop.width);
      newCrop.height = Math.min(imageSize.height - newCrop.y, newCrop.height);

      setCrop(newCrop);
      setDragStart(pos);
    }

    // Update cursor
    const handle = getHandle(pos.x, pos.y);
    if (handle) {
      canvasRef.current.style.cursor = `${handle}-resize`;
    } else if (pos.x >= crop.x && pos.x <= crop.x + crop.width &&
               pos.y >= crop.y && pos.y <= crop.y + crop.height) {
      canvasRef.current.style.cursor = 'move';
    } else {
      canvasRef.current.style.cursor = 'default';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  };

  const getCroppedImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    canvas.width = 200;
    canvas.height = 200;

    ctx.drawImage(
      img,
      (crop.x / imageSize.width) * img.width,
      (crop.y / imageSize.height) * img.height,
      (crop.width / imageSize.width) * img.width,
      (crop.height / imageSize.height) * img.height,
      0, 0, 200, 200
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const handleConfirm = () => {
    const croppedImageData = getCroppedImage();
    onCropComplete(croppedImageData);
  };

  const handleDelete = () => {
    if (onDeletePhoto) {
      onDeletePhoto();
    }
  };

  return (
    <div className="image-cropper">
      <div className="cropper-container" ref={containerRef}>
        <img
          ref={imageRef}
          src={image}
          alt="Crop"
          style={{ display: 'none' }}
        />
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      <div className="cropper-actions">
        <button type="button" className="crop-btn cancel" onClick={onCancel}>
          Cancel
        </button>
        {onDeletePhoto && (
          <button type="button" className="crop-btn delete" onClick={handleDelete}>
            Delete Photo
          </button>
        )}
        <button type="button" className="crop-btn confirm" onClick={handleConfirm}>
          Crop & Apply
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;