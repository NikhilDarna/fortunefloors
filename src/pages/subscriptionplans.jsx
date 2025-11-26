import React from "react";
import { useNavigate } from "react-router-dom";
import "./Subscription.css"; // ✅ Already has the CSS

const plans = [
  {
    name: "Silver",
    price: "₹3000",
    duration: "per year",
    features: ["Post up to 5 properties", "Basic visibility", "Email support"],
    gradient: "from-gray-100 to-gray-50",
    iconColor: "text-gray-500",
  },
  {
    name: "Gold",
    price: "₹5000",
    duration: "per year",
    features: ["Post up to 15 properties", "Priority listing", "Analytics"],
    gradient: "from-yellow-200 via-yellow-100 to-yellow-50",
    iconColor: "text-yellow-500",
    popular: true, // Gold is featured
  },
  {
    name: "Platinum",
    price: "₹8000",
    duration: "per year",
    features: ["Unlimited posts", "Top placement", "Dedicated manager"],
    gradient: "from-slate-800 to-slate-600",
    iconColor: "text-white",
  },
];

export default function SubscriptionPlans() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-gray to-gray-100 py-20 px-6 flex flex-col items-center">
      <div className="Subscription">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 text-center">
          Subscription Plans
        </h1>
        <p className="text-gray-600 mb-12 text-lg md:text-xl text-center">
          Enjoy a{" "}
          <span className="font-semibold text-green-600">2-month free trial</span>{" "}
          on any plan.
        </p>

        {/* Horizontal Cards in a Row */}
        <div className="subscription-container cont">
          {plans.map((p) => {
            const isPlatinum = p.name === "Platinum";

            const nameClass = isPlatinum
              ? "text-3xl font-bold mb-3 text-white"
              : "text-3xl font-bold mb-3 text-gray-800";
            const priceClass = isPlatinum
              ? "text-4xl md:text-5xl font-extrabold mb-1 text-white"
              : "text-4xl md:text-5xl font-extrabold mb-1 text-gray-900";
            const durationClass = isPlatinum
              ? "text-sm mb-6 text-gray-300"
              : "text-sm mb-6 text-gray-700";
            const featureTextClass = isPlatinum ? "text-gray-200" : "text-gray-800";
            const iconClass = `${p.iconColor} text-xl`;
            const buttonClass = isPlatinum
              ? "mt-auto w-full py-3 rounded-full font-semibold transition-all duration-300 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black"
              : "mt-auto w-full py-3 rounded-full font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-indigo-500 hover:to-blue-600";

            return (
              <div
                key={p.name}
                className={`subscription-card bg-gradient-to-br none1 ${p.gradient} ${
                  p.popular ? "popular" : ""
                }`}
              >
                {/* Plan Name */}
                <h2 className={nameClass}>{p.name}</h2>
                <p className={priceClass}>{p.price}</p>
                <p className={durationClass}>{p.duration}</p>

                {/* Features List */}
                <ul className="text-left mb-6 space-y-2 w-full name1">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className={iconClass}></span>
                      <span className={featureTextClass}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                <button
                  onClick={() => navigate("/payment", { state: { plan: p.name } })}
                  className={buttonClass}
                >
                  Select {p.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
