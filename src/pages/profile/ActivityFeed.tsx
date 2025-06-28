import React, { RefObject, useState, useEffect, useRef } from 'react';
import {routineGetAll} from './../../utils/services/routineServices';

const apiClient = {
    fetchActivities: async (offset: number, limit: number): Promise<{ activities: WorkoutActivity[], hasMore: boolean }> => {
      // Make a GET request using the mock Axios instance.
      // The URL `/api/routines` is symbolic here, as the mock handles the data directly.
      const response = await routineGetAll();
      return response.data; // Return the data part of the Axios response
    },
  };

// Define the structure for a single workout routine.
// This interface now reflects the new data fields provided by the user.
interface WorkoutActivity {
  routineId: number; // Unique identifier for each routine
  routineName: string; // Name of the workout routine (e.g., "Mom, I Can't Walk(Paraplegic Conversion)")
  userId: number; // User ID associated with the routine
  workoutIntensity: string; // Intensity level of the workout (e.g., "Know Pain")
  exerciseList: string[]; // List of exercises in the routine
  routineType: string; // Type of routine (e.g., "Lower Body")
  imageUrl: string; // Keeping imageUrl for visual representation, even if not in provided sample
}

// Props interface for the ActivityFeed component.
// It defines the data and functions that the parent component passes down.
interface ActivityFeedProps {
  activities: WorkoutActivity[]; // Array of workout routines to display
  loadingFeed: boolean; // Boolean indicating if new routines are currently being loaded
  hasMoreFeed: boolean; // Boolean indicating if there are more routines available to load
  feedScrollContainerRef: RefObject<HTMLDivElement>; // Ref to the scrollable container for infinite scroll
  isDarkMode: boolean; // Boolean to indicate if dark mode is active (influences Tailwind classes)
}

// ActivityFeed Functional Component
// This component is responsible for rendering the list of recent workout routines.
const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  loadingFeed,
  hasMoreFeed,
  feedScrollContainerRef,
  isDarkMode,
}) => {
  return (
    // Main container for the activity feed section.
    // Dynamically applies dark mode background and text colors using Tailwind CSS.
    <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} feed-section`}>
      {/* Title of the activity feed section */}
      <h3 className="text-2xl font-semibold mb-4 text-center feed-section-title">Recent Routines</h3>

      {/* Container for the individual activity posts.
          It's scrollable (overflow-y-auto) and has a maximum height to enable infinite scrolling. */}
      <div className="overflow-y-auto max-h-96 pr-2 feed-posts-container" ref={feedScrollContainerRef}>
        {/* Conditional rendering: Check if there are any routines to display. */}
        {activities.length > 0 ? (
          // Map through the activities array to render each workout routine as a card.
          activities.map(routine => (
            <div
              key={routine.routineId} // Unique key for React list rendering optimization
              className={`flex items-center p-4 mb-3 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition duration-200 feed-post-card`}
            >
              {/* Routine Image */}
              <img
                src={routine.imageUrl} // Source URL for the routine image
                alt={routine.routineName} // Alt text for accessibility
                className="w-20 h-20 object-cover rounded-md mr-4 flex-shrink-0 feed-post-image"
                // Error handler for image loading issues.
                // Replaces the broken image with a placeholder.
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevents infinite loop if placeholder itself fails
                  target.src = `https://placehold.co/80x80/CCCCCC/666666?text=No+Image`; // Placeholder image URL
                }}
              />
              {/* Container for routine details */}
              <div className="flex-grow feed-card-content">
                <h4 className="text-lg font-bold mb-1 feed-post-title">{routine.routineName}</h4>
                <p className="text-sm feed-post-detail">
                  Type: <span className="font-semibold feed-post-value">{routine.routineType}</span>
                </p>
                <p className="text-sm feed-post-detail">
                  Intensity: <span className="font-semibold feed-post-value">{routine.workoutIntensity}</span>
                </p>
                <p className="text-sm feed-post-detail">
                  Exercises:
                  <ul className="list-disc list-inside text-xs mt-1">
                    {routine.exerciseList.map((exercise, index) => (
                      <li key={index} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{exercise}</li>
                    ))}
                  </ul>
                </p>
              </div>
            </div>
          ))
        ) : (
          // Message displayed when there are no workout routines available.
          <div className="text-center py-8 text-gray-500 feed-no-posts-available">
            No workout routines available. Start creating your routines!
          </div>
        )}

        {/* Loading indicator, displayed when `loadingFeed` is true. */}
        {loadingFeed && (
          <div className="text-center py-4 text-gray-500 feed-loading-indicator">
            Loading more routines...
          </div>
        )}

        {/* "End of feed" message, displayed when no more routines can be loaded
            and the current list is not empty. */}
        {!hasMoreFeed && !loadingFeed && activities.length > 0 && (
          <div className="text-center py-4 text-gray-500 feed-no-more-posts">
            You've reached the end of the routine feed!
          </div>
        )}
      </div>
    </div>
  );
};

// Main App component
// This component serves as the entry point and orchestrates the ActivityFeed.
// It manages the state for routines, loading status, dark mode, and handles data fetching.
const App: React.FC = () => {
  // State variables for managing the routine feed data and UI status
  const [activities, setActivities] = useState<WorkoutActivity[]>([]); // Stores the list of routines
  const [loadingFeed, setLoadingFeed] = useState(false); // Indicates if data is currently being fetched
  const [hasMoreFeed, setHasMoreFeed] = useState(true); // Indicates if there's more data to load
  const [isDarkMode, setIsDarkMode] = useState(false); // Controls the dark mode theme

  // Ref to the routine feed's scrollable container, used for infinite scrolling logic.
  const feedScrollContainerRef = useRef<HTMLDivElement>(null);
  // Ref to keep track of the current page number for API pagination.
  const currentPage = useRef(0);

  // --- Start: Mock Axios Instance ---
  // This is a simulated Axios instance for demonstration purposes.
  // In a real application, you would install and import Axios directly: `import axios from 'axios';`


  // --- Start: apiClient object using Mock Axios ---
  // Async function to fetch more routine data.
  // This function is responsible for making API calls and updating component state.
  const fetchMoreActivities = async () => {
    // Prevent fetching if already loading or if there are no more routines to fetch.
    if (loadingFeed || !hasMoreFeed) return;

    setLoadingFeed(true); // Set loading state to true to show a loading indicator
    try {
      const itemsPerRequest = 5; // Define how many routines to fetch per API call
      // Calculate the offset for the next page of routines.
      const response = await apiClient.fetchActivities(currentPage.current * itemsPerRequest, itemsPerRequest);

      // Append new routines to the existing list.
      setActivities(prevActivities => [...prevActivities, ...response.activities]);
      // Update the `hasMoreFeed` state based on the API response.
      setHasMoreFeed(response.hasMore);
      // Increment the current page number for the next fetch.
      currentPage.current += 1;
    } catch (error) {
      // Log any errors that occur during fetching.
      console.error("Error fetching routines:", error);
      // In a real application, you might display an error message to the user here.
    } finally {
      // Reset loading state to false regardless of success or failure.
      setLoadingFeed(false);
    }
  };

  // useEffect hook to perform initial data load when the component mounts.
  // The empty dependency array ensures this effect runs only once.
  useEffect(() => {
    fetchMoreActivities(); // Initiate the first fetch of routines.
  }, []);

  // useEffect hook to implement infinite scrolling logic.
  // This effect adds and removes a scroll event listener to the feed container.
  useEffect(() => {
    const container = feedScrollContainerRef.current;
    if (!container) return; // Exit if the container ref is not yet available

    // Scroll event handler function.
    const handleScroll = () => {
      // Check if the user has scrolled to the bottom of the container.
      // A small threshold (+1) is added to account for potential sub-pixel rendering differences.
      if (
        container.scrollHeight - container.scrollTop <= container.clientHeight + 1 &&
        hasMoreFeed && // Only fetch if there are more routines
        !loadingFeed   // Only fetch if not already loading
      ) {
        fetchMoreActivities(); // Trigger fetching more routines
      }
    };

    // Add the scroll event listener when the component mounts or dependencies change.
    container.addEventListener('scroll', handleScroll);
    // Cleanup function: remove the event listener when the component unmounts
    // or before the effect runs again (if dependencies change).
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMoreFeed, loadingFeed]); // Dependencies: Re-run effect if these states change.

  return (
    // Main application container with flexible centering and padding.
    // Applies overall dark/light mode background.
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans ${isDarkMode ? 'bg-gray-900' : 'bg-gray-200'} transition-colors duration-300`}>
      {/* Tailwind CSS CDN: This script enables Tailwind CSS styling. */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Central content wrapper, responsive and themed. */}
      <div className={`w-full max-w-lg mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-6`}>
        {/* Main title of the user profile page */}
        <h1 className={`text-4xl font-extrabold mb-8 text-center ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
          User Profile
        </h1>

        {/* Dark Mode Toggle Switch */}
        <div className="flex justify-center mb-6">
          <label htmlFor="darkModeToggle" className="flex items-center cursor-pointer">
            <span className={`mr-3 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dark Mode</span>
            <div className="relative">
              {/* Hidden checkbox for accessibility and state management */}
              <input
                type="checkbox"
                id="darkModeToggle"
                className="sr-only" // Screen reader only
                checked={isDarkMode} // Controls the checked state of the toggle
                onChange={() => setIsDarkMode(!isDarkMode)} // Toggles dark mode on click
              />
              {/* Visual track of the toggle switch */}
              <div className={`block w-14 h-8 rounded-full ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              {/* Movable circle (dot) within the toggle switch */}
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${isDarkMode ? 'translate-x-full bg-yellow-300' : ''}`}></div>
            </div>
          </label>
        </div>

        {/* Render the ActivityFeed Component, passing all necessary props */}
        <ActivityFeed
          activities={activities}
          loadingFeed={loadingFeed}
          hasMoreFeed={hasMoreFeed}
          feedScrollContainerRef={feedScrollContainerRef}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default App;
