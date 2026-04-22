export const normalizeId = (job) =>
    typeof job === "string"
        ? job
        : job._id; 