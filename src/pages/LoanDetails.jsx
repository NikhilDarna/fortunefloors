import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoanDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/loan-form");
    return null;
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        CIBIL Score Details
      </h2>
      <p><strong>Name:</strong> {state.name}</p>
      <p><strong>Date of Birth:</strong> {state.dob}</p>
      <p><strong>PAN Number:</strong> {state.pan}</p>
      <p><strong>CIBIL Score:</strong> {state.cibilScore}</p>
      <p><strong>Last Checked:</strong> {new Date(state.lastChecked).toLocaleString()}</p>

      <button
        onClick={() => navigate("/loan-form")}
        style={{
          marginTop: "20px",
          width: "100%",
          background: "#007bff",
          color: "#fff",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go Back
      </button>
    </div>
  );
};

export default LoanDetails;
