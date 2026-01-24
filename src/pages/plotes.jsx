import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Plots = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the all-properties listing filtered for plots
    navigate('/all-properties');
  }, [navigate]);

  return (
    <div style={{padding:40,textAlign:'center'}}>
      <h2>Redirecting to Plots...</h2>
      <p>If you are not redirected, <a href="/all-properties?propertyType=plot">click here</a>.</p>
    </div>
  );
};

export default Plots;
