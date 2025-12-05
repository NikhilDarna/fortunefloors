import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SingleArticle = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/article/${slug}`)
      .then(res => setArticle(res.data))
      .catch(err => console.log(err));
  }, [slug]);

  if (!article) return <h2>Loading...</h2>;

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h1>{article.title}</h1>

      {article.image && (
        <img
          src={`http://localhost:5000/uploads/${article.image}`}
          style={{ width: "100%", borderRadius: "10px" }}
        />
      )}

      <p style={{ fontSize: "18px", lineHeight: "1.6", marginTop: "20px" }}>
        {article.content}
      </p>
    </div>
  );
};

export default SingleArticle;
