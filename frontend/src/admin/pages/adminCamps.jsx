import { useState, useEffect } from "react";

export default function AdminCamps() {

  const [camps, setCamps] = useState([]);
  const [editingCamp, setEditingCamp] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    const res = await fetch("http://localhost:5000/admin/camps", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();
    setCamps(data);
  };

  // ================= DELETE =================
  const deleteCamp = async (id) => {
    if (!window.confirm("Delete this camp?")) return;
    await fetch(`http://localhost:5000/admin/camp/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    fetchCamps();
  };

  // ================= UPDATE WITH IMAGES =================
  const updateCamp = async () => {

    const formData = new FormData();

    formData.append("title", editingCamp.title);
    formData.append("description", editingCamp.description);
    formData.append("date", editingCamp.date);

    // images
    images.forEach(img => {
      formData.append("images", img);
    });

    await fetch(`http://localhost:5000/admin/camp/${editingCamp._id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: formData
    });

    setEditingCamp(null);
    setImages([]);
    fetchCamps();
  };

  return (
    <div className="admin-camps-page">

      {/* ── Title ── */}
      <h1 className="page-heading">Admin Camps</h1>
      <p className="page-sub">Manage and update camp listings.</p>

      {/* ── Camp List ── */}
      {camps.length === 0 ? (
        <div className="empty-state">No camps found.</div>
      ) : (
        camps.map((camp) => (
          <div key={camp._id} className="camp-card">

            {/* Header: title + date */}
            <div className="camp-card-header">
              <h3>{camp.title}</h3>
              <span className="camp-date-badge">
                📅 {new Date(camp.date).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric"
                })}
              </span>
            </div>

            {/* Description */}
            <p>{camp.description}</p>

            {/* Images */}
            {camp.images?.length > 0 && (
              <div className="camp-gallery">
                {camp.images.map((img, i) => (
                  <img
                    key={i}
                    className="gallery-img"
                    src={`http://localhost:5000/uploads/${img}`}
                    alt={`${camp.title} img ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="camp-actions">
              <button className="btn-edit" onClick={() => setEditingCamp(camp)}>
                ✏ Edit
              </button>
              <button className="btn-delete" onClick={() => deleteCamp(camp._id)}>
                🗑 Delete
              </button>
            </div>

          </div>
        ))
      )}

      {/* ── Edit Panel ── */}
      {editingCamp && (
        <div className="edit-panel">

          {/* Header */}
          <div className="edit-panel-header">
            <h3>✏ Edit Camp</h3>
            <span className="edit-panel-id">ID: {editingCamp._id}</span>
          </div>

          {/* Body */}
          <div className="edit-panel-body">

            <label className="field-label">Title</label>
            <input
              value={editingCamp.title}
              placeholder="Camp title"
              onChange={(e) => setEditingCamp({ ...editingCamp, title: e.target.value })}
            />

            <label className="field-label">Description</label>
            <input
              value={editingCamp.description}
              placeholder="Short description"
              onChange={(e) => setEditingCamp({ ...editingCamp, description: e.target.value })}
            />

            <label className="field-label">Date</label>
            <input
              type="date"
              value={editingCamp.date?.split("T")[0]}
              onChange={(e) => setEditingCamp({ ...editingCamp, date: e.target.value })}
            />

            <label className="field-label">Upload New Images</label>
            <input
              type="file"
              multiple
              onChange={(e) => setImages([...e.target.files])}
            />

            {/* Preview */}
            {images.length > 0 && (
              <div className="preview-container">
                {images.map((img, i) => (
                  <img
                    key={i}
                    className="preview-img"
                    src={URL.createObjectURL(img)}
                    alt={`preview-${i}`}
                  />
                ))}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="edit-panel-footer">
            <button className="btn-save" onClick={updateCamp}>
              💾 Save Changes
            </button>
            <button className="btn-cancel" onClick={() => { setEditingCamp(null); setImages([]); }}>
              Cancel
            </button>
          </div>

        </div>
      )}

    </div>
  );
}