import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    marks: ["", "", "", "", ""]
  });
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("students");
    if (saved) setStudents(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const getDivision = (percentage) => {
    if (percentage >= 60) return "First";
    if (percentage >= 45) return "Second";
    if (percentage >= 33) return "Third";
    return "Fail";
  };

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === "marks" && index !== null) {
      const updatedMarks = [...form.marks];
      updatedMarks[index] = value;
      setForm({ ...form, marks: updatedMarks });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateForm = () => {
  if (!form.name.trim()) return "Name is required.";
  if (!/^[A-Za-z\s]+$/.test(form.name)) return "Name must contain only letters.";
  if (!form.age || form.age <= 0) return "Valid age is required.";
  for (let m of form.marks) {
    if (m === "" || isNaN(m) || m < 0 || m > 100) {
      return "Marks must be numbers between 0 and 100.";
    }
  }
  return null;
};
  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    const total = form.marks.reduce((sum, m) => sum + Number(m), 0);
    const percentage = (total / 500) * 100;
    const division = getDivision(percentage);

    const studentData = {
      ...form,
      percentage: percentage.toFixed(2),
      division
    };

    if (editIndex !== null) {
      const updated = [...students];
      updated[editIndex] = studentData;
      setStudents(updated);
      setEditIndex(null);
    } else {
      setStudents([...students, studentData]);
    }

    setForm({ name: "", age: "", marks: ["", "", "", "", ""] });
  };

  const handleEdit = (index) => {
    setForm(students[index]);
    setEditIndex(index);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setShowModal(true);
  };

  const confirmDelete = () => {
    const updated = students.filter((_, i) => i !== deleteIndex);
    setStudents(updated);
    setShowModal(false);
    setDeleteIndex(null);
  };

  const filteredStudents = students.filter((s) => {
    const matchesName = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesDivision = divisionFilter
      ? s.division === divisionFilter
      : true;
    return matchesName && matchesDivision;
  });

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 custom-heading">Student Records CRUD</h2>

      {/* Form */}
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row mb-2">
          <div className="col">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <input
              type="number"
              name="age"
              placeholder="Age"
              className="form-control"
              value={form.age}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-2">
          {form.marks.map((mark, i) => (
            <div className="col" key={i}>
              <input
                type="number"
                name="marks"
                placeholder={`Subject ${i + 1}`}
                className="form-control"
                value={mark}
                onChange={(e) => handleChange(e, i)}
              />
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {editIndex !== null ? "Update Student" : "Add Student"}
        </button>
      </form>

      {/* Search & Filter */}
      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            placeholder="Search by Name"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col">
          <select
            className="form-control"
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
          >
            <option value="">All Divisions</option>
            <option value="First">First</option>
            <option value="Second">Second</option>
            <option value="Third">Third</option>
            <option value="Fail">Fail</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Marks</th>
            <th>Percentage</th>
            <th>Division</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((s, i) => (
              <tr key={i}>
                <td>{s.name}</td>
                <td>{s.age}</td>
                <td>{s.marks.join(", ")}</td>
                <td>{s.percentage}%</td>
                <td>{s.division}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(i)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteClick(i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Delete Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this record?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
