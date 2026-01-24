import axios from "axios";

function UploadImage() {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(
      "http://localhost:5001/api/upload",
      formData
    );

    alert("Uploaded!");
    console.log(res.data.imageUrl);
  };

  return <input type="file" onChange={handleUpload} />;
}

export default UploadImage;
