import React, { useRef, useEffect, useState } from 'react';

interface RealGoogleFrameProps {
  onSearch: (query: string) => void;
  onNavigateUrl: (url: string) => void;
  onFrameClick?: (x: number, y: number) => void;
}

export const RealGoogleFrame: React.FC<RealGoogleFrameProps> = ({
  onSearch,
  onNavigateUrl,
  onFrameClick,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === 'GOOGLE_SEARCH' && e.data.query) {
        onSearch(e.data.query);
      } else if (e.data.type === 'OPEN_URL' && e.data.url) {
        onNavigateUrl(e.data.url);
      } else if (e.data.type === 'IFRAME_CLICK' && onFrameClick) {
        // Adjust iframe offset if necessary
        onFrameClick(e.data.x, e.data.y);
      }
    };

    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, [onSearch, onNavigateUrl, onFrameClick]);

  return (
    <div className="relative w-full h-full bg-white flex flex-col overflow-hidden">
      <iframe
        ref={iframeRef}
        src="/api/proxy?url=https://www.google.com/?hl=en&gl=us"
        className="w-full h-full border-0 bg-white"
        title="Google"
      />
    </div>
  );
};
