import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../api';
import UserForm from './UserForm';
import '../App.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    getUsers()
      .then(users => setUsers(users))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    deleteUser(id)
      .then(() => setUsers(users.filter(user => user._id !== id)))
      .catch(err => console.error(err));
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
  };

  const handleSave = () => {
    getUsers()
      .then(users => setUsers(users))
      .catch(err => console.error(err));
    setEditingUser(null);
  };

  return (
    <div className="user-list">
      <UserForm userId={editingUser} onSave={handleSave} />
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <p>{user.name} - {user.email} - {user.age}</p>
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
