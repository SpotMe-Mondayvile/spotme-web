import React from 'react';
import './UserProfile.css'; // Import the shared CSS file

interface ProfileHeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    isPrivateMode: boolean;
    toggleMode: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ isDarkMode, toggleDarkMode, isPrivateMode, toggleMode }) => {
    return (
        <header className="header">
            <h1 className="title">User Profile</h1>
            <button onClick={toggleMode} className="toggle-button">
                Switch to {isPrivateMode ? 'Public' : 'Private'} Mode
            </button>
            <button onClick={toggleDarkMode} className="dark-mode-toggle-button">
                Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
        </header>
    );
};

export default ProfileHeader;
