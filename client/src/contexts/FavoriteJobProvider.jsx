/** FavoriteMovieProvider.jsx
 * provides all the functionality to keep track of favorite movies in the website
 */

import useAuth from "../hooks/useAuth";
import { FavoriteJobContext } from "./FavoriteJobContext";
import { normalizeId } from "../utils/NormalizeJobId";
import { errorNotify, successNotify } from "../utils/ToastifyNotifications";


// set up what the context will do. for favorite movies, it creates functions to add to favorites, remove from favorites, and the favorites list
// make sure it takes children as a prop, because this allows all components wrapped in this component access to the context.
export default function FavoriteJobProvider({children}) {
  const { user, favJobs, setFavJobs } = useAuth();

    /* add a movie to the favorites list, but dont add it if its already in the list. if its already in the list, give an alert */
    const addToFav = async (jobTitle, jobId) => {
          try {
              const cleanFavJobs = favJobs.map(normalizeId);
              const updatedFavJobs = [...cleanFavJobs, jobId];

              const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.uid}`, {
              method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await user.getIdToken()}`,
                  },
                  body: JSON.stringify({
                    fav_jobs: updatedFavJobs,
                  }),
              });
      
              if (!res.ok){
                  throw new Error(`HTTP error! status: ${res.status}`);
              }

              setFavJobs(updatedFavJobs);
              successNotify("Successfully added " + jobTitle + " to favorites job list!");
          } catch{
              errorNotify("Error adding " + jobTitle + " to favorites job list, try again.");
          }
    };
  
    /* remove a job from the favorites list. It takes in a job object as an argument and updates the favMovies state by filtering out the movie with the matching title. */
    const removeFromFav = async (jobTitle, jobId) => {
      try {
        const cleanFavJobs = favJobs.map(normalizeId);
        const updatedFavJobs = cleanFavJobs.filter(
            job => job !== jobId
        );

        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.uid}`, {
        method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
            body: JSON.stringify({
              fav_jobs: updatedFavJobs,
            }),
        });

        if (!res.ok){
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        setFavJobs(updatedFavJobs);
        successNotify("Successfully removed " + jobTitle + " from favorites job list!");
    } catch{
        errorNotify("Error removing " + jobTitle + " to favorites job list, try again.");
    }
    };

  return (
    // provide the context value to the children components
    <FavoriteJobContext.Provider value={{ addToFav, removeFromFav }}>
      {children}
    </FavoriteJobContext.Provider>
  );
}