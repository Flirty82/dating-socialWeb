import React from "react";
import { Outlet } from "react-router-dom";
import ProfileSidebar from "../../components/layout/ProfileSidebar";
import "./ProfilePage.css";

const ProfilePage = () => (
  <div className="profile-layout">
    <ProfileSidebar />
    <div className="profile-content">
      <Outlet />
    </div>
  </div>
);

{user.videoUrl && (
  <div className="mt-4">
    <h3 className="font-semibold mb-1">Video Profile Introduction</h3>
    <video src={user.videoUrl} controls className="w-full max-w-md"/>
  </div>
)}

export default ProfilePage;
