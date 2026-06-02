// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// export default function EditVillage() {

// const { id } = useParams();
// const navigate = useNavigate();

// const [form, setForm] = useState({
// name: "",
// district: "",
// districtcode: "",
// population: "",
// schools: "",
// hospitals: "",
// description: ""
// });

// // ✅ separate states (IMPORTANT)
// const [existingImages, setExistingImages] = useState([]);
// const [newImages, setNewImages] = useState([]);

// useEffect(() => {
// fetch(`http://localhost:5000/admin/villages/${id}`, {
// headers: {
// Authorization: "Bearer " + localStorage.getItem("token")
// }
// })
// .then(res => res.json())
// .then(data => {

// setForm({
// name: data.name || "",
// district: data.district || "",
// districtcode: data.districtcode || "",
// population: data.population || "",
// schools: data.schools || "",
// hospitals: data.hospitals || "",
// description: data.description || ""
// });

// setExistingImages(data.highlightImages || []);
// });
// }, [id]);

// // text change
// const handleChange = (e) => {
// setForm({ ...form, [e.target.name]: e.target.value });
// };

// // add new images
// const handleImageChange = (e) => {
// const files = Array.from(e.target.files);
// setNewImages(prev => [...prev, ...files]);
// };

// // delete existing image
// const handleDeleteExisting = (img) => {
// setExistingImages(prev => prev.filter(i => i !== img));
// };

// // delete new image
// const handleDeleteNew = (index) => {
// setNewImages(prev => prev.filter((_, i) => i !== index));
// };

// // submit
// const handleSubmit = async (e) => {
// e.preventDefault();

// const formData = new FormData();

// // text fields
// Object.keys(form).forEach(key => {
// formData.append(key, form[key]);
// });

// // send remaining old images
// formData.append("existingImages", JSON.stringify(existingImages));

// // send new images
// newImages.forEach(img => {
// formData.append("images", img);
// });

// await fetch(`http://localhost:5000/admin/villages/${id}`, {
// method: "PUT",
// headers: {
// Authorization: "Bearer " + localStorage.getItem("token")
// },
// body: formData
// });

// navigate("/admin/villages");
// };

// return (
// <div>

// <h1>Edit Village</h1>

// <form onSubmit={handleSubmit}>

// <input name="name" value={form.name} onChange={handleChange} placeholder="Village Name" />
// <input name="district" value={form.district} onChange={handleChange} placeholder="District" />
// <input name="districtcode" value={form.districtcode} onChange={handleChange} placeholder="District Code" />
// <input name="population" value={form.population} onChange={handleChange} placeholder="Population" />
// <input name="schools" value={form.schools} onChange={handleChange} placeholder="Schools" />
// <input name="hospitals" value={form.hospitals} onChange={handleChange} placeholder="Hospitals" />

// <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />

// {/* ADD IMAGES */}
// <input type="file" multiple accept="image/*" onChange={handleImageChange} />

// {/* EXISTING IMAGES */}
// <h3>Existing Images</h3>
// <div style={{ display: "flex", flexWrap: "wrap" }}>
// {existingImages.map((img, i) => (
// <div key={i} style={{ position: "relative" }}>
// <img
//   src={`http://localhost:5000/uploads/${img}`}
//   alt={`${form.name || "Village"} ${i + 1}`}
//   style={{ width: "100px", margin: "5px" }}
// />
// <button
// type="button"
// onClick={() => handleDeleteExisting(img)}
// style={{
// position: "absolute",
// top: 0,
// right: 0,
// background: "red",
// color: "white"
// }}
// >
// X
// </button>
// </div>
// ))}
// </div>

// {/* NEW IMAGES */}
// <h3>New Images</h3>
// <div style={{ display: "flex", flexWrap: "wrap" }}>
// {newImages.map((file, i) => (
// <div key={i} style={{ position: "relative" }}>
// <img
// src={URL.createObjectURL(file)}
// alt={`New upload ${i + 1}`}
// style={{ width: "100px", margin: "5px" }}
// />
// <button
// type="button"
// onClick={() => handleDeleteNew(i)}
// style={{
// position: "absolute",
// top: 0,
// right: 0,
// background: "red",
// color: "white"
// }}
// >
// X
// </button>
// </div>
// ))}
// </div>

// <button type="submit">Update Village</button>

// </form>

// </div>
// );
// }
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditVillage() {

const { id } = useParams();
const navigate = useNavigate();

const [form, setForm] = useState({
name: "",
district: "",
districtcode: "",
population: "",
schools: "",
hospitals: "",
description: ""
});

const [existingImages, setExistingImages] = useState([]);
const [newImages, setNewImages] = useState([]);

// 🔥 NEW STATES
const [users, setUsers] = useState([]);
const [selectedHead, setSelectedHead] = useState("");
const [currentHead, setCurrentHead] = useState(null);

const token = localStorage.getItem("token");

// ───── FETCH VILLAGE ─────
useEffect(() => {
fetch(`http://localhost:5000/admin/villages/${id}`, {
headers: {
Authorization: "Bearer " + token
}
})
.then(res => res.json())
.then(data => {

setForm({
name: data.name || "",
district: data.district || "",
districtcode: data.districtcode || "",
population: data.population || "",
schools: data.schools || "",
hospitals: data.hospitals || "",
description: data.description || ""
});

setExistingImages(data.highlightImages || []);

});
}, [id]);

// ───── FETCH USERS ─────
useEffect(() => {
fetch("http://localhost:5000/admin/users", {
headers: {
Authorization: "Bearer " + token
}
})
.then(res => res.json())
.then(data => {

const villageHeads = data.filter(u => u.role === "villagehead");
setUsers(villageHeads);

// find current head
const head = villageHeads.find(u => u.village === id);
if (head) {
setCurrentHead(head);
setSelectedHead(head._id);
}

});
}, [id]);

// text change
const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

// image handlers (same as before)
const handleImageChange = (e) => {
const files = Array.from(e.target.files);
setNewImages(prev => [...prev, ...files]);
};

const handleDeleteExisting = (img) => {
setExistingImages(prev => prev.filter(i => i !== img));
};

const handleDeleteNew = (index) => {
setNewImages(prev => prev.filter((_, i) => i !== index));
};

// ───── SUBMIT ─────
const handleSubmit = async (e) => {
e.preventDefault();

// 1️⃣ UPDATE VILLAGE
const formData = new FormData();

Object.keys(form).forEach(key => {
formData.append(key, form[key]);
});

formData.append("existingImages", JSON.stringify(existingImages));

newImages.forEach(img => {
formData.append("images", img);
});

await fetch(`http://localhost:5000/admin/villages/${id}`, {
method: "PUT",
headers: {
Authorization: "Bearer " + token
},
body: formData
});

// 2️⃣ ASSIGN VILLAGEHEAD (🔥 NEW)
if (selectedHead) {

await fetch("http://localhost:5000/admin/assign-village", {
method: "PUT",
headers: {
"Content-Type": "application/json",
Authorization: "Bearer " + token
},
body: JSON.stringify({
userId: selectedHead,
villageId: id
})
});

}

alert("Village updated successfully");

navigate("/admin/villages");
};

return (
<div>

<h1>Edit Village</h1>

<form onSubmit={handleSubmit}>

<input name="name" value={form.name} onChange={handleChange} placeholder="Village Name" />
<input name="district" value={form.district} onChange={handleChange} placeholder="District" />
<input name="districtcode" value={form.districtcode} onChange={handleChange} placeholder="District Code" />
<input name="population" value={form.population} onChange={handleChange} placeholder="Population" />
<input name="schools" value={form.schools} onChange={handleChange} placeholder="Schools" />
<input name="hospitals" value={form.hospitals} onChange={handleChange} placeholder="Hospitals" />

<textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />

{/* 🔥 VILLAGEHEAD SECTION */}
<h3>Assign Village Head</h3>

{currentHead && (
<p>Current Head: {currentHead.username}</p>
)}

<select value={selectedHead} onChange={(e)=>setSelectedHead(e.target.value)}>
<option value="">Select Village Head</option>
{users.map(u => (
<option key={u._id} value={u._id}>
{u.username}
</option>
))}
</select>

{/* IMAGES SAME AS BEFORE */}

<input type="file" multiple accept="image/*" onChange={handleImageChange} />

<h3>Existing Images</h3>
<div style={{ display: "flex", flexWrap: "wrap" }}>
{existingImages.map((img, i) => (
<div key={i} style={{ position: "relative" }}>
<img
  src={`http://localhost:5000/uploads/${img}`}
  alt={`${form.name || "Village"} img ${i + 1}`}
  style={{ width: "100px", margin: "5px" }}
/>
<button type="button" onClick={() => handleDeleteExisting(img)}>X</button>
</div>
))}
</div>

<h3>New Images</h3>
<div style={{ display: "flex", flexWrap: "wrap" }}>
{newImages.map((file, i) => (
<div key={i} style={{ position: "relative" }}>
<img
  src={URL.createObjectURL(file)}
  alt={`Preview img ${i + 1}`}
  style={{ width: "100px", margin: "5px" }}
/>
<button type="button" onClick={() => handleDeleteNew(i)}>X</button>
</div>
))}
</div>

<button type="submit">Update Village</button>

</form>

</div>
);
}