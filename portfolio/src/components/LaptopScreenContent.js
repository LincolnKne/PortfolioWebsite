import React, { useEffect } from 'react';
import '../App.css';

const LaptopScreenContent = () => {
    useEffect(() => {
        console.log('LaptopScreenContent rendered');
      }, []);
    
  return (
    <div className="laptop-screen-content">
      <h1>Welcome to My Virtual Laptop</h1>
      <p>This is a simulated webpage rendered on a 3D laptop screen.</p>
      <p>You can add any React components here, such as text, images, forms, etc.</p>
    </div>
  );
};

export default LaptopScreenContent;
