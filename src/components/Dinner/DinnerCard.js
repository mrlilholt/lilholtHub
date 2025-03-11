import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const DinnerCard = () => {
  const [day, setDay] = useState('');
  const [dinnerItem, setDinnerItem] = useState('');
  const [dinnerSchedule, setDinnerSchedule] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setDay('');
    setDinnerItem('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (day && dinnerItem) {
      try {
        await addDoc(collection(db, 'dinnerSchedule'), {
          day,
          dinnerItem,
          timestamp: new Date()
        });
        closeModal();
      } catch (error) {
        console.error('Error adding dinner item:', error);
      }
    }
  };

  useEffect(() => {
    const dinnerQuery = query(collection(db, 'dinnerSchedule'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(dinnerQuery, (snapshot) => {
      const schedule = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Only store the latest dinner item per day
        schedule[data.day] = data.dinnerItem;
      });
      setDinnerSchedule(schedule);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="dinner-card">
      {/* Center the logo, schedule, and the Add Dinner button */}
      <div style={{ textAlign: 'center' }}>
        <img 
          src="/dinnerLogo.png" 
          alt="Dinner Logo" 
          style={{ height: '60px', marginBottom: '10px' }} 
        />
        {/* Make the schedule container inline-block to center it while left aligning its content */}
        <div 
          className="dinner-schedule" 
          style={{ textAlign: 'left', display: 'inline-block', marginBottom: '10px' }}
        >
          <h4 style={{ textAlign: 'center' }}>Schedule</h4>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {daysOfWeek.map((d) => (
              <li key={d}>
                <strong>{d}:</strong> {dinnerSchedule[d] || 'No dinner planned'}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={openModal} style={{ marginTop: '10px' }}>
          Add Dinner
        </button>
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
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            className="modal-content"
            style={{ backgroundColor: 'white', padding: '20px', borderRadius: '4px' }}
          >
            <h3>Add Dinner</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Day:
                <select value={day} onChange={(e) => setDay(e.target.value)} required>
                  <option value="">Select a day</option>
                  {daysOfWeek.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Dinner Item:
                <input
                  type="text"
                  value={dinnerItem}
                  onChange={(e) => setDinnerItem(e.target.value)}
                  placeholder="Enter dinner item"
                  required
                />
              </label>
              <button type="submit">Add Dinner</button>
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DinnerCard;
