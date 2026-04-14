/** FavoriteMovieProvider.jsx
 * provides all the functionality to keep track of favorite movies in the website
 */

import React, { useState } from "react";
import { FavoriteJobContext } from "./FavoriteJobContext";


// set up what the context will do. for favorite movies, it creates functions to add to favorites, remove from favorites, and the favorites list
// make sure it takes children as a prop, because this allows all components wrapped in this component access to the context.
export default function FavoriteJobProvider({children}) {
  const [favorites, setFavMovies] = useState([]);
    /* add a movie to the favorites list, but dont add it if its already in the list. if its already in the list, give an alert */
    const addToFav = (job) => {
      setFavMovies(currentItems => {
          const existingItem = currentItems.find(item => item.job_title === job.job_title);
            
          if (!existingItem) {
            return [...currentItems, job]
          } else {
            alert("Job is already in favorites!");
            return currentItems;
          }
      });
    };
  
    /* remove a job from the favorites list. It takes in a job object as an argument and updates the favMovies state by filtering out the movie with the matching title. */
    const removeFromFav = (job) => {
      setFavMovies(currentItems => {
          const existingItem = currentItems.find(item => item.job_title === job.job_title);
  
          if (existingItem) {
            return currentItems.filter(item => item.job_title !== job.job_title);
          } else {
            return currentItems;
          }
        });
    };

  return (
    // provide the context value to the children components
    <FavoriteJobContext.Provider value={{ favorites, addToFav, removeFromFav }}>
      {children}
    </FavoriteJobContext.Provider>
  );
}