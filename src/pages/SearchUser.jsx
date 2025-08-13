import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import "./ProfileStyles.css";
import NavBar from "../components/NavBar";



const SearchUser = ({ user }) => {

  return (
    <div>
        <h1>Search Users</h1>
        <p>Look for your friends — or your enemies...</p>
    </div>
  );
};

export default SearchUser;
