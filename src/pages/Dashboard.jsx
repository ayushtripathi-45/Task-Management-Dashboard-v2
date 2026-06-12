import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { FiCalendar, FiEdit3, FiPlus, FiSearch, FiTrash2, FiZap } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import Page from '../components/Page.jsx';
import Counter from '../components/Counter.jsx';
import { SkeletonCard } from '../components/Skeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../firebase/config.js';

const statuses = ['Upcoming', 'In Progress', 'Completed'];
const priorities = ['Low', 'Medium', 'High'];
const emptyTask = { title: '', description: '', priority: 'Medium', dueDate: '', status: 'Upcoming' };

export default function Dashboard() {
  const { currentUser, profile, addActivity } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalTask, setModalTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filters, setFilters] = useState({ query: '', status: 'All', priority: 'All', dueDate: '' });
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    const taskQuery = query(collection(db, 'tasks'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
    return onSnapshot(taskQuery, (snapshot) => {
      setTasks(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      setLoading(false);
    });
  }, [currentUser.uid]);

  useEffect(() => {
    const handleKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setModalTask({ ...emptyTask });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const search = `${task.title} ${task.description}`.toLowerCase().includes(filters.query.toLowerCase());
    const status = filters.status === 'All' || task.status === filters.status;
    const priority = filters.priority === 'All' || task.priority === filters.priority;
    const dueDate = !filters.dueDate || task.dueDate === filters.dueDate;
    return search && status && priority && dueDate;
  }), [tasks, filters]);

  async function saveTask(event) {
    event.preventDefault();
    const clientCreatedAt = new Date().toISOString();
    const payload = {
      ...modalTask,
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
      clientCreatedAt,
      updatedAt: serverTimestamp(),
    };
    try {
      if (modalTask.id) {
        await updateDoc(doc(db, 'tasks', modalTask.id), payload);
        await addActivity(currentUser.uid, 'Task Updated');
        toast.success('Task updated');
      } else {
        const docRef = await addDoc(collection(db, 'tasks'), payload);
        // Optimistically add the new task to UI
        setTasks(prev => [{ id: docRef.id, ...payload, createdAt: clientCreatedAt }, ...prev]);
        await addActivity(currentUser.uid, 'Task Created');
        toast.success('Task created');
      }
      setModalTask(null);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function updateStatus(task, nextStatus) {
    const wasCompleted = task.status !== 'Completed' && nextStatus === 'Completed';
    await updateDoc(doc(db, 'tasks', task.id), {
      status: nextStatus,
      updatedAt: serverTimestamp(),
      completedAt: wasCompleted ? new Date().toISOString() : task.completedAt || null
    });
    if (wasCompleted) {
      await updateStreak();
      await addActivity(currentUser.uid, 'Task Completed');
      celebrate();
    } else {
      await addActivity(currentUser.uid, 'Task Updated');
    }
  }

  async function updateStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const current = profile?.stats?.currentStreak || 0;
    const last = profile?.stats?.lastCompletedDate;
    const next = last === today ? current : last === yesterday ? current + 1 : 1;
    await updateDoc(doc(db, 'users', currentUser.uid), {
      'stats.currentStreak': next,
      'stats.bestStreak': Math.max(profile?.stats?.bestStreak || 0, next),
      'stats.lastCompletedDate': today
    });
  }

  function celebrate() {
    setBurst(true);
    setTimeout(() => setBurst(false), 1200);
    toast.success('Task completed. Streak energy unlocked.');
  }

  async function confirmDelete() {
    await deleteDoc(doc(db, 'tasks', deleteTarget.id));
    await addActivity(currentUser.uid, 'Task Deleted');
    toast.info('Task deleted');
    setDeleteTarget(null);
  }

  function onDragEnd(result) {
    if (!result.destination) return;
    const task = filteredTasks.find((item) => item.id === result.draggableId);
    const nextStatus = result.destination.droppableId;
    if (task && task.status !== nextStatus) updateStatus(task, nextStatus);
  }

  return (
    <Page>
      {burst && <div className="confetti">{Array.from({ length: 28 }).map((_, i) => <span key={i} style={{ '--i': i }} />)}</div>}
      <section className="dashboard-hero glass-panel">
        <div><span className="eyebrow">Dashboard</span><h1>Welcome back, {profile?.profile?.firstName || 'Creator'}.</h1><p>Create tasks, update status, and keep your current streak alive. Press <kbd>Ctrl</kbd> + <kbd>K</kbd> for a new task.</p></div>
        <button className="primary" onClick={() => setModalTask({ ...emptyTask })}><FiPlus /> New Task</button>
      </section>

      <section className="stats-grid dashboard-summary">
        <Stat title="Total Tasks" value={tasks.length} />
        <Stat title="Current Streak" value={profile?.stats?.currentStreak || 0} icon={<FiZap />} />
      </section>

      <section className="toolbar glass-panel">
        <label className="search"><FiSearch /><input placeholder="Search title or description" value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} /></label>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option>All</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}><option>All</option>{priorities.map((p) => <option key={p}>{p}</option>)}</select>
        <input type="date" value={filters.dueDate} onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })} />
      </section>

      {loading ? <div className="board-grid"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div> : (
        <DragDropContext onDragEnd={onDragEnd}>
          <section className="board-grid">
            {statuses.map((status) => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div className="lane glass-panel hover-lift float-card" ref={provided.innerRef} {...provided.droppableProps}>
                    <h2>{status}<span>{filteredTasks.filter((task) => task.status === status).length}</span></h2>
                    {filteredTasks.filter((task) => task.status === status).map((task, index) => <TaskCard key={task.id} task={task} index={index} onEdit={setModalTask} onDelete={setDeleteTarget} onStatus={updateStatus} />)}
                    {provided.placeholder}
                    {!filteredTasks.filter((task) => task.status === status).length && <EmptyLane status={status} />}
                  </div>
                )}
              </Droppable>
            ))}
          </section>
        </DragDropContext>
      )}

      {modalTask && <TaskModal task={modalTask} setTask={setModalTask} onSubmit={saveTask} onClose={() => setModalTask(null)} />}
      {deleteTarget && <ConfirmModal title="Delete task?" text={`This will permanently remove ${deleteTarget.title}.`} onConfirm={confirmDelete} onClose={() => setDeleteTarget(null)} />}
      <button className="fab" onClick={() => setModalTask({ ...emptyTask })}><FiPlus /></button>
    </Page>
  );
}

function Stat({ title, value, suffix = '', icon }) { return <article className="stat-card glass-panel hover-lift float-card"><span>{icon}</span><p>{title}</p><strong><Counter value={value} suffix={suffix} /></strong></article>; }
function EmptyLane({ status }) { return <div className="empty-state"><FiCalendar /><p>No {status.toLowerCase()} tasks yet.</p></div>; }

function TaskCard({ task, index, onEdit, onDelete, onStatus }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <article className={`task-card priority-${task.priority.toLowerCase()} float-card`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div className="task-top"><span>{task.priority}</span><select value={task.status} onChange={(e) => onStatus(task, e.target.value)}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></div>
          <h3>{task.title}</h3><p>{task.description}</p>
          <small>Due {task.dueDate || 'Not scheduled'}</small>
          <div className="task-actions"><button onClick={() => onEdit(task)}><FiEdit3 /></button><button onClick={() => onDelete(task)}><FiTrash2 /></button></div>
        </article>
      )}
    </Draggable>
  );
}

function TaskModal({ task, setTask, onSubmit, onClose }) {
  return <div className="modal-backdrop"><form className="modal-card glass-panel" onSubmit={onSubmit}><h2>{task.id ? 'Update Task' : 'Create Task'}</h2><input required placeholder="Task title" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} /><textarea required placeholder="Description" value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} /><div className="form-grid"><select value={task.priority} onChange={(e) => setTask({ ...task, priority: e.target.value })}>{priorities.map((p) => <option key={p}>{p}</option>)}</select><select value={task.status} onChange={(e) => setTask({ ...task, status: e.target.value })}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></div><input type="date" value={task.dueDate} onChange={(e) => setTask({ ...task, dueDate: e.target.value })} /><div className="button-row"><button className="primary">Save Task</button><button type="button" className="ghost" onClick={onClose}>Cancel</button></div></form></div>;
}

function ConfirmModal({ title, text, onConfirm, onClose }) {
  return <div className="modal-backdrop"><div className="modal-card glass-panel"><h2>{title}</h2><p>{text}</p><div className="button-row"><button className="danger" onClick={onConfirm}>Delete</button><button className="ghost" onClick={onClose}>Cancel</button></div></div></div>;
}