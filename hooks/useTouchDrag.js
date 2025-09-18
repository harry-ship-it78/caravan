// Touch drag and drop utilities for mobile support
import { useCallback, useRef, useState } from 'react';

export const useTouchDrag = (onDragStart, onDragEnd) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragData, setDragData] = useState(null);
  const dragRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e, dragPayload) => {
    const touch = e.touches[0];
    if (!touch) return;

    startPosRef.current = { x: touch.clientX, y: touch.clientY };
    setDragData(dragPayload);
    setIsDragging(true);
    
    if (onDragStart) {
      onDragStart(dragPayload);
    }

    // Prevent scrolling while dragging
    e.preventDefault();
  }, [onDragStart]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    if (!touch) return;

    // Visual feedback could be added here
    e.preventDefault();
  }, [isDragging]);

  const handleTouchEnd = useCallback((e) => {
    if (!isDragging) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    // Find what element is under the touch point
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    
    setIsDragging(false);
    
    if (onDragEnd && elementBelow) {
      onDragEnd(dragData, elementBelow);
    }
    
    setDragData(null);
  }, [isDragging, dragData, onDragEnd]);

  return {
    isDragging,
    dragData,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    }
  };
};

// Helper to find drop target from touch coordinates
export const findDropTarget = (clientX, clientY, dropSelectors = []) => {
  const element = document.elementFromPoint(clientX, clientY);
  if (!element) return null;

  // Check if element or its parents match any drop selectors
  let current = element;
  while (current && current !== document.body) {
    for (const selector of dropSelectors) {
      if (current.matches && current.matches(selector)) {
        return current;
      }
    }
    current = current.parentElement;
  }

  return null;
};

// Enhanced drag data transfer for touch events
export const createTouchTransfer = (data) => {
  return {
    setData: (format, value) => {
      // Store in a global or component state for touch events
      window.__touchDragData = window.__touchDragData || {};
      window.__touchDragData[format] = value;
    },
    getData: (format) => {
      return window.__touchDragData?.[format] || '';
    },
    clearData: () => {
      window.__touchDragData = {};
    }
  };
};