import React, { useState, useEffect } from 'react';
import { API } from '../api';
import './Dashboard.css';

export default function AdminDashboard({ user, setUser }) {
  const [tab, setTab] = useState('students');
  const [students, setStudents]         = useState([]);
  const [coaches, setCoaches]           = useState([]);
  const [courses, setCourses]           = useState([]);
  const [enrollments, setEnrollments]   = useState([]);
  const [bookings, setBookings]         = useState([]);
  const [payments, setPayments]         = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [sports, setSports]             = useState([]);
  const [msg, setMsg] = useState('');

  const load = () => {
    API.students.get('').then(r => setStudents(r.data)).catch(()=>{});
    API.coaches.get('').then(r => setCoaches(r.data)).catch(()=>{});
    API.courses.get('').then(r => setCourses(r.data)).catch(()=>{});
    API.enrollments.get('').then(r => setEnrollments(r.data)).catch(()=>{});
    API.bookings.get('').then(r => setBookings(r.data)).catch(()=>{});
    API.payments.get('').then(r => setPayments(r.data)).catch(()=>{});
    API.achievements.get('').then(r => setAchievements(r.data)).catch(()=>{});
    API.sports.get('').then(r => setSports(r.data)).catch(()=>{});
  };
  useEffect(load, []);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  // ── STUDENTS ──
  const addStudent = async () => {
    const name  = prompt('Full Name:');
    const email = prompt('Email:');
    const pass  = prompt('Password:');
    const phone = prompt('Phone:');
    if (!name || !email || !pass) return;
    await API.students.post('', { name, email, password: pass, phone }).catch(()=>{});
    showMsg('Student added!'); load();
  };
  const deleteStudent = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    await API.students.delete(`/${id}`).catch(()=>{});
    showMsg('Student deleted!'); load();
  };

  // ── COACHES ──
  const addCoach = async () => {
    const name       = prompt('Coach Name:');
    const sportId    = prompt('Sport ID (1=Cricket, 2=Badminton, 3=Basketball):');
    const phone      = prompt('Phone:');
    const experience = prompt('Years of Experience:');
    if (!name || !sportId) return;
    await API.coaches.post('', { name, sport: { sportId }, phone, experience }).catch(()=>{});
    showMsg('Coach added!'); load();
  };
  const deleteCoach = async (id) => {
    if (!window.confirm('Delete this coach?')) return;
    await API.coaches.delete(`/${id}`).catch(()=>{});
    showMsg('Coach deleted!'); load();
  };

  // ── ENROLLMENTS ──
  const addEnrollment = async () => {
    const studentId = prompt('Student ID:');
    const courseId  = prompt('Course ID:');
    if (!studentId || !courseId) return;
    await API.enrollments.post('', {
      student: { studentId }, course: { courseId },
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }).catch(()=>{});
    showMsg('Enrollment added!'); load();
  };
  const deleteEnrollment = async (id) => {
    if (!window.confirm('Delete this enrollment?')) return;
    await API.enrollments.delete(`/${id}`).catch(()=>{});
    showMsg('Enrollment deleted!'); load();
  };

  // ── PAYMENTS ──
  const markPaid = async (p) => {
    await API.payments.put(`/${p.paymentId}`, { ...p, status: 'Paid' }).catch(()=>{});
    showMsg('Marked as paid!'); load();
  };
  const addPayment = async () => {
    const studentId = prompt('Student ID:');
    const courseId  = prompt('Course ID:');
    const amount    = prompt('Amount (₹):');
    if (!studentId || !courseId || !amount) return;
    await API.payments.post('', {
      student: { studentId }, course: { courseId },
      amount, paymentDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    }).catch(()=>{});
    showMsg('Payment record added!'); load();
  };

  // ── ACHIEVEMENTS ──
  const addAchievement = async () => {
    const studentId = prompt('Student ID:');
    const sportId   = prompt('Sport ID (1=Cricket, 2=Badminton, 3=Basketball):');
    const title     = prompt('Achievement title:');
    const date      = prompt('Date won (YYYY-MM-DD):');
    if (!studentId || !sportId || !title || !date) return;
    await API.achievements.post('', {
      student: { studentId }, sport: { sportId },
      title, dateWon: date
    }).catch(()=>{});
    showMsg('Achievement added!'); load();
  };
  const deleteAchievement = async (id) => {
    if (!window.confirm('Delete this achievement?')) return;
    await API.achievements.delete(`/${id}`).catch(()=>{});
    showMsg('Achievement deleted!'); load();
  };

  // ── BOOKINGS ──
  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    await API.bookings.delete(`/${id}`).catch(()=>{});
    showMsg('Booking deleted!'); load();
  };

  const tabs = ['students','coaches','courses','enrollments','bookings','payments','achievements'];

  return (
    <div className="dashboard">
      <header className="dash-header admin">
        <span>⚙️ Admin Panel</span>
        <span>Welcome, {user.name}</span>
        <button onClick={() => setUser(null)}>Logout</button>
      </header>
      <nav className="dash-nav">
        {tabs.map(t => (
          <button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </nav>
      {msg && <div className="msg-banner">{msg}</div>}
      <div className="dash-body">

        {/* STUDENTS */}
        {tab==='students' && (
          <>
            <button className="add-btn" onClick={addStudent}>+ Add Student</button>
            <table className="data-table">
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Delete</th></tr></thead>
              <tbody>{students.map(s => (
                <tr key={s.studentId}>
                  <td>{s.studentId}</td><td>{s.name}</td><td>{s.email}</td><td>{s.phone}</td>
                  <td><button className="del-btn" onClick={()=>deleteStudent(s.studentId)}>Delete</button></td>
                </tr>
              ))}</tbody>
            </table>
          </>
        )}

        {/* COACHES */}
        {tab==='coaches' && (
          <>
            <button className="add-btn" onClick={addCoach}>+ Add Coach</button>
            <table className="data-table">
              <thead><tr><th>ID</th><th>Name</th><th>Sport</th><th>Phone</th><th>Exp(yrs)</th><th>Delete</th></tr></thead>
              <tbody>{coaches.map(c => (
                <tr key={c.coachId}>
                  <td>{c.coachId}</td><td>{c.name}</td><td>{c.sport?.sportName}</td>
                  <td>{c.phone}</td><td>{c.experience}</td>
                  <td><button className="del-btn" onClick={()=>deleteCoach(c.coachId)}>Delete</button></td>
                </tr>
              ))}</tbody>
            </table>
          </>
        )}

        {/* COURSES */}
        {tab==='courses' && (
          <table className="data-table">
            <thead><tr><th>ID</th><th>Sport</th><th>Coach</th><th>Time</th><th>Fee</th><th>Max</th></tr></thead>
            <tbody>{courses.map(c => (
              <tr key={c.courseId}>
                <td>{c.courseId}</td><td>{c.sport?.sportName}</td><td>{c.coach?.name}</td>
                <td>{c.startTime}–{c.endTime}</td><td>₹{c.fee}</td><td>{c.maxStudents}</td>
              </tr>
            ))}</tbody>
          </table>
        )}

        {/* ENROLLMENTS */}
        {tab==='enrollments' && (
          <>
            <button className="add-btn" onClick={addEnrollment}>+ Add Enrollment</button>
            <table className="data-table">
              <thead><tr><th>ID</th><th>Student</th><th>Sport</th><th>Date</th><th>Status</th><th>Delete</th></tr></thead>
              <tbody>{enrollments.map(e => (
                <tr key={e.enrollmentId}>
                  <td>{e.enrollmentId}</td><td>{e.student?.name}</td>
                  <td>{e.course?.sport?.sportName}</td><td>{e.enrollmentDate}</td>
                  <td><span className="badge">{e.status}</span></td>
                  <td><button className="del-btn" onClick={()=>deleteEnrollment(e.enrollmentId)}>Delete</button></td>
                </tr>
              ))}</tbody>
            </table>
          </>
        )}

        {/* BOOKINGS */}
        {tab==='bookings' && (
          <>
            <button className="add-btn" onClick={()=>showMsg('Students can book courts from their dashboard!')}>ℹ️ Students Book Courts</button>
            <table className="data-table">
              <thead><tr><th>ID</th><th>Student</th><th>Court</th><th>Date</th><th>Time</th><th>Delete</th></tr></thead>
              <tbody>{bookings.map(b => (
                <tr key={b.bookingId}>
                  <td>{b.bookingId}</td><td>{b.student?.name}</td>
                  <td>{b.court?.location}</td><td>{b.bookingDate}</td>
                  <td>{b.startTime}–{b.endTime}</td>
                  <td><button className="del-btn" onClick={()=>deleteBooking(b.bookingId)}>Delete</button></td>
                </tr>
              ))}</tbody>
            </table>
          </>
        )}

        {/* PAYMENTS */}
        {tab==='payments' && (
          <>
            <button className="add-btn" onClick={addPayment}>+ Add Payment Record</button>
            <table className="data-table">
              <thead><tr><th>ID</th><th>Student</th><th>Course</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>{payments.map(p => (
                <tr key={p.paymentId}>
                  <td>{p.paymentId}</td><td>{p.student?.name}</td>
                  <td>{p.course?.sport?.sportName}</td><td>₹{p.amount}</td>
                  <td><span className={`badge ${p.status==='Paid'?'paid':'pending'}`}>{p.status}</span></td>
                  <td>{p.status!=='Paid' && <button onClick={()=>markPaid(p)}>✅ Mark Paid</button>}</td>
                </tr>
              ))}</tbody>
            </table>
          </>
        )}

        {/* ACHIEVEMENTS */}
        {tab==='achievements' && (
          <>
            <button className="add-btn" onClick={addAchievement}>+ Add Achievement</button>
            <table className="data-table">
              <thead><tr><th>ID</th><th>Student</th><th>Sport</th><th>Title</th><th>Date</th><th>Delete</th></tr></thead>
              <tbody>{achievements.map(a => (
                <tr key={a.achievementId}>
                  <td>{a.achievementId}</td><td>{a.student?.name}</td>
                  <td>{a.sport?.sportName}</td><td>{a.title}</td><td>{a.dateWon}</td>
                  <td><button className="del-btn" onClick={()=>deleteAchievement(a.achievementId)}>Delete</button></td>
                </tr>
              ))}</tbody>
            </table>
          </>
        )}

      </div>
    </div>
  );
}