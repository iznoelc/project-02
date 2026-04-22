/** FavoriteMovieProvider.jsx
 * provides all the functionality to keep track of favorite movies in the website
 */

import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { FavoriteJobContext } from "./FavoriteJobContext";


// set up what the context will do. for favorite movies, it creates functions to add to favorites, remove from favorites, and the favorites list
// make sure it takes children as a prop, because this allows all components wrapped in this component access to the context.
export default function FavoriteJobProvider({children}) {
  const { user, favJobs } = useAuth();

    /* add a movie to the favorites list, but dont add it if its already in the list. if its already in the list, give an alert */
    const addToFav = (job) => {
      console.log("adding job to favorites", job);
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