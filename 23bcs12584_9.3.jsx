import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://<BACKEND_PUBLIC_IP>:5000/")
      .then(res => setMessage(res.data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Full Stack App</h1>
      <p>Backend says: {message || "Loading..."}</p>
    </div>
  );
}

export default App;
