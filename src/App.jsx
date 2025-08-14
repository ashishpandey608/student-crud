import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    marks1: "",
    marks2: "",
    marks3: "",
    marks4: "",
    marks5: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculatePercentage = () => {
    const total =
      Number(form.marks1) +
      Number(form.marks2) +
      Number(form.marks3) +
      Number(form.marks4) +
      Number(form.marks5);
    return (total / 5).toFixed(2);
  };

  const calculateDivision = (percentage) => {
    if (percentage >= 60) return "First";
    if (percentage >= 45) return "Second";
    if (percentage >= 33) return "Third";
    return "Fail";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const percentage = calculatePercentage();
    const division = calculateDivision(percentage);

    if (editIndex !== null) {
      const updated = [...students];
      updated[editIndex] = { ...form, percentage, division };
      setStudents(updated);
      setEditIndex(null);
    } else {
      setStudents([...students, { ...form, percentage, division }]);
    }

    setForm({
      name: "",
      age: "",
      marks1: "",
      marks2: "",
      marks3: "",
      marks4: "",
      marks5: "",
    });
  };

  const handleEdit = (index) => {
    setForm(students[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setStudents(students.filter((_, i) => i !== index));
    }
  };

// ... (existing code)

// ... (existing code)

return (
  <div className="container mt-4 text-center custom-form">
    <h2 className="text-center mb-4 fw-bold custom-heading">
      Student Records CRUD
    </h2>
    <input
      type="text"
      placeholder="Search by name..."
      className="form-control mb-3"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow">
      <div className="row g-3">
        {/* Name input takes full width on small screens, 4 columns on medium and larger */}
        <div className="col-12 col-md-4">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        {/* Age input takes full width on small screens, 2 columns on medium and larger */}
        <div className="col-12 col-md-2">
          <input
            type="number"
            name="age"
            className="form-control"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            required
          />
        </div>
        {/* Marks inputs take 4 columns on small screens, 1 on medium and larger */}
        {[1, 2, 3, 4, 5].map((num) => (
          <div className="col-4 col-md-1" key={num}>
            <input
              type="number"
              name={`marks${num}`}
              className="form-control"
              placeholder={`M${num}`}
              value={form[`marks${num}`]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">
        {editIndex !== null ? "Update" : "Add"} Student
      </button>
    </form>

    {/* The table-responsive class adds horizontal scrolling for small screens */}
    <div className="table-responsive">
      <table className="table table-bordered table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Marks1</th>
            <th>Marks2</th>
            <th>Marks3</th>
            <th>Marks4</th>
            <th>Marks5</th>
            <th>%</th>
            <th>Division</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students
            .filter((s) =>
              s.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((s, index) => (
              <tr key={index}>
                <td>{s.name}</td>
                <td>{s.age}</td>
                <td>{s.marks1}</td>
                <td>{s.marks2}</td>
                <td>{s.marks3}</td>
                <td>{s.marks4}</td>
                <td>{s.marks5}</td>
                <td>{s.percentage}</td>
                <td>{s.division}</td>
                <td>
                  {/* Buttons stack on small screens and display side-by-side on larger ones */}
                  <div className="d-flex flex-column flex-md-row justify-content-center">
                    <button
                      className="btn btn-warning btn-sm me-md-2 mb-2 mb-md-0"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
);
}
