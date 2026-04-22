/** FavoriteMovieProvider.jsx
 * provides all the functionality to keep track of favorite movies in the website
 */

import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { FavoriteJobContext } from "./FavoriteJobContext";
import { normalizeId } from "../utils/NormalizeJobId";


// set up what the context will do. for favorite movies, it creates functions to add to favorites, remove from favorites, and the favorites list
// make sure it takes children as a prop, because this allows all components wrapped in this component access to the context.
export default function FavoriteJobProvider({children}) {
  const { user, favJobs, setFavJobs } = useAuth();

    /* add a movie to the favorites list, but dont add it if its already in the list. if its already in the list, give an alert */
    const addToFav = async (jobId) => {
          try {
              const cleanFavJobs = favJobs.map(normalizeId);
              const updatedFavJobs = [...cleanFavJobs, jobId];

              const res = await fetch(`http://localhost:3000/users/${user.uid}`, {
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
      
          } catch{
              console.log("Error adding job to favJobs");
          }
    };
  
    /* remove a job from the favorites list. It takes in a job object as an argument and updates the favMovies state by filtering out the movie with the matching title. */
    const removeFromFav = (job) => {
      console.log("removing job from favorite", job);
    };

  return (
    // provide the context value to the children components
    <FavoriteJobContext.Provider value={{ addToFav, removeFromFav }}>
      {children}
    </FavoriteJobContext.Provider>
  );
}