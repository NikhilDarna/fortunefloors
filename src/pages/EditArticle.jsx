import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditArticle.css"; 

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [oldImage, setOldImage] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/admin/article/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setOldImage(res.data.image);
      })
      .catch(() => alert("Failed to load article"));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) formData.append("media", file);

    try {
      await axios.put(
        `http://localhost:5000/api/admin/article/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Article updated!");
      navigate("/Articles");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  return (
    <div className="edit-container">
      <h1>Edit Article</h1>

      <form className="edit-form" onSubmit={handleUpdate}>
        
        <label>Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />

        <label>Content</label>
        <textarea 
          rows="6" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required
        ></textarea>

        <label>Current Image:</label>
        {oldImage && (
          <img
            src={`http://localhost:5000/uploads/${oldImage}`}
            className="edit-old-image"
            alt="Old"
          />
        )}

        <label>Upload New Image (optional)</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setFile(e.target.files[0])} 
        />

        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default EditArticle;
