function Search(data, searchQuery, searchType){
    // if data, searchQuery, or searchType are null or undefined, return the original data list (or an empty list if data is null)
    if (!data) [];

    // set what user is searching for to a string and to lowercase for easier searching
    const value = searchQuery?.toString().toLowerCase().trim();

    if (!value) return data;

    // return list of filtered data based on search query and search type
    // change to lowercase and to string (for the year) to avoid simple grammar msistakes resulting in no results
        return data.filter(item => {
            const field = item?.[searchType];

            if (!field) return false;

            return field
            .toString()
            .toLowerCase()
            .includes(value);

            // switch (searchType) {
            // case "job_title":
            //     return item.job_title.toString().toLowerCase().includes(value);

            // case "location":
            //     return item.location.toString().toLowerCase().includes(value);
                
            // case "category":
            //     return item.category.toString().toLowerCase().includes(value);

            // default:
            //     return true;
            // }
        });
}

export default Search;