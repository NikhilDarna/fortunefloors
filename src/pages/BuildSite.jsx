import { useState } from "react";
import axios from "axios";

const BuildSite = () => {
  const [url, setUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/build-microsite`,
      formData
    );

    setUrl(res.data.url);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Microsite</h2>

      <form onSubmit={handleSubmit}>
        <input name="siteName" placeholder="Site Name" required />
        <br />
        <input name="email" placeholder="Email" required />
        <br />
        <input name="phone" placeholder="Phone" required />
        <br />
        <span>upload logo</span><span><input type="file" name="logo" /></span>
        <br />
        <button type="submit">Build Site</button>
      </form>

      {url && (
        <p>
          Microsite URL:{" "}
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        </p>
      )}
    </div>
  );
};

export default BuildSite;
