import React, { useState, useEffect, useRef, useCallback } from 'react';
import './UserProfile.css'; // Import the shared CSS file

// Import the new sub-components
import ProfileHeader from './ProfileHeader';
import ProfileCard from './ProfileCard';
import ActivityFeed from './ActivityFeed';

// Define interfaces for user data (kept in main file for simplicity as per rules)
export interface PublicUserData {
    id: string;
    username: string;
    profilePictureUrl: string;
    bio: string;
    followers: number;
    following: number;
}

export interface PrivateUserData extends PublicUserData {
    fullName: string;
    email: string;
    phone: string;
    totalWorkouts: number;
    avgWorkoutDuration: number; // in minutes
}

// Define the interface for a single workout activity (kept in main file for simplicity)
export interface WorkoutActivity {
    id: number;
    activityType: string;
    durationMinutes: number;
    caloriesBurned: number;
    date: string;
    imageUrl: string; // Added for the photo
}

// --- Simulated API Clients (kept in main file as per rules) ---
export const userApiClient = {
    fetchPublicProfile: async (): Promise<PublicUserData> => {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        return {
            id: 'user123',
            username: 'fit_explorer',
            profilePictureUrl: 'https://placehold.co/150x150/A0A0A0/FFFFFF?text=User', // Placeholder
            bio: 'Passionate about fitness, hiking, and healthy living. Sharing my journey!',
            followers: 1245,
            following: 321,
        };
    },

    fetchPrivateProfile: async (): Promise<PrivateUserData> => {
        await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay
        return {
            id: 'user123',
            username: 'fit_explorer',
            profilePictureUrl: 'https://placehold.co/150x150/A0A0A0/FFFFFF?text=User', // Placeholder
            bio: 'Passionate about fitness, hiking, and healthy living. Sharing my journey!',
            followers: 1245,
            following: 321,
            fullName: 'Jane Doe',
            email: 'jane.doe@example.com',
            phone: '+1-555-123-4567',
            totalWorkouts: 250,
            avgWorkoutDuration: 65,
        };
    },
};

export const workoutApiClient = {
    getWorkoutActivities: async (pageNum: number, itemsPerPage: number): Promise<{ data: WorkoutActivity[], hasMore: boolean }> => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        const allPossibleActivities: WorkoutActivity[] = [];
        const totalActivities = 50;
        const activityTypes = ['Running', 'Weightlifting', 'Cycling', 'Yoga', 'Swimming', 'Hiking', 'CrossFit', 'Pilates'];
        const imageWidth = 600;
        const imageHeight = 400;

        for (let i = 0; i < totalActivities; i++) {
            const id = i + 1;
            const randomActivityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
            const randomDuration = Math.floor(Math.random() * 90) + 20;
            const randomCalories = Math.floor(Math.random() * 400) + 150;
            const randomDate = new Date(Date.now() - (id * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            const imageUrl = `https://placehold.co/${imageWidth}x${imageHeight}/E0E0E0/333333?text=${randomActivityType.replace(/\s/g, '+')}-${id}`;

            allPossibleActivities.push({
                id: id,
                activityType: randomActivityType,
                durationMinutes: randomDuration,
                caloriesBurned: randomCalories,
                date: randomDate,
                imageUrl: imageUrl,
            });
        }

        const startIndex = (pageNum - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const slicedActivities = allPossibleActivities.slice(startIndex, endIndex);

        const moreAvailable = endIndex < totalActivities;

        return { data: slicedActivities, hasMore: moreAvailable };
    }
};
// --- End Simulated API Clients ---


const UserProfilePage: React.FC = () => {
    // Profile State
    const [isPrivateMode, setIsPrivateMode] = useState<boolean>(false);
    const [userData, setUserData] = useState<PublicUserData | PrivateUserData | null>(null);
    const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
    const [profileError, setProfileError] = useState<string | null>(null);

    // Feed State
    const [activities, setActivities] = useState<WorkoutActivity[]>([]);
    const [loadingFeed, setLoadingFeed] = useState<boolean>(false);
    const [hasMoreFeed, setHasMoreFeed] = useState<boolean>(true);
    const [feedPage, setFeedPage] = useState<number>(1);

    // Dark Mode State
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    // Ref for the feed scrollable container (passed to ActivityFeed)
    const feedScrollContainerRef = useRef<HTMLDivElement>(null);

    // --- Dark Mode Logic ---
    useEffect(() => {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const storedTheme = localStorage.getItem('theme');

        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            setIsDarkMode(true);
        } else {
            setIsDarkMode(false);
        }
    }, []);

    useEffect(() => {
        // This effect manages the 'dark-mode' class on the body
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    // --- Profile Fetching Logic ---
    const fetchUserProfile = useCallback(async () => {
        setLoadingProfile(true);
        setProfileError(null);
        try {
            if (isPrivateMode) {
                const data = await userApiClient.fetchPrivateProfile();
                setUserData(data);
            } else {
                const data = await userApiClient.fetchPublicProfile();
                setUserData(data);
            }
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
            setProfileError("Could not load profile. Please try again.");
        } finally {
            setLoadingProfile(false);
        }
    }, [isPrivateMode]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const toggleMode = () => {
        setIsPrivateMode(prevMode => !prevMode);
    };

    // --- Feed Fetching Logic ---
    const fetchFeedActivities = useCallback(async (pageNum: number) => {
        if (!hasMoreFeed && pageNum > 1) {
            setLoadingFeed(false);
            return;
        }

        setLoadingFeed(true);
        try {
            const itemsPerPage = 6;
            const { data: newActivities, hasMore: moreAvailable } = await workoutApiClient.getWorkoutActivities(pageNum, itemsPerPage);

            setActivities(prevActivities => [...prevActivities, ...newActivities]);
            setHasMoreFeed(moreAvailable);
            setFeedPage(prevPage => prevPage + 1);

        } catch (error) {
            console.error("Failed to fetch feed activities:", error);
            setHasMoreFeed(false);
        } finally {
            setLoadingFeed(false);
        }
    }, [hasMoreFeed]);

    useEffect(() => {
        fetchFeedActivities(1);
    }, [fetchFeedActivities]);

    // Handle scroll event for infinite scrolling of the feed
    const handleFeedScroll = useCallback(() => {
        if (feedScrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = feedScrollContainerRef.current;

            if (scrollHeight - scrollTop - clientHeight < 50 && !loadingFeed && hasMoreFeed) {
                fetchFeedActivities(feedPage);
            }
        }
    }, [loadingFeed, hasMoreFeed, feedPage, fetchFeedActivities]);

    // Attach and detach scroll event listener for the feed (passed to ActivityFeed)
    useEffect(() => {
        const currentRef = feedScrollContainerRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleFeedScroll);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleFeedScroll);
            }
        };
    }, [handleFeedScroll]);

    // --- Render Logic for Profile ---
    if (loadingProfile) {
        return (
            <div className="page-container">
                <div className="loading-indicator">Loading profile...</div>
            </div>
        );
    }

    if (profileError) {
        return (
            <div className="page-container">
                <div className="error-message">{profileError}</div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="page-container">
                <div className="no-data-message">No user data available.</div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <ProfileHeader
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                isPrivateMode={isPrivateMode}
                toggleMode={toggleMode}
            />

            <ProfileCard
                userData={userData}
                isPrivateMode={isPrivateMode}
                isDarkMode={isDarkMode}
            />

            <ActivityFeed
                activities={activities}
                loadingFeed={loadingFeed}
                hasMoreFeed={hasMoreFeed}
                feedScrollContainerRef={feedScrollContainerRef}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};

export default UserProfilePage;
