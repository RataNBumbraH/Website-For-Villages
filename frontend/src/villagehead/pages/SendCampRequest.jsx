import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function SendCampRequest() {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")

  const navigate = useNavigate()
  const today = new Date().toISOString().split("T")[0]
  const submit = async () => {
    try {
      const res = await fetch("https://website-for-villages-backend.onrender.com/villagehead/camp-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          title,
          description,
          date
        }),
      });

      if (res.ok) {
        alert("Request sent successfully")
        navigate("/villagehead/my-request")

        setTitle("")
        setDescription("")
        setDate("")
      } else {
        throw new Error("Failed")
      }

    } catch (err) {
      alert("Error sending request")
    }
  };

  return (
    <div>

      <h2>Request Camp</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <input
        type="date"
        min={today}
        value={date}
        onChange={e => setDate(e.target.value)}
      />

      <button onClick={submit}>
        Send Request
      </button>

    </div>
  )
}