function Search(data, searchQuery, searchType){
    // if data, searchQuery, or searchType are null or undefined, return the original data list (or an empty list if data is null)
    if (!data || !searchQuery || !searchType) return data || [];

    // set what user is searching for to a string and to lowercase for easier searching
    const value = searchQuery.toString().toLowerCase();

    // return list of filtered data based on search query and search type
    // change to lowercase and to string (for the year) to avoid simple grammar msistakes resulting in no results
        return data.filter(item => {
            switch (searchType) {
            case "genre":
                return item.genre.toLowerCase().includes(value);

            case "age_group":
                return item.age_group.toLowerCase().includes(value);

            case "releasing_year":
                return item.releasing_year.toString().toLowerCase().includes(value);

            case "job_title":
                return item.job_title.toString().toLowerCase().includes(value);

            case "location":
                return item.location.toString().toLowerCase().includes(value);

            case "salary":
                return item.salary_range.toString().toLowerCase().includes(value);
                
            case "category":
                return item.category.toString().toLowerCase().includes(value);

            default:
                return true;
            }
        });
}

export default Search;