import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import "./ProfileStyles.css";
import NavBar from "../components/NavBar";

const Profile = () => {
  const { userId } = useParams();
  // const {id} = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    img: "",
    bio: "",
  });

  const dummyFriends = [
    //dummy data for friends
    { id: 1, username: "andy", email: "jeramy@gmail.com" },
    { id: 2, username: "barbie", email: "aiyanna@gmail.com" },
    { id: 3, username: "cassie", email: "emmanuel@gmail.com" },
    { id: 4, username: "diane", email: "olivia@gmail.com" },
  ];
  const [friends, setFriends] = useState(dummyFriends);
  const [showFriends, setShowFriends] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/${userId}`, {
          withCredentials: true,
        });
        setUser(response.data);
        
        try {
          // const fetchFriends = await axios.get(`${API_URL}/api/users/${userId}/friends`, {
          const friendsResponse = await axios.get(
            `${API_URL}/api/users/${userId}/friends`,
            {
              withCredentials: true,
            }
          );
          setFriends(friendsResponse.data);
        } catch {
          console.warn("Could not fetch real friends; using dummyFriends.");
        }

      } catch (err) {
        if (err.response?.status === 404) {
          setError("User not found.");
        } else if (err.response?.status === 403) {
          setError("You are not authorized to view this profile.");
        } else {
          setError("Something went wrong.");
        }
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        img: user.img || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!user) {
    // User data hasn't loaded yet
    return <div>Loading user profile...</div>;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `${API_URL}/api/users/${userId}`,
        // `${API_URL}/api/users/${user.id}`,

        formData,
        { withCredentials: true }
      );
      setUser(res.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="user-profile-container">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="user-profile-edit-form">
          <h1>Edit Profile</h1>
          <h2>Update your profile information</h2>

          <h3>First Name</h3>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <h3>Last Name</h3>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <h3>Username</h3>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <h3>Email</h3>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <h3>Profile Image</h3>
          <input
            type="text"
            name="img"
            value={formData.img}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <h3>Bio</h3>
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="User Bio"
          />
          <button type="submit">Save</button>
          <button type="button" onClick={handleEditToggle}>
            Cancel
          </button>
        </form>
      ) : (
        <div className="user-profile">
          <h2>User Profile</h2>
          <div className="profile-info">
            <img
              src={
                user.img ||
                "https://static.vecteezy.com/system/resources/thumb…atar-profile-icon-of-social-media-user-vector.jpg"
              }
              alt={`${user.firstName}'s avatar`}
              className="user-profile-img"
            />
            <h2>
              {user.firstName} {user.lastName}
            </h2>

            <button onClick={() => 
              setShowFriends(!showFriends)} 
              className="friends-toggle-button"
            >
              {showFriends ? "Hide Friends" : "Friends:"} ({friends.length})
            </button>

            <p>
              <strong>Bio:</strong> {user.bio}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {user.isAdmin && <span className="admin-badge">Admin</span>}
            <button onClick={handleEditToggle} className="edit-button">
              Edit
            </button>
          </div>
            
          {showFriends && (
            <div className="friends-list">
              <h3>Friends ({friends.length}) </h3>
              {friends.length === 0 ? (
                <p> This user has no friends yet.</p>
              ) : (
                <li>
                  {friends.map((friend) => (
                    <li key={friend.id}>
                      <Link to={`/users/${friend.id}`}>{friend.username}</Link>
                    </li>
                  ))}
                </li>
              )}
            </div>
          )}


        </div>
      )}
    </div>
  );
};

export default Profile;
