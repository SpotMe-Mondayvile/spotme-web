import React, { RefObject } from 'react';
import '././UserProfile.css'; // Import the shared CSS file
import { WorkoutActivity } from './UserProfilePage'; // Import interface from main file

interface ActivityFeedProps {
    activities: WorkoutActivity[];
    loadingFeed: boolean;
    hasMoreFeed: boolean;
    feedScrollContainerRef: RefObject<HTMLDivElement>;
    isDarkMode: boolean; // Not directly used for styling, but passed to ensure component knows context
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
    activities,
    loadingFeed,
    hasMoreFeed,
    feedScrollContainerRef,
    isDarkMode, // Prop received, but styling is handled by CSS classes
}) => {
    return (
        <div className="feed-section">
            <h3 className="feed-section-title">Recent Activities</h3>
            <div className="feed-posts-container" ref={feedScrollContainerRef}>
                {activities.map(activity => (
                    <div key={activity.id} className="feed-post-card">
                        <img
                            src={activity.imageUrl}
                            alt={activity.activityType}
                            className="feed-post-image"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = `https://placehold.co/600x400/CCCCCC/666666?text=Image+Error`;
                            }}
                        />
                        <div className="feed-card-content">
                            <h4 className="feed-post-title">{activity.activityType}</h4>
                            <p className="feed-post-detail">
                                Duration: <span className="feed-post-value">{activity.durationMinutes}</span> mins
                            </p>
                            <p className="feed-post-detail">
                                Calories Burned: <span className="feed-post-value">{activity.caloriesBurned}</span> kcal
                            </p>
                            <p className="feed-post-date">
                                {activity.date}
                            </p>
                        </div>
                    </div>
                ))}
                {loadingFeed && (
                    <div className="feed-loading-indicator">Loading more activities...</div>
                )}
                {!hasMoreFeed && !loadingFeed && activities.length > 0 && (
                    <div className="feed-no-more-posts">You've reached the end of the activity feed!</div>
                )}
                {!hasMoreFeed && !loadingFeed && activities.length === 0 && (
                    <div className="feed-no-posts-available">No workout activities available.</div>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
