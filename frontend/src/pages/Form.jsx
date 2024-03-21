import axios from "axios";
import { useState } from "react";
import DataTable from "./DataTable";

function Form() {
  const [formData, setFormData] = useState({
    username: "",
    codeLang: "",
    input: "",
    srcCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform any further action with the form data here, like submitting it to an API
    axios
      .post(`http://localhost:5050/insert`, {
        username: formData.username,
        code_language: formData.codeLang,
        stdin: formData.input,
        source_code: formData.srcCode,
      })
      .then((res) => {
        console.log(res.data);
        setFormData({
          username: "",
          codeLang: "",
          input: "",
          srcCode: "",
        });
      })
      .catch((err) => console.log(err));
    console.log(formData);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Code Language:</label>
          <input
            type="text"
            name="codeLang"
            value={formData.codeLang}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Input:</label>
          <input
            type="text"
            name="input"
            value={formData.input}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Source Code:</label>
          <textarea
            name="srcCode"
            value={formData.srcCode}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <DataTable />
    </>
  );
}

export default Form;
