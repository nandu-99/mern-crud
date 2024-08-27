import React, { useState, useEffect } from 'react';
import { createUser, updateUser, getUserById } from '../api';
import '../App.css';

const UserForm = ({ userId, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    if (userId) {
      getUserById(userId)
        .then(user => {
          setName(user.name);
          setEmail(user.email);
          setAge(user.age);
        })
        .catch(err => console.error(err));
    }
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { name, email, age };
    if (userId) {
      updateUser(userId, user)
        .then(() => onSave())
        .catch(err => console.error(err));
    } else {
      createUser(user)
        .then(() => onSave())
        .catch(err => console.error(err));
    }
    setName('');
    setEmail('');
    setAge('');
  };

  return (
    <div className="user-form">
      <h2>{userId ? 'Update User' : 'Create User'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Age:
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </label>
        <button type="submit">{userId ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default UserForm;
