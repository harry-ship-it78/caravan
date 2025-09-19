import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for auto-fit viewport scaling in mobile layout mode
 * Implements contain-style scaling with letterboxing/pillarboxing
 */
export const useViewportScaling = (isMobileMode) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState(16 / 9); // Default fallback

  const calculateScaling = useCallback(() => {
    if (!isMobileMode) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
      return;
    }

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Detect aspect ratio or use fallback
    let targetRatio = viewportWidth / viewportHeight;
    
    // If ratio seems unreasonable, fallback to 16:9
    if (targetRatio < 0.5 || targetRatio > 2.5) {
      targetRatio = 16 / 9;
    }
    
    setAspectRatio(targetRatio);

    // Get the actual app content element to measure its natural size
    const appElement = document.querySelector('.app');
    if (!appElement) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
      return;
    }

    // Temporarily remove scaling to measure natural size
    const originalTransform = appElement.style.transform;
    const originalWidth = appElement.style.width;
    const originalHeight = appElement.style.height;
    
    appElement.style.transform = '';
    appElement.style.width = '';
    appElement.style.height = '';
    
    // Get natural content dimensions
    const rect = appElement.getBoundingClientRect();
    const contentWidth = rect.width;
    const contentHeight = rect.height;
    
    // Restore original styling
    appElement.style.transform = originalTransform;
    appElement.style.width = originalWidth;
    appElement.style.height = originalHeight;
    
    // Use minimum dimensions to prevent tiny scaling
    const minWidth = Math.max(contentWidth, 320);
    const minHeight = Math.max(contentHeight, 480);
    
    // Calculate scaling factors for both dimensions
    const scaleX = viewportWidth / minWidth;
    const scaleY = viewportHeight / minHeight;
    
    // Use the smaller scale to ensure content fits (contain behavior)
    // Also limit maximum scale to prevent content from becoming too large
    const finalScale = Math.min(scaleX, scaleY, 1);
    
    // Calculate centered offset for letterboxing/pillarboxing
    const scaledWidth = minWidth * finalScale;
    const scaledHeight = minHeight * finalScale;
    
    const offsetX = (viewportWidth - scaledWidth) / 2;
    const offsetY = (viewportHeight - scaledHeight) / 2;
    
    setScale(finalScale);
    setOffset({ x: offsetX, y: offsetY });
  }, [isMobileMode]);

  // Set up event listeners for window resize and orientation change
  useEffect(() => {
    // Delay initial calculation to allow DOM to render
    const timeoutId = setTimeout(calculateScaling, 100);
    
    const handleResize = () => calculateScaling();
    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated after orientation change
      setTimeout(calculateScaling, 100);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [calculateScaling]);

  // Return scaling transform styles
  const getScalingStyles = useCallback(() => {
    if (!isMobileMode) {
      return {};
    }
    
    return {
      transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
      transformOrigin: 'top left',
    };
  }, [isMobileMode, scale, offset]);

  const getContainerStyles = useCallback(() => {
    if (!isMobileMode) {
      return {};
    }
    
    return {
      overflow: 'hidden',
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
    };
  }, [isMobileMode]);

  return {
    scale,
    offset,
    aspectRatio,
    getScalingStyles,
    getContainerStyles,
    isScaling: isMobileMode && scale !== 1,
  };
};