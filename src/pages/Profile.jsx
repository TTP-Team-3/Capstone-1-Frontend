import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import "./ProfileStyles.css";
import FriendsPanel from "../components/FriendsPanel";

const Profile = () => {
  const { userId } = useParams();
  const targetId = parseInt(userId, 10);
  const meId = parseInt(localStorage.getItem("userId") || "0", 10);

  const [searchParams, setSearchParams] = useSearchParams();
  const friendsOpen = searchParams.get("friends") === "1";
  const openFriends = () => {
    const sp = new URLSearchParams(searchParams);
    sp.set("friends", "1");
    setSearchParams(sp, { replace: false });
  };
  const closeFriends = () => {
    const sp = new URLSearchParams(searchParams);
    sp.delete("friends");
    setSearchParams(sp, { replace: true });
  };

  const [user, setUser] = useState(null);
  const [friendsCount, setFriendsCount] = useState(0);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", username: "", email: "", img: "", bio: "",
  });

  // 1) Load the user (controls "User not found.")
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/${targetId}`, { withCredentials: true });
        const u = res.data;
        setUser(u);
        setFormData({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          username: u.username || "",
          email: u.email || "",
          img: u.img || "",
          bio: u.bio || "",
        });
      } catch (err) {
        if (err.response?.status === 404) setError("User not found.");
        else if (err.response?.status === 403) setError("You are not authorized to view this profile.");
        else setError("Something went wrong.");
      }
    })();
  }, [targetId]);

  // 2) Load the user's friends count (try dedicated endpoint; fallback if needed)
  useEffect(() => {
    if (!user) return;

    const loadCount = async () => {
      // Try /api/users/:id/friends
      try {
        const fRes = await axios.get(`${API_URL}/api/users/${targetId}/friends`, { withCredentials: true });
        const list = Array.isArray(fRes.data) ? fRes.data : [];
        setFriendsCount(list.length);
        return;
      } catch (_) {
        // Fallback: build via /api/friends + /api/users
      }

      try {
        const rowsRes = await axios.get(`${API_URL}/api/friends`, { withCredentials: true });
        const rows = Array.isArray(rowsRes.data) ? rowsRes.data : [];
        const count = rows.filter(
          r => r.status === "accepted" && (r.user_id === targetId || r.friend_id === targetId)
        ).length;
        setFriendsCount(count);
      } catch (e) {
        console.warn("Could not compute friends count via fallback.", e);
        setFriendsCount(0);
      }
    };

    loadCount();
  }, [user, targetId]);

  // Edit handlers
  const handleChange = (e) => setFormData(s => ({ ...s, [e.target.name]: e.target.value }));
  const handleEditToggle = () => setIsEditing(p => !p);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`${API_URL}/api/users/${targetId}`, formData, { withCredentials: true });
      setUser(res.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error("Profile update failed:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!user) return <div>Loading user profile...</div>;

  const isMe = targetId === meId;

  return (
    <div className="user-profile-container">
      {/* FriendsPanel via URL (?friends=1) */}
      {friendsOpen && (
        <>
          <div className="nearby-overlay" onClick={closeFriends} aria-hidden="true" />
          <FriendsPanel open={true} onClose={closeFriends} user={{ id: meId }} />
        </>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="user-profile-edit-form">
          <h1>Edit Profile</h1>
          <h2>Update your profile information</h2>

          <h3>First Name</h3>
          <input name="firstName" value={formData.firstName} onChange={handleChange} />

          <h3>Last Name</h3>
          <input name="lastName" value={formData.lastName} onChange={handleChange} />

          <h3>Username</h3>
          <input name="username" value={formData.username} onChange={handleChange} />

          <h3>Email</h3>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />

          <h3>Profile Image</h3>
          <input name="img" value={formData.img} onChange={handleChange} placeholder="Image URL" />

          <h3>Bio</h3>
          <input name="bio" value={formData.bio} onChange={handleChange} placeholder="User Bio" />

          <button type="submit">Save</button>
          <button type="button" onClick={handleEditToggle}>Cancel</button>
        </form>
      ) : (
        <div className="user-profile">
          <h2>User Profile</h2>
          <div className="profile-info">
            <img
              src={
                user.img ||
                "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/3d-rendering-people-icon-3d-avatar-profile-icon-of-social-media-user-vector.jpg"
              }
              alt={`${user.firstName || user.username || "User"}'s avatar`}
              className="user-profile-img"
            />
            <h2>{user.firstName} {user.lastName}</h2>

            {/* Friends button (opens panel), no add/unfriend UI */}
            <button onClick={openFriends} className="friends-toggle-button">
              Manage friends ({friendsCount})
            </button>

            <p><strong>Bio:</strong> {user.bio}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.isAdmin && <span className="admin-badge">Admin</span>}
          </div>

            <button onClick={handleEditToggle} className="edit-button">
              Edit
            </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
