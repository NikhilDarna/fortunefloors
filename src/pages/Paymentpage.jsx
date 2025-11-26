// src/pages/PaymentPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const chosenPlan = location.state?.plan || "No plan selected";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full text-center">
        <h1 className="text-2xl font-bold mb-3">Payment Gateway (Placeholder)</h1>
        <p className="text-gray-600 mb-6">Chosen Plan: <span className="font-semibold">{chosenPlan}</span></p>

        <div className="mb-6">
          <p className="text-sm text-gray-700">
            This is a placeholder page. Payment integration will go here. For now, no real transactions occur.
          </p>
        </div>

        <button onClick={() => navigate("/subscription")} className="px-6 py-2 bg-gray-800 text-white rounded-lg">
          Back to Plans
        </button>
      </div>
    </div>
  );
}
