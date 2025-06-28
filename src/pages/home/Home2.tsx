import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonText,
} from '@ionic/react';

// Import custom CSS for specific styling that Ionic defaults don't cover
import './FeedPage.css';

// Define the interface for a single workout activity
interface WorkoutActivity {
    id: number;
    activityType: string;
    durationMinutes: number;
    caloriesBurned: number;
    date: string;
    imageUrl: string; // Added for the photo
}

// --- Simulated API Client ---
// This object simulates an API client that would typically be in a separate file
// and handle actual HTTP requests. For this example, it generates dummy data.
const apiClient = {
    getWorkoutActivities: async (pageNum: number, itemsPerPage: number): Promise<{ data: WorkoutActivity[], hasMore: boolean }> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const allPossibleActivities: WorkoutActivity[] = [];
        const totalActivities = 50; // Max number of dummy activities available
        const activityTypes = ['Running', 'Weightlifting', 'Cycling', 'Yoga', 'Swimming', 'Hiking', 'CrossFit', 'Pilates'];
        const imageWidth = 600;
        const imageHeight = 400;

        // Generate a fixed set of dummy activities for consistent pagination
        for (let i = 0; i < totalActivities; i++) {
            const id = i + 1;
            const randomActivityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
            const randomDuration = Math.floor(Math.random() * 90) + 20; // 20-110 minutes
            const randomCalories = Math.floor(Math.random() * 400) + 150; // 150-550 calories
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
// --- End Simulated API Client ---


const FeedPage: React.FC = () => {
    const [activities, setActivities] = useState<WorkoutActivity[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);

    // Ref for the IonContent component to attach scroll listener
    const ionContentRef = useRef<HTMLIonContentElement>(null);

    // Fetch workout activity data using the apiClient
    const fetchActivities = useCallback(async (pageNum: number) => {
        if (!hasMore && pageNum > 1) { // Prevent fetching if no more data and not initial load
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const itemsPerPage = 10;
            const { data: newActivities, hasMore: moreAvailable } = await apiClient.getWorkoutActivities(pageNum, itemsPerPage);

            setActivities(prevActivities => [...prevActivities, ...newActivities]);
            setHasMore(moreAvailable);
            setPage(prevPage => prevPage + 1);

        } catch (error) {
            console.error("Failed to fetch activities:", error);
            setHasMore(false); // Stop trying to load more on error
        } finally {
            setLoading(false);
        }
    }, [hasMore]); // Dependency on hasMore to ensure correct behavior when no more data

    // Effect to load initial activities on component mount
    useEffect(() => {
        fetchActivities(1);
    }, [fetchActivities]);

    // Handle scroll event for infinite scrolling
    const handleScroll = useCallback(async () => {
        if (ionContentRef.current) {
            const scrollElement = await ionContentRef.current.getScrollElement();
            if (scrollElement) {
                const { scrollTop, scrollHeight, clientHeight } = scrollElement;

                // Check if user has scrolled to the bottom (within a small threshold)
                // Ensure we only fetch if not already loading and there's potentially more data
                if (scrollHeight - scrollTop - clientHeight < 50 && !loading && hasMore) {
                    fetchActivities(page);
                }
            }
        }
    }, [loading, hasMore, page, fetchActivities]); // Dependencies for useCallback

    // Attach and detach scroll event listener
    useEffect(() => {
        const currentRef = ionContentRef.current;
        if (currentRef) {
            currentRef.addEventListener('ionScroll', handleScroll);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('ionScroll', handleScroll);
            }
        };
    }, [handleScroll]); // Re-run effect if handleScroll changes (due to its dependencies)

    return (
        <>
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle className="ion-text-center">My Workout Activity Feed</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen scrollEvents={true} ref={ionContentRef}>
                <div className="feed-container"> {/* This div helps center content */}
                    {activities.map(activity => (
                        <IonCard key={activity.id} className="workout-card">
                            <IonImg
                                src={activity.imageUrl}
                                alt={activity.activityType}
                                onError={(e) => {
                                    // Fallback for broken images
                                    const target = e.target as HTMLIonImgElement;
                                    target.src = `https://placehold.co/600x400/CCCCCC/666666?text=Image+Error`;
                                }}
                            />
                            <IonCardHeader>
                                <IonCardTitle className="activity-type-title">{activity.activityType}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonText className="activity-detail">
                                    Duration: <span className="activity-value">{activity.durationMinutes}</span> minutes
                                </IonText>
                                <IonText className="activity-detail">
                                    Calories Burned: <span className="activity-value">{activity.caloriesBurned}</span> kcal
                                </IonText>
                                <IonText className="activity-date">
                                    {activity.date}
                                </IonText>
                            </IonCardContent>
                        </IonCard>
                    ))}
                    {loading && (
                        <div className="loading-indicator">Loading more activities...</div>
                    )}
                    {!hasMore && !loading && activities.length > 0 && (
                        <div className="no-more-posts">You've reached the end of your workout history!</div>
                    )}
                    {!hasMore && !loading && activities.length === 0 && (
                        <div className="no-posts-available">No workout activities available.</div>
                    )}
                </div>
            </IonContent>
        </IonPage>
        </>
    );
};

export default FeedPage;
