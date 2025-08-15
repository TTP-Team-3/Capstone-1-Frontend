import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import "./ProfileStyles.css";
import NavBar from "../components/NavBar";



const SearchUser = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);



  return (
    <div className="search-users">
      <h1>Search Users</h1>
      <p>Find your friends...</p>


      {/* Search Form */}
      <form >
        <input
          type="text"
          placeholder="Search by username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

    </div>
  );
};

export default SearchUser;
