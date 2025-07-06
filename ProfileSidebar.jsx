import React from "react";
import { NavLink } from "react-router-dom";
import "./ProfileSidebar.css";

const ProfileSidebar = () => (
  <aside className="profile-sidebar">
    <h3>👤 My Space</h3>
    <ul>
      <li><NavLink to="/profile/media">📷 Photos & Videos</NavLink></li>
      <li><NavLink to="/profile/messages">💬 Messages</NavLink></li>
      <li><NavLink to="/profile/flirts">💘 Flirts</NavLink></li>
      <li><NavLink to="/profile/invites">📩 Invites</NavLink></li>
      <li><NavLink to="/profile/games">🎮 Games</NavLink></li>
      <li><NavLink to="/profile/settings">⚙️ Settings</NavLink></li>
    </ul>
  </aside>
);

export default ProfileSidebar;
