import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.scss';

const Profile = ({ setUser, setLogin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const value = localStorage.getItem('Auth');

  const [profile, setProfile] = useState({
    name: '',
    age: '',
    ph: '',
  });

  useEffect(() => {
    fetchUserProfile();
    getUser();
  }, []);

  const getUser = async () => {
    if (value) {
      try {
        const res = await axios.get("http://localhost:3000/api/home", { headers: { "Authorization": `Bearer ${value}` } });
        if (res.status === 200) {
          setUser(res.data.username);
          setLogin(res.data.accounttype);
        } else {
          alert("Login failed");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/getuser', {
        headers: { Authorization: `Bearer ${value}` },
      });
      if (res.status === 201) {
        setProfile(res.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3000/api/edituser',
        profile,
        { headers: { Authorization: `Bearer ${value}` } }
      );
      if (res.status === 200 || res.status === 201) {
        alert('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('Auth'); // Clear token from local storage
    setUser(null);
    setLogin(null);
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-header">Profile</h1>
        {Object.values(profile).every((value) => value === '') && !isEditing ? (
          <p className="no-data">No profile data available. Click "Edit" to add your details.</p>
        ) : (
          <div className="profile-fields">
            <div className="profile-field">
              <label className="profile-label">Name</label>
              {isEditing ? (
                <input type="text" name="name" value={profile.name} onChange={handleChange} className="profile-input" />
              ) : (
                <p className="profile-text">{profile.name}</p>
              )}
            </div>
            <div className="profile-field">
              <label className="profile-label">Age</label>
              {isEditing ? (
                <input type="number" name="age" value={profile.age} onChange={handleChange} className="profile-input" />
              ) : (
                <p className="profile-text">{profile.age}</p>
              )}
            </div>
            <div className="profile-field">
              <label className="profile-label">Phone Number</label>
              {isEditing ? (
                <input type="tel" name="ph" value={profile.ph} onChange={handleChange} className="profile-input" />
              ) : (
                <p className="profile-text">{profile.ph}</p>
              )}
            </div>
          </div>
        )}
        <div className="profile-actions">
          {isEditing ? (
            <button onClick={handleSave} className="profile-btn save-btn">
              Save
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="profile-btn edit-btn">
              Edit
            </button>
          )}
          <button onClick={handleLogout} className="profile-btn logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
