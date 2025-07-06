import React, { useState } from "react";
import "./Media.css";

const Media = () => {
  const [files, setFiles] = useState([]);
  const [captions, setCaptions] = useState({});

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles([...files, ...selected]);
  };

  const handleCaptionChange = (index, value) => {
    setCaptions({ ...captions, [index]: value });
  };

  const handleUpload = () => {
    // Send to backend or display success message
    alert("Media uploaded! 🎉");
    setFiles([]);
    setCaptions({});
  };

  return (
    <div className="media-page">
      <h2>📷 Upload Photos & Videos</h2>
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFiles}
      />

      <div className="media-grid">
        {files.map((file, i) => {
          const url = URL.createObjectURL(file);
          const isVideo = file.type.startsWith("video");

          return (
            <div className="media-item" key={i}>
              {isVideo ? (
                <video src={url} controls />
              ) : (
                <img src={url} alt={`preview ${i}`} />
              )}
              <input
                type="text"
                placeholder="Add a caption..."
                value={captions[i] || ""}
                onChange={(e) => handleCaptionChange(i, e.target.value)}
              />
            </div>
          );
        })}
      </div>

      {files.length > 0 && (
        <button className="upload-btn" onClick={handleUpload}>
          🚀 Upload All
        </button>
      )}
    </div>
  );
};

export default Media;
// Media.css
.media-page {
    padding: 20px;
    max-width: 800px;
    margin: auto;
    }