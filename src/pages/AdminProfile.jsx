import { useState } from "react";
import "./AdminProfile.css";

function AdminProfile({ onChangePassword }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (newPassword.length < 6) {
      setMessage("New password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    const success = onChangePassword(currentPassword, newPassword);

    if (success) {
      setMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setMessage("Current password is incorrect.");
    }
  }

  return (
    <div className="admin-profile">
      <h1>Admin Profile</h1>

      <div className="profile-card">
        <h2>Administrator</h2>
        <p><strong>Username:</strong> admin</p>

        <hr />

        <h3>Change Password</h3>

        <form onSubmit={handleSubmit}>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Change Password</button>
          {message && <p className="profile-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default AdminProfile;