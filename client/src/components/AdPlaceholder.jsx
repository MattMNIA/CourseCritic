const AdPlaceholder = () => (
  <div 
    className="ad-placeholder my-4 text-center p-3" 
    style={{ 
      background: '#f8f9fa',
      border: '1px solid #dee2e6',
      minHeight: '100px'
    }}
  >
    <div className="text-muted small">Advertisement Space</div>
    <div className="text-muted small mt-1">(Pending AdSense Approval)</div>
  </div>
);

export default AdPlaceholder;
