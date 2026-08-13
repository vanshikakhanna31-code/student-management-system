import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api/students";

const emptyStudent = {
  studentId: "",
  name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "Female",
  course: "MBA",
  department: "Management",
  semester: "1",
  address: ""
};

function Layout({ children }) {
  return (
    <div className="app">
      <header className="navbar">
        <Link className="brand" to="/">🎓 Student Manager</Link>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/students">Students</Link>
          <Link className="add-link" to="/students/add">+ Add Student</Link>
        </nav>
      </header>
      <main className="container">{children}</main>
      <footer>Student Management System • Full Stack Web Development Project</footer>
    </div>
  );
}

function Dashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get(API).then((res) => setStudents(res.data)).catch(console.error);
  }, []);

  const courses = useMemo(
    () => new Set(students.map((s) => s.course)).size,
    [students]
  );

  const departments = useMemo(
    () => new Set(students.map((s) => s.department)).size,
    [students]
  );

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">ADMIN DASHBOARD</p>
          <h1>Student Management System</h1>
          <p>Manage student records quickly and efficiently.</p>
        </div>
        <Link className="primary-btn" to="/students/add">Add Student</Link>
      </section>

      <div className="stats">
        <div className="stat-card"><span>👨‍🎓</span><div><small>Total Students</small><strong>{students.length}</strong></div></div>
        <div className="stat-card"><span>📚</span><div><small>Total Courses</small><strong>{courses}</strong></div></div>
        <div className="stat-card"><span>🏫</span><div><small>Departments</small><strong>{departments}</strong></div></div>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <h2>Recent Students</h2>
          <Link to="/students">View All</Link>
        </div>
        {students.length === 0 ? (
          <div className="empty">No students added yet.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Course</th><th>Semester</th></tr></thead>
              <tbody>
                {students.slice(0, 5).map((s) => (
                  <tr key={s._id}>
                    <td>{s.studentId}</td><td>{s.name}</td><td>{s.course}</td><td>{s.semester}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const loadStudents = () => axios.get(API).then((res) => setStudents(res.data));

  useEffect(() => { loadStudents().catch(console.error); }, []);

  const filtered = students.filter((s) =>
    [s.studentId, s.name, s.email, s.course, s.department]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const remove = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      loadStudents();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <div><p className="eyebrow">RECORDS</p><h2>All Students</h2></div>
        <Link className="primary-btn" to="/students/add">+ Add Student</Link>
      </div>

      <input
        className="search"
        placeholder="Search by ID, name, email, course or department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Student ID</th><th>Name</th><th>Email</th><th>Course</th><th>Department</th><th>Semester</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s._id}>
                <td>{s.studentId}</td><td>{s.name}</td><td>{s.email}</td>
                <td>{s.course}</td><td>{s.department}</td><td>{s.semester}</td>
                <td className="actions">
                  <Link className="edit-btn" to={`/students/edit/${s._id}`}>Edit</Link>
                  <button className="delete-btn" onClick={() => remove(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty">No matching students found.</div>}
      </div>
    </section>
  );
}

function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(emptyStudent);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) {
      axios.get(`${API}/${id}`)
        .then((res) => setForm(res.data))
        .catch(() => setError("Could not load student."));
    }
  }, [editing, id]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) await axios.put(`${API}/${id}`, form);
      else await axios.post(API, form);
      navigate("/students");
    } catch (err) {
      setError(err.response?.data?.message || "Please check your details.");
    }
  };

  return (
    <section className="form-card">
      <p className="eyebrow">{editing ? "UPDATE RECORD" : "NEW RECORD"}</p>
      <h2>{editing ? "Edit Student" : "Add Student"}</h2>
      <p className="muted">Enter the student's information below.</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={submit} className="student-form">
        <label>Student ID<input name="studentId" value={form.studentId} onChange={change} required /></label>
        <label>Full Name<input name="name" value={form.name} onChange={change} required /></label>
        <label>Email<input type="email" name="email" value={form.email} onChange={change} required /></label>
        <label>Phone<input name="phone" value={form.phone} onChange={change} required /></label>
        <label>Date of Birth<input type="date" name="dob" value={form.dob} onChange={change} required /></label>
        <label>Gender<select name="gender" value={form.gender} onChange={change}><option>Female</option><option>Male</option><option>Other</option></select></label>
        <label>Course<input name="course" value={form.course} onChange={change} required /></label>
        <label>Department<input name="department" value={form.department} onChange={change} required /></label>
        <label>Semester<select name="semester" value={form.semester} onChange={change}>{[1,2,3,4,5,6,7,8].map(n => <option key={n}>{n}</option>)}</select></label>
        <label className="full">Address<textarea name="address" value={form.address} onChange={change} rows="3" required /></label>
        <div className="form-actions">
          <Link className="secondary-btn" to="/students">Cancel</Link>
          <button className="primary-btn" type="submit">{editing ? "Update Student" : "Save Student"}</button>
        </div>
      </form>
    </section>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/add" element={<StudentForm />} />
        <Route path="/students/edit/:id" element={<StudentForm />} />
      </Routes>
    </Layout>
  );
}

export default App;
