import { useState, useEffect } from "react";

export default function AdminCamps() {

  const [camps, setCamps] = useState([]);
  const [editingCamp, setEditingCamp] = useState(null);
  const [images, setImages] = useState([]);

  // ✅ New states for Add Camp
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCamp, setNewCamp] = useState({ title: "", description: "", date: "" });
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    const res = await fetch("https://website-for-villages-backend.onrender.com/admin/camps", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();
    setCamps(data);
  };

  // ================= ADD CAMP =================
  const addCamp = async () => {
    const formData = new FormData();
    formData.append("title", newCamp.title);
    formData.append("description", newCamp.description);
    formData.append("date", newCamp.date);

    // images
    newImages.forEach(img => {
      formData.append("images", img);
    });

    const res = await fetch(`https://website-for-villages-backend.onrender.com/admin/camp`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: formData
    });

    if (res.ok) {
      setShowAddModal(false);
      setNewCamp({ title: "", description: "", date: "" });
      setNewImages([]);
      fetchCamps();
    } else {
      alert("Failed to add camp");
    }
  };

  // ================= DELETE =================
  const deleteCamp = async (id) => {
    if (!window.confirm("Delete this camp?")) return;
    await fetch(`https://website-for-villages-backend.onrender.com/admin/camp/${id}`, {
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

    await fetch(`https://website-for-villages-backend.onrender.com/admin/camp/${editingCamp._id}`, {
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

      {/* ── Title & Add Button ── */}
      <div className="page-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 className="page-heading">Admin Camps</h1>
          <p className="page-sub">Manage and update camp listings.</p>
        </div>
        <button 
          className="btn-add" 
          onClick={() => setShowAddModal(true)}
          style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
        >
          ➕ Add New Camp
        </button>
      </div>

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
                    src={`https://website-for-villages-backend.onrender.com/uploads/${img}`}
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

      {/* ── Add Camp Modal / Panel ── */}
      {showAddModal && (
        <div className="edit-panel" style={{ border: "2px solid #28a745", marginTop: "30px", padding: "20px", borderRadius: "8px" }}>

          <div className="edit-panel-header">
            <h3>➕ Add New Camp</h3>
          </div>

          <div className="edit-panel-body">
            <label className="field-label">Title</label>
            <input
              value={newCamp.title}
              placeholder="Camp title"
              onChange={(e) => setNewCamp({ ...newCamp, title: e.target.value })}
            />

            <label className="field-label">Description</label>
            <input
              value={newCamp.description}
              placeholder="Short description"
              onChange={(e) => setNewCamp({ ...newCamp, description: e.target.value })}
            />

            <label className="field-label">Date</label>
            <input
              type="date"
              value={newCamp.date}
              onChange={(e) => setNewCamp({ ...newCamp, date: e.target.value })}
            />

            <label className="field-label">Upload Images</label>
            <input
              type="file"
              multiple
              onChange={(e) => setNewImages([...e.target.files])}
            />

            {newImages.length > 0 && (
              <div className="preview-container">
                {newImages.map((img, i) => (
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

          <div className="edit-panel-footer" style={{ marginTop: "15px" }}>
            <button className="btn-save" onClick={addCamp} style={{ marginRight: "10px", backgroundColor: "#28a745", color: "white", padding: "8px 15px", border: "none", borderRadius: "4px" }}/>
              💾 Save Camp
            <button className="btn-cancel" onClick={() => { setShowAddModal(false); setNewImages([]); }} style={{ padding: "8px 15px", border: "1px solid #ccc", borderRadius: "4px" }}>
              Cancel
            </button>
          </div>

        </div>
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