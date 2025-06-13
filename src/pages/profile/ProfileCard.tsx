import React from 'react';
import './UserProfile.css'; // Import the shared CSS file
import { PublicUserData, PrivateUserData } from './UserProfilePage'; // Import interfaces from main file

interface ProfileCardProps {
    userData: PublicUserData | PrivateUserData;
    isPrivateMode: boolean;
    isDarkMode: boolean; // Not directly used for styling, but passed to ensure component knows context
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userData, isPrivateMode, isDarkMode }) => {
    return (
        <div className="profile-card">
            <img src={userData.profilePictureUrl} alt="Profile" className="profile-picture" />
            <h2 className="username">{userData.username}</h2>

            {isPrivateMode && (userData as PrivateUserData).fullName && (
                <p className="detail-text">Full Name: <strong>{(userData as PrivateUserData).fullName}</strong></p>
            )}
            {isPrivateMode && (userData as PrivateUserData).email && (
                <p className="detail-text">Email: <strong>{(userData as PrivateUserData).email}</strong></p>
            )}
            {isPrivateMode && (userData as PrivateUserData).phone && (
                <p className="detail-text">Phone: <strong>{(userData as PrivateUserData).phone}</strong></p>
            )}

            <p className="bio">{userData.bio}</p>

            <div className="stats-container">
                <div className="stat-item">
                    <span className="stat-number">{userData.followers}</span>
                    <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{userData.following}</span>
                    <span className="stat-label">Following</span>
                </div>
            </div>

            {isPrivateMode && (userData as PrivateUserData).totalWorkouts !== undefined && (
                <div className="private-stats">
                    <h3 className="private-stats-title">Workout Summary</h3>
                    <p className="detail-text">Total Workouts: <strong>{(userData as PrivateUserData).totalWorkouts}</strong></p>
                    <p className="detail-text">Avg. Workout Duration: <strong>{(userData as PrivateUserData).avgWorkoutDuration} mins</strong></p>
                </div>
            )}
        </div>
    );
};

export default ProfileCard;
