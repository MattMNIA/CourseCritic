import { useEffect, useRef } from 'react';

const AdUnit = ({ slot, format = 'auto' }) => {
  const adRef = useRef(null);

  useEffect(() => {
    console.log('AdUnit mounted, slot:', slot);
    
    const initAd = () => {
      try {
        if (window.adsbygoogle) {
          console.log('Pushing ad to AdSense for slot:', slot);
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } else {
          console.warn('Waiting for AdSense...');
          setTimeout(initAd, 500); // Retry after 500ms
        }
      } catch (error) {
        console.error('Error initializing ad:', error);
      }
    };

    // Initialize ad after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(initAd, 100);

    return () => {
      clearTimeout(timeoutId);
      console.log('AdUnit unmounted, slot:', slot);
    };
  }, [slot]);

  return (
    <div className="ad-container my-4" style={{ minHeight: '100px', background: '#f8f9fa' }}>
      <div className="text-center text-muted small mb-1">Advertisement</div>
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: 'block',
          minHeight: '80px',
          border: '1px solid #dee2e6'
        }}
        data-ad-client="ca-pub-8673032929097929"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        data-ad-test="on" // Add this for testing
      />
    </div>
  );
};

export default AdUnit;
