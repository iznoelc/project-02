import FavoriteJobProvider from "../contexts/FavoriteJobProvider";
import JobFinder from "./JobFinder";

export default function JobFinderPage() {
  return (
    <FavoriteJobProvider>
      <JobFinder />
    </FavoriteJobProvider>
  );
}
