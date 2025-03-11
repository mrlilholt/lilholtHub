// src/components/Tasks/TasksCard.js

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { FaTrashAlt, FaStar } from 'react-icons/fa'; // Import the trash and star icons from react-icons

const TasksCard = () => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [assignedTo, setAssignedTo] = useState('');
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailedModalOpen, setDetailedModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [points, setPoints] = useState({});

  const familyMembers = ['Mira', 'Shea', 'Daddy', 'Mommy'];

  useEffect(() => {
    const resetPoints = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const daysUntilMonday = (1 + 7 - dayOfWeek) % 7;
      const nextMonday = new Date(now);
      nextMonday.setDate(now.getDate() + daysUntilMonday);
      nextMonday.setHours(0, 0, 0, 0);

      const timeUntilNextMonday = nextMonday - now;
      setTimeout(() => {
        setPoints({});
        resetPoints();
      }, timeUntilNextMonday);
    };

    resetPoints();
  }, []);

  const openModalFor = (member) => {
    setAssignedTo(member);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTitle('');
    setDueDate('');
    setPriority('Medium');
    setCategory('');
    setDifficulty(1);
    setAssignedTo('');
  };

  const openDetailedModalFor = (member) => {
    setSelectedMember(member);
    setDetailedModalOpen(true);
  };

  const closeDetailedModal = () => {
    setDetailedModalOpen(false);
    setSelectedMember(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !assignedTo) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || null,
        category: category || null,
        difficulty: difficulty ? Number(difficulty) : null,
        assignedTo,
        createdAt: new Date()
      });
      closeModal();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  useEffect(() => {
    const tasksQuery = query(collection(db, 'tasks'), orderBy('dueDate', 'asc'));
    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = [];
      snapshot.forEach((docSnap) => {
        tasksData.push({ id: docSnap.id, ...docSnap.data() });
      });
      setTasks(tasksData);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskCheckbox = (taskId, member) => {
    setCompletedTasks((prev) => {
      const newCompletedTasks = { ...prev, [taskId]: !prev[taskId] };
      const task = tasks.find(t => t.id === taskId);
      if (newCompletedTasks[taskId]) {
        setPoints((prevPoints) => ({
          ...prevPoints,
          [member]: (prevPoints[member] || 0) + (task.difficulty || 0)
        }));
      } else {
        setPoints((prevPoints) => ({
          ...prevPoints,
          [member]: (prevPoints[member] || 0) - (task.difficulty || 0)
        }));
      }
      return newCompletedTasks;
    });
  };

  const tasksByMember = {};
  familyMembers.forEach(member => {
    tasksByMember[member] = tasks.filter(task => task.assignedTo === member);
  });

  return (
    <div className="tasks-card">
      <img 
        src="/tasksLogo.png" 
        alt="Tasks Logo" 
        style={{ height: '60px', marginBottom: '20px' }} 
      />
      <div className="add-task-buttons" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        {familyMembers.map(member => (
          <button key={`btn-${member}`} onClick={() => openModalFor(member)}>
            Add Task for {member}
          </button>
        ))}
      </div>

      <div className="tasks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {familyMembers.map(member => (
          <div key={`grid-${member}`} className="member-tasks" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>
              {member} <FaStar style={{ color: 'gold' }} /> {points[member] || 0}
            </h4>
            <ul className="task-list" style={{ listStyle: 'none', padding: 0, width: '100%' }}>
              {tasksByMember[member].length > 0 ? (
                tasksByMember[member].map(task => (
                  <li key={task.id} className="task-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', padding: '5px', borderRadius: '4px', backgroundColor: '#f9f9f9', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1 }}>
                      <div style={{ flex: '0 0 auto' }}>
                        <input
                          type="checkbox"
                          checked={!!completedTasks[task.id]}
                          onChange={() => handleTaskCheckbox(task.id, member)}
                          style={{ marginRight: '10px' }}
                        />
                      </div>
                      <div style={{ flex: '1 1 auto', wordWrap: 'break-word' }}>
                        <span style={{ textDecoration: completedTasks[task.id] ? 'line-through' : 'none' }}>
                          <strong>{task.title}</strong>
                        </span>
                      </div>
                      <div style={{ flex: '0 0 auto' }}>
                        <button onClick={() => handleDelete(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                          <FaTrashAlt style={{ color: 'red' }} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li style={{ textAlign: 'center', color: '#999' }}>No tasks assigned.</li>
              )}
            </ul>
            <button onClick={() => openDetailedModalFor(member)} style={{ marginTop: '10px', display: 'block', width: '100%' }}>
              Detailed List
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div className="modal-content" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '4px' }}>
            <h3>Add Task</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label>
                  Title:
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                </label>
              </div>
              <div>
                <label>
                  Due Date:
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Priority:
                  <select value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Category:
                  <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Optional" />
                </label>
              </div>
              <div>
                <label>
                  Difficulty (1-5):
                  <input type="number" value={difficulty} min="1" max="5" onChange={e => setDifficulty(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Assigned To:
                  <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} required>
                    <option value="">Select a family member</option>
                    {familyMembers.map(member => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button type="submit">Add Task</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {detailedModalOpen && selectedMember && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div className="modal-content" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '4px', maxWidth: '600px', width: '100%' }}>
            <h3>{selectedMember}'s Detailed Task List</h3>
            <ul className="task-list" style={{ listStyle: 'none', padding: 0 }}>
              {tasksByMember[selectedMember].length > 0 ? (
                tasksByMember[selectedMember].map(task => (
                  <li key={task.id} className="task-item" style={{ marginBottom: '10px', padding: '10px', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{task.title}</strong>
                        <div className="task-attributes" style={{ fontSize: '0.8em', color: '#555' }}>
                          Due: {task.dueDate ? new Date(task.dueDate.seconds * 1000).toLocaleDateString() : 'N/A'}
                          <br />
                          Priority: {task.priority || 'N/A'} | Category: {task.category || 'N/A'} | Difficulty: {task.difficulty || 'N/A'}
                        </div>
                      </div>
                      <button onClick={() => handleDelete(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <FaTrashAlt style={{ color: 'red' }} />
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li style={{ textAlign: 'center', color: '#999' }}>No tasks assigned.</li>
              )}
            </ul>
            <button onClick={closeDetailedModal} style={{ marginTop: '20px' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksCard;
