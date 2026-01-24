import React from "react";
import { useEffect } from "react";
import "./PropertyExpo.css";
import rainbow from "../assets/rainbowdev.png";
import suman from "../assets/sumantv.png";
import VisionVVk from "../assets/logos-sponsers/visionvvk.png";
import fsb from "../assets/logos-sponsers/fsb.webp";
import partystories from "../assets/logos-sponsers/partystories.webp";
import Cybercitydevelopers from "../assets/logos-sponsers/cybercity.png";
import AuroReality from "../assets/logos-sponsers/auro.png";
import Honer from "../assets/logos-sponsers/honor.jpg";
import Adhirana from "../assets/logos-sponsers/adhira.png";
import YoushithaDevelopers from "../assets/logos-sponsers/yoshitha.png";
import { FaBuilding, FaUsers, FaTags, FaExpand } from "react-icons/fa";
import fsb1 from "../assets/ff-interiors.png";




const PropertyExpo = () => {

  const SHEET_WEBHOOK =
    "https://script.google.com/macros/s/AKfycbz5pgh6q27-qES6bWVUrmKZZVAFRMf7GDmChmCBw-hEJsQ2jLusaGcMUI2JPs1Tg1vVWA/exec";


  /* ========== EXHIBITOR SUBMIT ========== */
  const handleExhibitorSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    await fetch(SHEET_WEBHOOK, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "exhibitor",
        name: data.name,
        phone: data.phone,
        email: data.email,
        city: data.city,
        category: data.category,
        message: data.message,
      }),
    });

    alert("Exhibitor registered successfully");
    e.target.reset();
  };


  /* ========== VISITOR SUBMIT ========== */
  const handleVisitorSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    await fetch(SHEET_WEBHOOK, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "visitor",
        name: data.name,
        phone: data.phone,
        email: data.email,
        city: data.city,
        interest: data.interest,
        message: data.message,
      }),
    });

    alert("Visitor registered successfully");
    e.target.reset();
  };

useEffect(() => {
  const section = document.querySelector(".animate-on-scroll");

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add("in-view");
      }
    },
    { threshold: 0.3 }
  );

  if (section) observer.observe(section);

  return () => observer.disconnect();
}, []);
  const faqs = [
  {
    q: "What is the FortuneFloors Property & Interior Expo?",
    a: "The FortuneFloors Property & Interior Expo is a curated real estate and home interiors event where leading builders, interior brands, financial partners, and service providers come together under one roof. Visitors can explore projects, compare options, and get exclusive expo-only deals."
  },
  {
    q: "Who should visit this expo?",
    a: "This expo is ideal for home buyers, property investors, families planning interiors, NRIs, and anyone looking to buy, invest, or renovate a home. Whether you are buying your first home or upgrading, the expo offers something for everyone."
  },
  {
    q: "Is entry to the expo free?",
    a: "Yes. Entry is completely FREE for visitors, but prior registration is required to get your free entry pass and access exclusive offers at the event."
  },
  {
    q: "What kind of properties will be showcased?",
    a: "You can explore apartments, villas, open plots, gated communities, luxury homes, and commercial properties from trusted developers across Hyderabad and nearby regions."
  },
  {
    q: "Can I get interior design and cost estimates at the expo?",
    a: "Absolutely. Interior experts will provide one-on-one consultations, design ideas, and real-time cost estimates based on your home size, budget, and preferences."
  },
  {
    q: "Will banks or home loan providers be available?",
    a: "Yes. Leading banks and financial institutions will be present to help you with home loans, eligibility checks, interest rates, and on-the-spot guidance."
  },
  
];

  return (
    <div className="expo-page">
      {/* ================= HERO / HEADER ================ */}
      <header className="expo-hero">
        <nav className="expo-nav">
          <div className="expo-logo">
            <span className="expo-logo-mark">FF</span>
            <span className="expo-logo-text">FortuneFloors Property Expo 2026</span>
          </div>
          <div className="expo-nav-links">
            <a href="#register">Register</a>
            <a href="#about">About Expo</a>
            <a href="#what-we-offer">What We Offer</a>
            <a href="#why-visit">Why Should Exhibit</a>
            <a href="#faq">FAQ</a>
          </div>
        </nav>
        {/* ===== VIDEO HERO SECTION ===== */}
<section className="expo-video-section">
  <div className="video-wrapper">
  <iframe
  src="https://www.youtube.com/embed/tPRF7WTM1uw?autoplay=1&mute=0&controls=1&fs=1&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=tPRF7WTM1uw"
  title="Expo Video"
  frameBorder="0"
  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
  allowFullScreen
/>

  <div className="video-overlay">
    <div className="rotating-circle">
      <svg viewBox="0 0 200 200">
        <defs>
          <path
            id="circlePath"
            d="M100,100 m-75,0 a75,75 0 1,1 150,0 a75,75 0 1,1 -150,0"
          />
        </defs>
        <text fontSize="12" fill="white" letterSpacing="2">
          <textPath className="text-video"href="#circlePath">
           •Welocme to HYDERABAD • 2026-Property Expo Naina Gardens
          </textPath>
          
        </text>
      </svg>
    </div>
  </div>
</div>
</section>
{/* ================= HERO LEAD SECTION ================= */}
<section className="mi-hero">
  <div className="mi-hero-overlay">
    <div className="mi-hero-container">

      {/* LEFT CONTENT */}
      <div className="mi-hero-left">
        <img
          src={fsb1}
          alt="FotuneFloors Interiors"
          className="mi-logo"
        />

        <h1>
          Meet Top Brands at <br />
          <span>Mega Interior Expo</span>
        </h1>

        <ul className="mi-points">
          <li>✔ 1-on-1 Consultation</li>
          <li>✔ Compare Quotes</li>
          <li>✔ Exclusive Deals</li>
        </ul>

        <div className="mi-cta">
          <input
            type="tel"
            placeholder="Enter Phone Number"
          />
          <a href="#register" className="book-pass-btn">
  Book FREE Pass
</a>

        </div>

        <div className="mi-alert">
          🎟️ Only <strong>Few Free Passes</strong> Left, Hurry Now!
        </div>
      </div>

      {/* RIGHT CARD */}
      <div className="mi-offer-card">
        <div className="mi-offer-badge">LIMITED TIME OFFER</div>

        <h3>
          Get the entry pass worth <br />
          <span className="strike">₹1000</span>
          <span className="free"> FREE!</span>
        </h3>

        <div className="mi-meta">
          <p><strong>🕙 Timing:</strong> 1pm to 7pm</p>
          <p><strong>📅 Date:</strong>  (31 jan & 1 feb)</p>
        </div>
      </div>

    </div>
  </div>
</section>
      </header>
      <div className="expo-hero-content">
          <div className="expo-hero-left">
            <p className="expo-badge">HYDERABAD * 2026 * REALESTATE EXPO</p>
            <h1 className="expo-badge-header">
              <span>One</span> Expo. <span>Endless</span> Property Opportunities.
            </h1>
            <p className="expo-hero-subtitle">
              Showcase your projects, meet serious buyers, investors, and channel partners – 
              all under one roof. Book your stall or register as a visitor now.
            </p>

            <div className="expo-hero-cta">
              <a href="#exhibitor-form" className="btn btn-primary">
                Exhibitor Registration
              </a>

              <a href="#visitor-form" className="btn btn-outline">
                Visitor / Buyer Registration
              </a>

              <a
                href="https://drive.google.com/file/d/1coe0yUX0OPUHz_Z5upUQzupWtm3sUQkc/view"
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Brochure
              </a>

              <a
                href="https://drive.google.com/uc?export=download&id=1HEJWa7bpndSMpxl9dVgkOlBydDxlQM0M"
                className="btn btn-primary"
                download
              >
                Download Brochure
              </a>
            </div>


            <div className="expo-hero-meta">
              <div>
                <strong>Dates</strong>
                <span>31ˢᵗ JAN & 1ˢᵗ FEB – 2026</span>
              </div>
              <div>
                <strong>Venue</strong>
                <span>Hyderabad • <u className="venue-addres-span">NAINA Conventions</u> , Kukatpally.</span>
              </div>
              <div>
                <strong>Contact</strong>
                <span>+91-9246582901 · fortunefloors99@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

      <main>
        {/* ===== EXPO STATS STRIP ===== */}
<section className="expo-stats-strip">
  <div className="container stats-grid">

    <div className="stat-box">
      <FaBuilding className="stat-icon" alt="Exhibitors" />
      <h3>100+</h3>
      <p>Exhibitors</p>
    </div>

    <div className="stat-box">
      <FaUsers className="stat-icon" alt="Visitors" />
      <h3>5,000+</h3>
      <p>Visitors</p>
    </div>

    <div className="stat-box">
     <FaTags className="stat-icon" alt="Brands" />
      <h3>550+</h3>
      <p>Brands On Display</p>
    </div>

    <div className="stat-box">
      <FaExpand className="stat-icon" alt="Area" />
      <h3>50,000+</h3>
      <p>Exhibition Area (Sq.Ft)</p>
    </div>

  </div>
</section>
        {/* ================= ABOUT ================ */}
        <section id="about" className="section section-alt">
          <div className="container">
            <h2>About the Property Expo</h2>
            <p className="section-subtitle">
              A curated real estate showcase where leading developers, channel partners, 
              and service providers connect directly with qualified buyers and investors.
            </p>

            <div className="about-grid">
              <div className="about-card">
                <h3>For Builders & Developers</h3>
                <p>
                  Present your flagship projects, upcoming launches, and exclusive offers to 
                  a focused audience actively looking to buy or invest.
                </p>
              </div>
              <div className="about-card">
                <h3>For Agents & Channel Partners</h3>
                <p>
                  Build new developer relationships, explore inventory options, and increase 
                  your closing pipeline with structured lead flow.
                </p>
              </div>
              <div className="about-card">
                <h3>For Buyers & Investors</h3>
                <p>
                  Visit multiple projects, compare options, talk directly to decision makers, 
                  and unlock expo-only deals in one place.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* ================= WHAT WE OFFER ================ */}
<section id="what-we-offer" className="section offer-section">
  <div className="container offer-container">

    <div className="offer-grid animate-on-scroll">
      
      {/* LEFT */}
      <div className="offer-left">
        <h2>What We Offer</h2>
        <p className="offer-desc">
          FortuneFloors Property Expo delivers <strong>end-to-end real estate solutions</strong>
          including buying, renting, interiors, finance, and legal services — all under one roof.
        </p>

        <a href="#register" className="offer-btn">
          Explore All Categories →
        </a>
      </div>

      {/* RIGHT */}
      <div className="offer-right">
        {[
          "Residential Sales",
          "Rental Properties",
          "Luxury Villas",
          "Open Plots & Land",
          "Commercial Spaces",
          "Home Interiors & Design",
          "Modular Kitchens & Furniture",
          "Home Loans & Finance",
          "Legal & Documentation",
          "Property Management",
          "Investment Advisory",
          "NRI Property Services"
        ].map((item, index) => (
          <div className="offer-item" key={index}>
            <span className="offer-dot" />
            <span>{item}</span>
          </div>
        ))}
      </div>

    </div>
  </div>
</section>


        {/* ============== INVESTORS & SPONSORS ============== */}
        <section id="sponsors" className="section">
          <div className="container">
            <h2>Event Sponsors & Co-Sponsers</h2>
            <div className="sponsor-marquee">
              <div className="scroll-frame">
                <div className="marquee-track">

                  {/* ORIGINAL LIST */}
                  {[
                    { img: rainbow, name: "Rainbow Developers", tag: "Co-Sponsor" },
                    { img: suman, name: "Suman TV", tag: "Media Sponsor" },
                    { img: VisionVVk, name: "Vision VVk Groups", tag: "Co-Sponsor" },
                    { img: fsb, name: "Fortune Business School", tag: "Sponsor" },
                    { img: partystories, name: "Party-stories", tag: "Co-Sponsor" },
                    { img: Cybercitydevelopers, name: "Cybercity developers", tag: "Sponsor" },
                    { img: AuroReality, name: "Auro Reality", tag: "Sponsor" },
                    { img: Honer, name: "Honer", tag: "Sponsor" },
                    { img: Adhirana, name: "Adhirana", tag: "Sponser" },
                    { img: YoushithaDevelopers, name: "Youshitha Developers", tag: "Sponser" },
                  ].map((s, i) => (
                    <div className="sponsor-card" key={i}>
                      <img src={s.img} alt={s.name} />
                      <h4>{s.name}</h4>
                      <span className="tag">{s.tag}</span>
                    </div>
                  ))}

                  {/* DUPLICATE LIST FOR SMOOTH LOOP */}
                  {[
                    { img: rainbow, name: "Rainbow Developers", tag: "Co-Sponsor" },
                    { img: suman, name: "Suman TV", tag: "Media Sponsor" },
                    { img: VisionVVk, name: "Vision VVk Groups", tag: "Co-Sponsor" },
                    { img: fsb, name: "Fortune Business School", tag: "Sponsor" },
                    { img: partystories, name: "Party-stories", tag: "Co-Sponsor" },
                    { img: Cybercitydevelopers, name: "Cybercity developers", tag: "Sponsor" },
                    { img: AuroReality, name: "Auro Reality", tag: "Sponsor" },
                    { img: Honer, name: "Honer", tag: "Sponsor" },
                    { img: Adhirana, name: "Adhirana", tag: "Sponser" },
                    { img: YoushithaDevelopers, name: "Youshitha Developers", tag: "Sponser" },
                  ].map((s, i) => (
                    <div className="sponsor-card" key={`dup-${i}`}>
                      <img src={s.img} alt={s.name} />
                      <h4>{s.name}</h4>
                      <span className="tag">{s.tag}</span>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ================= WHY VISIT SECTION ================= */}
<section className="why-visit-section">
  <div className="why-visit-container">

    <h2 className="why-visit-title">
      Why you should visit the Mega Interior Expo
    </h2>

    <div className="why-visit-grid">

      <div className="why-card">
        <div className="why-icon">
          <i className="icon-user" />
        </div>
        <p>One-on-One Expert Consultations</p>
      </div>

      <div className="why-card">
        <div className="why-icon">
          <i className="icon-badge" />
        </div>
        <p>Expo Only Exclusive Deals</p>
      </div>

      <div className="why-card">
        <div className="why-icon">
          <i className="icon-gallery" />
        </div>
        <p>Ultimate Design Gallery</p>
      </div>

      <div className="why-card">
        <div className="why-icon">
          <i className="icon-growth" />
        </div>
        <p>Industry Leading Brands</p>
      </div>

      <div className="why-card highlight">
        <div className="why-icon ai">
          <span>Ai✨</span>
        </div>
        <p>Real-time Cost Estimates</p>
      </div>

      <div className="why-card">
        <div className="why-icon">
          <i className="icon-clock" />
        </div>
        <p>Get Instant Quotes</p>
      </div>

    </div>
  </div>
</section>
{/* ================= INTERIOR JOURNEY SECTION ================= */}
<container id="why-visit" className="interior-journey-section">
  <div className="interior-journey-wrapper">

    {/* HEADER */}
    <div className="journey-header">
      <h2>Your Home Interior Journey In Few Easy Steps</h2>
      <p>From Design Discovery to Deal Closure – We've Made It Effortless</p>
      
    </div>

    <div className="journey-layout">

      {/* LEFT : STEPS */}
      <div className="journey-grid">

        <div className="journey-card">
          <span className="step-number">1</span>
          <img src="#" alt="Register Free" />
          <h4>Register Free</h4>
        </div>

        <div className="journey-card">
          <span className="step-number">2</span>
          <img src="/images/visit-expo.png" alt="Visit Expo" />
          <h4>Visit Expo</h4>
        </div>

        <div className="journey-card">
          <span className="step-number">3</span>
          <img src="/images/explore-brands.png" alt="Explore Brands" />
          <h4>Explore Brands</h4>
        </div>

        <div className="journey-card">
          <span className="step-number">4</span>
          <img src="/images/consultation.png" alt="Expert Consultation" />
          <h4>One-on-One Expert Consultation</h4>
        </div>

        <div className="journey-card">
          <span className="step-number">5</span>
          <img src="/images/compare-deals.png" alt="Compare Deals" />
          <h4>Compare Deals</h4>
        </div>

        <div className="journey-card">
          <span className="step-number">6</span>
          <img src="/images/block-deal.png" alt="Block Deal" />
          <h4>Block Deal</h4>
        </div>

      </div>

      {/* RIGHT : VIDEO */}
      <div className="journey-video-card">
        <div className="video-frame">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/tPRF7WTM1uw?si=b4GwLRQQf4mZl-HA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>

        <p className="video-caption">
          See how families transformed their homes with expert interior solutions.
        </p>
      </div>

    </div>
  </div>
</container>



        {/* ================= REGISTRATION FORMS ================ */}
        <section id="register" className="section">
          <div className="container">
            <h2>Register Now</h2>
            <p className="section-subtitle">
              Choose your category and fill the form. Our team will get back to you with 
              all expo details, stall options, and next steps.
            </p>

            <div className="forms-grid">
              {/* Exhibitor Form */}
              <div id="exhibitor-form" className="form-card">
                <h3>Exhibitor Registration</h3>
                <p className="form-subtext">
                  For builders, developers, channel partners, banks, PropTech, and service providers.
                </p>
                <form onSubmit={handleExhibitorSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name*</label>
                      <input name="name" type="text" required placeholder="Your Name" />
                    </div>
                    <div className="form-group">
                      <label>Company / Brand*</label>
                      <input name="company" type="text" required placeholder="Company Name" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Mobile Number*</label>
                      <input name="phone" type="tel" required placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div className="form-group">
                      <label>Email*</label>
                      <input name="email" type="email" required placeholder="you@example.com" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City*</label>
                      <input name="city" type="text" required placeholder="Hyderabad, Bangalore, etc." />
                    </div>
                    <div className="form-group">
                      <label>Category*</label>
                      <select name="category" required>
                        <option value="">Select Category</option>
                        <option value="builder">Builder / Developer</option>
                        <option value="channel-partner">Channel Partner / Broker</option>
                        <option value="bank">Bank / NBFC / Finance</option>
                        <option value="proptech">PropTech / Real Estate Service</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Projects / Requirement Brief</label>
                    <textarea
                      name="message"
                      rows="4"
                      placeholder="Tell us about your projects, budget range, stall size preference, etc."
                    />
                  </div>

                  <div className="form-group">
                    <label>How did you hear about us?</label>
                    <select name="source">
                      <option value="">Select</option>
                      <option value="social">Social Media</option>
                      <option value="website">Website / Google</option>
                      <option value="friend">Friend / Reference</option>
                      <option value="hoarding">Hoarding / Outdoor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary full-width">
                    Submit Exhibitor Request
                  </button>
                </form>
              </div>

              {/* Visitor Form */}
              <div id="visitor-form" className="form-card">
                <h3>Visitor / Buyer Registration</h3>
                <p className="form-subtext">
                  For home buyers, investors, NRIs, and families exploring property options.
                </p>
                <form onSubmit={handleVisitorSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name*</label>
                      <input name="name" type="text" required placeholder="Your Name" />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number*</label>
                      <input name="phone" type="tel" required placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input name="email" type="email" placeholder="you@example.com" />
                    </div>
                    <div className="form-group">
                      <label>City*</label>
                      <input name="city" type="text" required placeholder="Current City" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Interested In*</label>
                    <select name="interest" required>
                      <option value="">Select</option>
                      <option value="apartment">Apartments / Flats</option>
                      <option value="villas">Villas / Independent Houses</option>
                      <option value="plots">Open Plots</option>
                      <option value="commercial">Commercial Spaces</option>
                      <option value="all">Open to All Options</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Approx Budget (₹)</label>
                    <select name="budget">
                      <option value="">Select Budget Range</option>
                      <option value="25-50">25–50 Lakhs</option>
                      <option value="50-75">50–75 Lakhs</option>
                      <option value="75-100">75 Lakhs – 1 Cr</option>
                      <option value="1-2">1 – 2 Cr</option>
                      <option value="2plus">2 Cr +</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Message / Requirement</label>
                    <textarea
                      name="message"
                      rows="4"
                      placeholder="Tell us what kind of property you are looking for, preferred locations, etc."
                    />
                  </div>

                  <button type="submit" className="btn btn-outline full-width">
                    Submit Visitor Interest
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================ */}
        <section id="faq" className="section section-alt">
  <div className="container">
    <h2>FAQ</h2>
    <div className="faq-list">
      {faqs.map((item, idx) => (
        <details key={idx} className="faq-item">
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  </div>
</section>

      </main>
    </div>
    
  );
};

export default PropertyExpo;