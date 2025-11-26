import React from "react";
import "./WhyChooseUs.css"; // import the CSS file
import { Building2, ShieldCheck, Users } from "lucide-react"; // keep or replace icons if needed

const WhyChooseUs = () => {
  return (
    <section className="why-section">
      <h3 className="why-subtitle">BENEFITS OF OUR PLATFORM</h3>
      <h2 className="why-title">Why Choose Us</h2>

      <div className="why-cards">
        <div className="why-card">
          <Building2 className="why-icon" />
          <h4 className="why-card-title">01. Over 10,000+ Properties</h4>
          <p className="why-card-text">
            New and verified listings are added every day.
          </p>
        </div>

        <div className="why-card">
          <ShieldCheck className="why-icon" />
          <h4 className="why-card-title">02. Verified by Our Team</h4>
          <p className="why-card-text">
            Photos, videos, and other property details are verified on site.
          </p>
        </div>

        <div className="why-card">
          <Users className="why-icon" />
          <h4 className="why-card-title">03. Large User Base</h4>
          <p className="why-card-text">
            A huge and active user community to help close deals faster.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
