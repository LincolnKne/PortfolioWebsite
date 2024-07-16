// Loading.js
import React from 'react';

const Loading = () => {
  return (
    <div style={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black' // Optional: Ensure the background is black to match video
    }}>
      <video 
        src="/Loading.mp4" 
        autoPlay 
        loop 
        muted 
        style={{ 
          maxWidth: '50%', 
          maxHeight: '50%' 
        }}
      />
    </div>
  );
};

export default Loading;
