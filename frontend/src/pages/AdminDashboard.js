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
  const [performances, setPerformances] = useState([]);
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
    API.performances.get('').then(r => setPerformances(r.data)).catch(()=>{});
  };
  useEffect(load, []);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const getPaymentStatus = (studentId, courseId) => {
    const p = payments.find(p => p.student?.studentId === studentId && p.course?.courseId === courseId);
    return p ? { status: p.status, paymentId: p.paymentId, full: p } : null;
  };

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

  // ── COURSES ──
  const addCourse = async () => {
    const sportsList = sports.map(s => `${s.sportId} = ${s.sportName}`).join('\n');
    const sportId = prompt(`Enter Sport ID:\n\n${sportsList}`);
    if (!sportId) return;
    const matchingCoaches = coaches.filter(c => c.sport?.sportId === Number(sportId));
    const coachesList = matchingCoaches.length > 0
      ? matchingCoaches.map(c => `${c.coachId} = ${c.name}`).join('\n')
      : 'No coaches added yet for this sport';
    const coachId     = prompt(`Enter Coach ID (press Cancel to skip):\n\n${coachesList}`);
    const startTime   = prompt('Start Time (e.g. 08:00):');
    const endTime     = prompt('End Time (e.g. 10:00):');
    const duration    = prompt('Duration (months):');
    const fee         = prompt('Fee (₹):');
    const maxStudents = prompt('Max Students:');
    if (!startTime || !endTime || !fee) return;
    const payload = {
      sport: { sportId: Number(sportId) },
      startTime, endTime,
      duration: Number(duration) || 1,
      fee: Number(fee),
      maxStudents: Number(maxStudents) || 10,
    };
    if (coachId && coachId.trim() !== '') {
      payload.coach = { coachId: Number(coachId) };
    }
    await API.courses.post('', payload).catch(()=>{});
    showMsg('Course added!'); load();
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    await API.courses.delete(`/${id}`).catch(()=>{});
    showMsg('Course deleted!'); load();
  };

  // ── ENROLLMENTS ──
  const addEnrollment = async () => {
    const studentId = prompt('Student ID:');
    const courseId  = prompt('Course ID:');
    if (!studentId || !courseId) return;
    const course = courses.find(c => c.courseId === Number(courseId));
    await API.enrollments.post('', {
      student: { studentId: Number(studentId) },
      course: { courseId: Number(courseId) },
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }).catch(()=>{});
    if (course) {
      await API.payments.post('', {
        student: { studentId: Number(studentId) },
        course: { courseId: Number(courseId) },
        amount: course.fee,
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'Pending'
      }).catch(()=>{});
    }
    showMsg('Enrollment added!'); load();
  };

  const deleteEnrollment = async (id) => {
    if (!window.confirm('Delete this enrollment?')) return;
    try {
      await API.enrollments.delete(`/${id}`);
      showMsg('Enrollment deleted!'); load();
    } catch(e) {
      showMsg('Delete failed: ' + (e.response?.data?.message || e.message));
    }
  };

  // ── PAYMENTS ──
  const markPaid = async (p) => {
    await API.payments.put(`/${p.paymentId}`, { ...p, status: 'Paid' }).catch(()=>{});
    showMsg('Marked as paid!'); load();
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

  const coursesBySport = courses.reduce((acc, c) => {
    const sport = c.sport?.sportName || 'Unknown';
    if (!acc[sport]) acc[sport] = [];
    acc[sport].push(c);
    return acc;
  }, {});

  const tabs = ['students','coaches','courses','enrollments','bookings','achievements','performance'];

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
          <div>
            <button className="add-btn" onClick={addCourse}>+ Add Course</button>
            {courses.length === 0 && (
              <p style={{ color: '#888', padding: '1rem' }}>No courses yet. Click "+ Add Course" to create one.</p>
            )}
            {Object.entries(coursesBySport).map(([sportName, sportCourses]) => (
              <div key={sportName} className="sport-section">
                <h3 className="sport-title">{sportName}</h3>
                <div className="course-row">
                  {sportCourses.map(c => (
                    <div className="card" key={c.courseId}>
                      <h3>{c.sport?.sportName}</h3>
                      <p>🆔 Course ID: {c.courseId}</p>
                      <p>👤 Coach: {c.coach?.name || <span style={{color:'#e94560'}}>Not Assigned</span>}</p>
                      <p>🕐 Time: {c.startTime} – {c.endTime}</p>
                      <p>📅 Duration: {c.duration} months</p>
                      <p className="fee">₹{c.fee}</p>
                      <p>👥 Max Students: {c.maxStudents}</p>
                      <button
                        style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem', background: '#0f3460', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={async () => {
                          const matchingCoaches = coaches.filter(co => co.sport?.sportName === c.sport?.sportName);
                          const coachesList = matchingCoaches.length > 0
                            ? matchingCoaches.map(co => `${co.coachId} = ${co.name}`).join('\n')
                            : 'No coaches for this sport yet';
                          const coachId = prompt(`Assign Coach to ${c.sport?.sportName}:\n\n${coachesList}`);
                          if (!coachId) return;
                          await API.courses.patch(`/${c.courseId}/assign-coach/${coachId}`).catch(()=>{});
                          showMsg('Coach assigned!'); load();
                        }}
                      >🔗 Assign Coach</button>
                      {c.coach && (
                        <button
                          style={{ marginTop: '0.4rem', width: '100%', padding: '0.5rem', background: '#fff7ed', color: '#c2410c', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                          onClick={async () => {
                            if (!window.confirm('Remove coach from this course?')) return;
                            await API.courses.patch(`/${c.courseId}/remove-coach`).catch(()=>{});
                            showMsg('Coach removed!'); load();
                          }}
                        >✕ Remove Coach</button>
                      )}
                      <button
                        style={{ marginTop: '0.4rem', width: '100%', padding: '0.5rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => deleteCourse(c.courseId)}
                      >🗑 Delete Course</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ENROLLMENTS */}
        {tab==='enrollments' && (
          <>
            <button className="add-btn" onClick={addEnrollment}>+ Add Enrollment</button>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Student</th><th>Sport</th><th>Date</th>
                  <th>Status</th><th>Payment</th><th>Action</th><th>Delete</th>
                </tr>
              </thead>
              <tbody>{enrollments.map(e => {
                const payment = getPaymentStatus(e.student?.studentId, e.course?.courseId);
                return (
                  <tr key={e.enrollmentId}>
                    <td>{e.enrollmentId}</td>
                    <td>{e.student?.name}</td>
                    <td>{e.course?.sport?.sportName}</td>
                    <td>{e.enrollmentDate}</td>
                    <td><span className="badge">{e.status}</span></td>
                    <td>
                      {payment
                        ? <span className={`badge ${payment.status === 'Paid' ? 'paid' : 'pending'}`}>{payment.status}</span>
                        : <span className="badge">—</span>}
                    </td>
                    <td>
                      {payment && payment.status !== 'Paid' && (
                        <button onClick={() => markPaid(payment.full)}>✅ Mark Paid</button>
                      )}
                    </td>
                    <td>
                      <button className="del-btn" onClick={() => deleteEnrollment(e.enrollmentId)}>Delete</button>
                    </td>
                  </tr>
                );
              })}</tbody>
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

        {/* PERFORMANCE */}
        {tab==='performance' && (
          <>
            <button className="add-btn" onClick={async () => {
              const studentId = prompt('Student ID:');
              const sportId   = prompt('Sport ID (1=Cricket, 2=Badminton, 3=Basketball):');
              const matches   = prompt('Matches Played:');
              const wins      = prompt('Wins:');
              if (!studentId || !sportId) return;
              const sport = sports.find(s => s.sportId === Number(sportId));
              const sportName = sport?.sportName?.toUpperCase();
              const payload = {
                student: { studentId: Number(studentId) },
                sport: { sportId: Number(sportId) },
                matchesPlayed: Number(matches) || 0,
                wins: Number(wins) || 0,
              };
              if (sportName === 'CRICKET') {
                payload.runsScored   = Number(prompt('Runs Scored:')) || 0;
                payload.wicketsTaken = Number(prompt('Wickets Taken:')) || 0;
                payload.catchesTaken = Number(prompt('Catches Taken:')) || 0;
              } else if (sportName === 'BADMINTON') {
                payload.pointsScored = Number(prompt('Points Scored:')) || 0;
                payload.setsWon      = Number(prompt('Sets Won:')) || 0;
              } else if (sportName === 'BASKETBALL') {
                payload.pointsScoredBasketball = Number(prompt('Points Scored:')) || 0;
                payload.assists  = Number(prompt('Assists:')) || 0;
                payload.rebounds = Number(prompt('Rebounds:')) || 0;
              }
              await API.performances.post('', payload).catch(()=>{});
              showMsg('Performance record added!'); load();
            }}>+ Add Performance</button>

            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Student</th><th>Sport</th>
                  <th>Matches</th><th>Wins</th><th>Sport Details</th>
                  <th>Edit</th><th>Delete</th>
                </tr>
              </thead>
              <tbody>{performances.map(p => {
                const sportName = p.sport?.sportName?.toUpperCase();
                const details = sportName === 'CRICKET'
                  ? `Runs: ${p.runsScored ?? '—'} | Wkts: ${p.wicketsTaken ?? '—'} | Catches: ${p.catchesTaken ?? '—'}`
                  : sportName === 'BADMINTON'
                  ? `Points: ${p.pointsScored ?? '—'} | Sets: ${p.setsWon ?? '—'}`
                  : sportName === 'BASKETBALL'
                  ? `Points: ${p.pointsScoredBasketball ?? '—'} | Assists: ${p.assists ?? '—'} | Reb: ${p.rebounds ?? '—'}`
                  : '—';
                return (
                  <tr key={p.performanceId}>
                    <td>{p.performanceId}</td>
                    <td>{p.student?.name}</td>
                    <td>{p.sport?.sportName}</td>
                    <td>{p.matchesPlayed ?? '—'}</td>
                    <td>{p.wins ?? '—'}</td>
                    <td>{details}</td>
                    <td>
                      <button onClick={async () => {
                        const matches = prompt('Matches Played:', p.matchesPlayed);
                        const wins    = prompt('Wins:', p.wins);
                        const payload = { ...p, matchesPlayed: Number(matches), wins: Number(wins) };
                        const sName = p.sport?.sportName?.toUpperCase();
                        if (sName === 'CRICKET') {
                          payload.runsScored   = Number(prompt('Runs Scored:', p.runsScored));
                          payload.wicketsTaken = Number(prompt('Wickets Taken:', p.wicketsTaken));
                          payload.catchesTaken = Number(prompt('Catches Taken:', p.catchesTaken));
                        } else if (sName === 'BADMINTON') {
                          payload.pointsScored = Number(prompt('Points Scored:', p.pointsScored));
                          payload.setsWon      = Number(prompt('Sets Won:', p.setsWon));
                        } else if (sName === 'BASKETBALL') {
                          payload.pointsScoredBasketball = Number(prompt('Points Scored:', p.pointsScoredBasketball));
                          payload.assists  = Number(prompt('Assists:', p.assists));
                          payload.rebounds = Number(prompt('Rebounds:', p.rebounds));
                        }
                        await API.performances.put(`/${p.performanceId}`, payload).catch(()=>{});
                        showMsg('Performance updated!'); load();
                      }}>✏️ Edit</button>
                    </td>
                    <td>
                      <button className="del-btn" onClick={async () => {
                        if (!window.confirm('Delete this record?')) return;
                        await API.performances.delete(`/${p.performanceId}`).catch(()=>{});
                        showMsg('Performance deleted!'); load();
                      }}>Delete</button>
                    </td>
                  </tr>
                );
              })}</tbody>
            </table>
          </>
        )}

      </div>
    </div>
  );
}