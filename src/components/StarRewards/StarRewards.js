import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import { FaTrashAlt } from 'react-icons/fa';

const defaultAwards = [
  { stars: 10, reward: "Extra candy for dessert" },
  { stars: 25, reward: "Choose the movie for movie night" },
  { stars: 50, reward: "Stay up an extra 30 minutes" },
  { stars: 75, reward: "Pick a family game" },
  { stars: 100, reward: "Starbucks cakepop treat" },
  { stars: 200, reward: "A fun family outing!" }
];

const familyMembers = ['Mira', 'Shea', 'Daddy', 'Mommy']; 

const StarRewards = () => {
  // Real-time scores subscription.
  const [scores, setScores] = useState({});
  // Award list loaded from Firestore.
  const [awardList, setAwardList] = useState([]);
  // Modal control and new award form state.
  const [showNewAwardModal, setShowNewAwardModal] = useState(false);
  const [newAwardStars, setNewAwardStars] = useState('');
  const [newAwardName, setNewAwardName] = useState('');

  // Subscribe to scores.
  useEffect(() => {
    const scoresRef = doc(db, 'points', 'scores');
    const unsubscribe = onSnapshot(scoresRef, (docSnap) => {
      if (docSnap.exists()) {
        setScores(docSnap.data());
      }
    }, (error) => {
      console.error('Error loading scores:', error);
    });
    return unsubscribe;
  }, []);

  // Subscribe to awards stored in Firestore.
  useEffect(() => {
    const awardsRef = doc(db, 'starRewards', 'awardList');
    const unsubscribe = onSnapshot(awardsRef, async (docSnap) => {
      if (docSnap.exists()) {
        let awards = docSnap.data().rewards || [];
        awards.sort((a, b) => a.stars - b.stars);
        setAwardList(awards);
      } else {
        // If not exist, create the document with default awards.
        await setDoc(awardsRef, { rewards: defaultAwards });
      }
    }, (error) => {
      console.error('Error loading awards:', error);
    });
    return unsubscribe;
  }, []);

  // Handler to add a new award.
  const handleAddAward = async (e) => {
    e.preventDefault();
    try {
      const awardsRef = doc(db, 'starRewards', 'awardList');
      const newAward = { stars: parseInt(newAwardStars, 10), reward: newAwardName };
      const newAwards = [...awardList, newAward];
      newAwards.sort((a, b) => a.stars - b.stars);
      await updateDoc(awardsRef, { rewards: newAwards });
      setNewAwardStars('');
      setNewAwardName('');
      setShowNewAwardModal(false);
    } catch (error) {
      console.error("Error adding new award", error);
    }
  };

  // Handler to delete an award by star threshold.
  const handleDeleteAward = async (stars) => {
    try {
      const awardsRef = doc(db, 'starRewards', 'awardList');
      const newAwards = awardList.filter(award => award.stars !== stars);
      await updateDoc(awardsRef, { rewards: newAwards });
    } catch (error) {
      console.error("Error deleting award", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Logo Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img
          src="/starRewardsLogo.png"
          alt="Star Rewards"
          style={{ height: '60px' }}
        />
      </div>
      
      {/* Family Members Header */}
      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'center', 
          gap: '20px', 
          marginBottom: '20px' 
        }}
      >
        {familyMembers.map(member => (
          <div 
            key={member} 
            style={{ 
              border: '1px solid #ccc', 
              padding: '10px', 
              borderRadius: '4px'
            }}
          >
            <h3 style={{ margin: 0 }}>{member}</h3>
            <p style={{ margin: 0 }}>Stars: <strong>{scores[member] || 0}</strong></p>
          </div>
        ))}
      </div>

      {/* Unified Rewards List */}
      <h3>Reward Tiers</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {awardList.map(({ stars, reward }) => (
          <li key={stars} style={{
            marginBottom: '10px',
            backgroundColor: '#f9f9f9',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>
              <strong>{stars} Stars</strong>: {reward}
            </span>
            <button onClick={() => handleDeleteAward(stars)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <FaTrashAlt style={{ color: 'red' }}/>
            </button>
          </li>
        ))}
      </ul>

      {/* Add New Award Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={() => setShowNewAwardModal(true)} style={{ padding: '10px 20px' }}>
          Add New Award
        </button>
      </div>

      {/* New Award Modal */}
      {showNewAwardModal && (
        <div style={{
          position: 'fixed',
          top: 0, 
          left: 0,
          width: '100%', 
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '4px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3>Add New Award</h3>
            <form onSubmit={handleAddAward}>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  Star Threshold:<br/>
                  <input
                    type="number"
                    value={newAwardStars}
                    onChange={(e) => setNewAwardStars(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  Award Name:<br/>
                  <input
                    type="text"
                    value={newAwardName}
                    onChange={(e) => setNewAwardName(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" style={{ padding: '10px 20px' }}>Add Award</button>
                <button type="button" onClick={() => setShowNewAwardModal(false)} style={{ padding: '10px 20px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StarRewards;