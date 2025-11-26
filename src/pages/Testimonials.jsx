import "./Testimonials.css";
import { useRef } from "react";

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
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === "left") current.scrollBy({ left: -400, behavior: "smooth" });
    else current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <section className="testimonials-section">
      <p className="testimonials-small-heading">TESTIMONIALS</p>
      <h2 className="testimonials-title">
        What our customers are saying about Fortune Floors
      </h2>
      <p className="testimonials-subtitle">
        Hear from our satisfied buyers, tenants, owners and dealers.
      </p>

      <button className="carousel-btn left" onClick={() => scroll("left")}>‹</button>

      <div className="testimonials-carousel" ref={scrollRef}>
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial-card">
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

      <button className="carousel-btn right" onClick={() => scroll("right")}>›</button>

      <div className="view-all">
        <a href="#">View all testimonials →</a>
      </div>
    </section>
  );
};

export default Testimonials;
