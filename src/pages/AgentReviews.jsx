import { useParams } from "react-router-dom";

const AgentReviews = () => {
  const { id } = useParams();
  const agents = JSON.parse(localStorage.getItem("agents")) || [];
  const agent = agents.find(a => String(a.id) === id);

  if (!agent) return <p>Agent not found.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>{agent.name} – Reviews</h2>
      <p>
        ⭐ {agent.rating} ({agent.reviews?.length || 0} reviews)
      </p>

      {agent.reviews?.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        agent.reviews.map((r, i) => (
          <div
            key={i}
            style={{
              borderBottom: "1px solid #e5e7eb",
              padding: "12px 0"
            }}
          >
            <strong>{r.user}</strong> – ⭐ {r.stars}
            <p style={{ marginTop: "6px" }}>{r.comment}</p>
            <small style={{ color: "#6b7280" }}>{r.date}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default AgentReviews;
