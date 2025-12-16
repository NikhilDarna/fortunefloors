import React from "react";
import "./PropertyExpo.css";
import rainbow from "../assets/rainbowdev.png";
import suman from "../assets/sumantv.png";

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


  /* ========= FAQ ========= */
  const faqs = [
    { q: "What is this Property Expo?", a: "It is a real estate expo..." },
    { q: "Who can exhibit?", a: "Builders, developers..." },
    { q: "Who should visit?", a: "Home buyers, investors..." },
    { q: "How do I confirm my stall / space?", a: "Fill the form... or Contact Us." },
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
            <a href="#about">About Expo</a>
            <a href="#why-participate">Why Participate</a>
            <a href="#who-exhibit">Who Should Exhibit</a>
            <a href="#register">Register</a>
            <a href="#faq">FAQ</a>
          </div>
        </nav>

        <div className="expo-hero-content">
          <div className="expo-hero-left">
            <p className="expo-badge">HYDERABAD * 2026 * REALESTATE EXPO</p>
            <h1 className="expo-badge-header">
              One Expo. <span>Endless</span> Property Opportunities.
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
                href="https://drive.google.com/uc?export=download&id=1coe0yUX0OPUHz_Z5upUQzupWtm3sUQkc"
                className="btn btn-primary"
                download
              >
                Download Brochure
              </a>
            </div>


            <div className="expo-hero-meta">
              <div>
                <strong>Dates</strong>
                <span>Jan 3ʳᵈ & 4ᵗʰ – 2026</span>
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

          <div className="expo-hero-right">
            <div className="expo-highlight-card">
              <h3>Why Exhibit?</h3>
              <ul>
                <li>Meet high-intent buyers & investors</li>
                <li>Launch & showcase new projects</li>
                <li>Instant lead capture & follow-ups</li>
                <li>Branding & networking opportunity</li>
              </ul>
            </div>

            <div className="expo-stats">
              <div>
                <h4>100+</h4>
                <p>Projects</p>
              </div>
              <div>
                <h4>5,000+</h4>
                <p>Visitors</p>
              </div>
              <div>
                <h4>2</h4>
                <p>Power-packed Days</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
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

        {/* ================= WHY PARTICIPATE ================ */}
        <section id="why-participate" className="section">
          <div className="container">
            <h2>Why Participate?</h2>
            <p className="section-subtitle">
              Designed to generate high-quality leads, strong brand recall, and 
              long-term real estate relationships.
            </p>

            <div className="grid-4">
              <div className="feature-card feature-card-1 ">
                <h3>Premium Leads</h3>
                <p>Engage genuine buyers & investors actively searching for properties.</p>
              </div>
              <div className="feature-card feature-card-1">
                <h3>Massive Visibility</h3>
                <p>Get strong branding across expo collaterals, digital, and on-ground.</p>
              </div>
              <div className="feature-card feature-card-1">
                <h3>Networking Hub</h3>
                <p>Connect with developers, brokers, lenders, and PropTech companies.</p>
              </div>
              <div className="feature-card feature-card-1">
                <h3>On-Spot Closures</h3>
                <p>Shortlist, negotiate, and close deals right at the venue.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHO SHOULD EXHIBIT ================ */}
        <section id="who-exhibit" className="section section-alt">
          <div className="container">
            <h2>Who Should Exhibit?</h2>
            <div className="grid-4">
              <div className="feature-card">
                <span className="who-number">01</span>
                <div>
                  <h3>Builders & Developers</h3>
                  <p>Residential, commercial, plotting, and gated community projects.</p>
                </div>
              </div>
              <div className="feature-card">
                <span className="who-number">02</span>
                <div>
                  <h3>Channel Partners & Brokers</h3>
                  <p>Independent agents, realty firms, and sales associates.</p>
                </div>
              </div>
              <div className="feature-card">
                <span className="who-number">03</span>
                <div>
                  <h3>Financial Institutions</h3>
                  <p>Banks, NBFCs, and home loan partners.</p>
                </div>
              </div>
              <div className="feature-card">
                <span className="who-number">04</span>
                <div>
                  <h3>PropTech & Services</h3>
                  <p>Property tech, interiors, legal, and property management.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ============== INVESTORS & SPONSORS ============== */}
        <section id="sponsors" className="section">
          <div className="container">
            <h2>Investors & Sponsors</h2>
            <div className="sponsor-marquee">
              <div className="scroll-frame">
                <div className="marquee-track">

                  {/* ORIGINAL LIST */}
                  {[
                    { img: rainbow, name: "Rainbow Developers", tag: "Co-Sponsor" },
                    { img: suman, name: "Suman TV", tag: "Media Partner" },
                    { img: "/logos/logo3.png", name: "Company Name 3", tag: "Investor" },
                    { img: "/logos/logo1.png", name: "Company Name 4", tag: "Sponsor" },
                    { img: "/logos/logo2.png", name: "Company Name 5", tag: "Co-Sponsor" },
                    { img: "/logos/logo3.png", name: "Company Name 6", tag: "Investor" },
                    { img: "/logos/logo1.png", name: "Company Name 7", tag: "Sponsor" },
                    { img: "/logos/logo2.png", name: "Company Name 8", tag: "Co-Sponsor" },
                    { img: "/logos/logo3.png", name: "Company Name 9", tag: "Investor" },
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
                    { img: "/logos/logo3.png", name: "Company Name 3", tag: "Investor" },
                    { img: "/logos/logo1.png", name: "Company Name 4", tag: "Sponsor" },
                    { img: "/logos/logo2.png", name: "Company Name 5", tag: "Co-Sponsor" },
                    { img: "/logos/logo3.png", name: "Company Name 6", tag: "Investor" },
                    { img: "/logos/logo1.png", name: "Company Name 7", tag: "Sponsor" },
                    { img: "/logos/logo2.png", name: "Company Name 8", tag: "Co-Sponsor" },
                    { img: "/logos/logo3.png", name: "Company Name 9", tag: "Investor" },
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
