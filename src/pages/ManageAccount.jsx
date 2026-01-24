import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const ManageAccount = () => {
  const { token } = useAuth();
  const [dataset, setDataset] = useState("shortlists");
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      if (dataset === "shortlists") {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
          withCredentials: true,
        });
        setItems(res.data || []);
      } else if (dataset === "properties") {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/properties`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
          withCredentials: true,
        });
        setItems(res.data || []);
      } else if (dataset === "owners") {
        const local = JSON.parse(localStorage.getItem("ownersContacted") || "[]");
        setItems(local);
      } else if (dataset === "payments") {
        const local = JSON.parse(localStorage.getItem("payments") || "[]");
        setItems(local);
      }
    } catch (e) {
      console.error(e);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset]);

  const filtered = items.filter((it) => {
    if (!query) return true;
    const str = JSON.stringify(it).toLowerCase();
    return str.includes(query.toLowerCase());
  });

  return (
    <div className="profile-page">
      <h2>Manage Account</h2>

      <div className="profile-card">
        <div style={{ padding: 20 }}>
          <label>
            Select dataset:
            <select value={dataset} onChange={(e) => setDataset(e.target.value)}>
              <option value="shortlists">Your Shortlists</option>
              <option value="owners">Owners You Contacted</option>
              <option value="payments">Your Payments</option>
              <option value="properties">Your Properties</option>
            </select>
          </label>

          <label style={{ display: "block", marginTop: 10 }}>
            Filter / Search:
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
          </label>

          <div style={{ marginTop: 12 }}>
            <button onClick={() => navigate('/account/shortlists')}>Go to Shortlists</button>
            <button onClick={() => navigate('/account/owners')}>Owners Contacted</button>
            <button onClick={() => navigate('/account/payments')}>Payments</button>
            <button onClick={() => navigate('/account/properties')}>My Properties</button>
          </div>

          <div style={{ marginTop: 18 }}>
            <h4>Results ({filtered.length})</h4>
            <ul className="manage-list">
              {filtered.map((it, idx) => (
                <li key={idx}>
                  <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(it, null, 2)}</pre>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAccount;
