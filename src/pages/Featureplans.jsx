import React from "react";
import "./FeaturePlans.css";

const FeaturePlans = () => {
  const plans = [
    { title: "Geo Tagging", price: "", features: [] },
    { title: "Loan Assistance", price: "", features: [] },
    { title: "Language Translator", price: "", features: [] },
    { title: "Wishlist", price: "", features: [] },
    { title: "Multiple Login Authentications", price: "", features: [] },
    { title: "Near By Locations", price: "Eassy to Search", features: [] },
    { title: "3D View", price: "", features: [] },
    { title: "AI Recomandations", price: "", features: [] },
    { title: "Live Chat Boot", price: "", features: [] },
    { title: "Quick Compare", price: "", features: [] },
    { title: "Saved Search Results", price: "", features: [] },
    { title: "Secure Payment Gate Way", price: "", features: [] },
    { title: "Load Test 10K Customer Before going Live", price: "", features: [] },
  ];

  return (
    <div className="plans-page">
      <h1>Feature Plans</h1>
      <p>Upcomming All Updates...</p>
      <div className="plans-container">
        {plans.map((plan, index) => (
          <div className="plan-card" key={index}>
            <h2>{plan.title}</h2>
            <h3>{plan.price}</h3>
            {plan.features.length > 0 ? (
              <ul>
                {plan.features.map((f, i) => (
                  <li key={i}>✔ {f}</li>
                ))}
              </ul>
            ) : (
              <p className="placeholder">Add your plan details here...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturePlans;
