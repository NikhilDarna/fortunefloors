import "./TestimonialsPage.css";

const testimonials = [
  {
    name: "Darna Nikhil",
    role: "Owner, Hyderabad",
    text: "You get an exclusive RM from Fortune Floors team who tracks your property closely.",
  },
  {
    name: "Anirudh",
    role: "Owner, Delhi",
    text: "Fortune Floors has a better response rate compared to any of their competitors.",
  },
  {
    name: "Rohith Developers",
    role: "Builder, Bangalore",
    text: "Platform to meet customers and boost sales with the lowest commission.",
  },
  {
    name: "Pragathi",
    role: "Tenant, Chennai",
    text: "Very professional team and transparent service throughout the process.",
  },
];

const TestimonialsPage = () => {
  return (
    <div className="testimonials-page">
      <div className="testimonials-container">
        <h1 className="page-title">All Testimonials</h1>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="testimonial-header">
                <div className="avatar">
                  <span>{t.name.charAt(0)}</span>
                </div>

                <div>
                  <h3 className="testimonial-name">{t.name}</h3>
                  <p className="testimonial-role">{t.role}</p>
                </div>
              </div>

              <p className="testimonial-text">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
