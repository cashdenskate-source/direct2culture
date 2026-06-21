import { useEffect, useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import PageShell from '../../components/PageShell.jsx';
import { db, hasFirebaseConfig } from '../../lib/firebase.js';
import {
  subscribeAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../../lib/appointments.js';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const unsub = subscribeAppointments((rows) => {
      setEvents(
        rows.map((r) => ({
          id: r.id,
          title: r.title + (r.clientName ? ` · ${r.clientName}` : ''),
          start: r.start?.toDate ? r.start.toDate() : new Date(r.start),
          end: r.end?.toDate ? r.end.toDate() : new Date(r.end),
          resource: r,
        })),
      );
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!hasFirebaseConfig || !db) return;
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  function onSelectSlot(slot) {
    setModal({
      mode: 'create',
      clientUid: '',
      clientName: '',
      clientEmail: '',
      title: '',
      start: toLocalInput(slot.start),
      end: toLocalInput(slot.end || addHour(slot.start)),
      notes: '',
    });
  }

  function onSelectEvent(ev) {
    const r = ev.resource || {};
    setModal({
      mode: 'edit',
      id: ev.id,
      clientUid: r.clientUid || '',
      clientName: r.clientName || '',
      clientEmail: r.clientEmail || '',
      title: r.title || '',
      start: toLocalInput(ev.start),
      end: toLocalInput(ev.end),
      notes: r.notes || '',
    });
  }

  async function onSave() {
    const payload = {
      clientUid: modal.clientUid || null,
      clientName: modal.clientName,
      clientEmail: modal.clientEmail,
      title: modal.title || 'Appointment',
      start: new Date(modal.start),
      end: new Date(modal.end),
      notes: modal.notes,
    };
    if (modal.mode === 'create') {
      await createAppointment(payload);
    } else {
      await updateAppointment(modal.id, payload);
    }
    setModal(null);
  }

  async function onDelete() {
    if (!confirm('Delete this appointment?')) return;
    await deleteAppointment(modal.id);
    setModal(null);
  }

  function pickUser(uid) {
    const u = users.find((x) => x.uid === uid || x.id === uid);
    setModal((m) => ({
      ...m,
      clientUid: uid,
      clientName: u?.name || m.clientName,
      clientEmail: u?.email || m.clientEmail,
    }));
  }

  return (
    <PageShell
      eyebrow="Admin / Calendar"
      title="Client schedule."
      kicker={`${events.length} upcoming · click a day to add`}
    >
      <div className="rbc-wrap mt-4" style={{ height: 720 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          popup
        />
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
          <div className="w-full max-w-lg bg-bone border border-ink/10 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
              {modal.mode === 'create' ? 'New Appointment' : 'Edit Appointment'}
            </p>
            <h3 className="mt-1 font-sans text-2xl font-black tracking-tight">Schedule a client</h3>

            <div className="mt-5 space-y-4">
              <div>
                <label className="field-label">Client (signed-up user)</label>
                <select
                  className="field"
                  value={modal.clientUid}
                  onChange={(e) => pickUser(e.target.value)}
                >
                  <option value="">— Pick a user or type below —</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.uid || u.id}>
                      {(u.name || '(no name)') + ' · ' + u.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Name</label>
                  <input
                    className="field"
                    value={modal.clientName}
                    onChange={(e) => setModal({ ...modal, clientName: e.target.value })}
                    placeholder="Client name"
                  />
                </div>
                <div>
                  <label className="field-label">Email</label>
                  <input
                    className="field"
                    value={modal.clientEmail}
                    onChange={(e) => setModal({ ...modal, clientEmail: e.target.value })}
                    placeholder="client@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Title</label>
                <input
                  className="field"
                  value={modal.title}
                  onChange={(e) => setModal({ ...modal, title: e.target.value })}
                  placeholder="Consult · Pitch · Strategy call"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Start</label>
                  <input
                    type="datetime-local"
                    className="field"
                    value={modal.start}
                    onChange={(e) => setModal({ ...modal, start: e.target.value })}
                  />
                </div>
                <div>
                  <label className="field-label">End</label>
                  <input
                    type="datetime-local"
                    className="field"
                    value={modal.end}
                    onChange={(e) => setModal({ ...modal, end: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Notes</label>
                <textarea
                  className="field min-h-[80px]"
                  value={modal.notes}
                  onChange={(e) => setModal({ ...modal, notes: e.target.value })}
                  placeholder="Optional notes"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={() => setModal(null)}
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink"
              >
                Cancel
              </button>
              <div className="flex gap-3">
                {modal.mode === 'edit' && (
                  <button
                    onClick={onDelete}
                    className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600"
                  >
                    Delete
                  </button>
                )}
                <button onClick={onSave} className="btn-primary">
                  {modal.mode === 'create' ? 'Schedule →' : 'Save →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function toLocalInput(d) {
  const dt = d instanceof Date ? d : new Date(d);
  const pad = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

function addHour(d) {
  const dt = new Date(d);
  dt.setHours(dt.getHours() + 1);
  return dt;
}
