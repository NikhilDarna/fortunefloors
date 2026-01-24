import { Link } from "react-router-dom";
import "./Testimonials.css";

const testimonials = [
  {
    name: "Darna Nikhil",
    role: "Owner, Hyderabad",
    text: "You get an exclusive RM from Fortune Floors team who tracks your property closely.",
    image: "https://via.placeholder.com/60",
  },
  {
    name: "Anirudh",
    role: "Owner, Delhi",
    text: "Fortune Floors has a better response rate compared to any of their competitors.",
    image: "https://via.placeholder.com/60",
  },
  {
    name: "Rohith Developers",
    role: "Builder, Bangalore",
    text: "Platform to meet customers and boost sales with the lowest commission.",
    image: "https://via.placeholder.com/60",
  },
  {
    name: "Pragathi",
    role: "Tenant, Chennai",
    text: "Very professional team and transparent service throughout the process.",
    image: "https://via.placeholder.com/60",
  },
  {
    name: "Ganesh",
    role: "Tenant, Hyderabad",
    text: "Very professional team and transparent service throughout the process.",
    image: "https://via.placeholder.com/60",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <p className="testimonials-small-heading">TESTIMONIALS</p>
      <h2 className="testimonials-title">
        What our customers are saying about Fortune Floors
      </h2>
      <p className="testimonials-subtitle">
        Hear from our satisfied buyers, tenants, owners and dealers.
      </p>

      <div className="testimonial-marquee">
        <div className="scroll-frame">
          <div className="marquee-track">

            {/* ORIGINAL */}
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-header">
                  <img src={t.image} alt={t.name} />
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role">{t.role}</p>
                  </div>
                </div>
                <p className="testimonial-text">{t.text}</p>
              </div>
            ))}

            {/* DUPLICATE FOR LOOP */}
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={`dup-${i}`}>
                <div className="testimonial-header">
                  <img src={t.image} alt={t.name} />
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role">{t.role}</p>
                  </div>
                </div>
                <p className="testimonial-text">{t.text}</p>
              </div>
            ))}

          </div>
        </div>
      </div>

      <div className="view-all">
        <Link to="/testimonials">View all testimonials →</Link>
      </div>
    </section>
  );
};

export default Testimonials;
