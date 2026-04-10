/* Data Sorting Function
    Input 1: Type : String - Catagory, Location, Salary
    Input 2: Type : Bool - True = Ascending, False = Descending
    Input 3: Type : DataArray
*/
function DataSorter (Type, Ascending, DataArray){
    let returnArray = [...DataArray];

    switch (Type){
        case "Date":{
            returnArray = sortDate(Ascending, returnArray);
            break;
        };
        case "Title":{
            returnArray = sortTitle(Ascending, returnArray);
            break;
        };
        case "Rating":{
            returnArray = sortRating(Ascending, returnArray);
            break;
        };
        case "Category":{
             returnArray = sortCategory(Ascending, returnArray);
            break;
        };
        case "Location":{
             returnArray = sortLocation(Ascending, returnArray);
            break;
        }
        case "Salary":{
             returnArray = sortSalary(Ascending, returnArray);
            break;
        }
    }

    return returnArray;
}

function sortDate(Ascending, DataArray){
    let returnArray = [...DataArray];

    returnArray.sort((a,b) => {
        let stringA = a.deadline;
        let stringB = b.deadline;
        return stringA.localeCompare(stringB);
    });
    if(!Ascending){
        returnArray.reverse();
    }
    
    return returnArray;
}

function sortTitle(Ascending, DataArray){
    let returnArray = [...DataArray];

    returnArray.sort((a,b) => {
        let stringA = a.title;
        let stringB = b.title;
        return stringA.localeCompare(stringB);
    });
    if(!Ascending){
        returnArray.reverse();
    }
    

    return returnArray;

}

function sortRating(Ascending, DataArray){
    let returnArray = [...DataArray];

    returnArray.sort((a, b) => {
        const diff = a.imdb_rating - b.imdb_rating;
        return Ascending ? diff : -diff;
    });

    return returnArray;

}

function sortSalary(Ascending, DataArray){ // Sorts by the average salary of each job
    let returnArray = [...DataArray];

    returnArray.sort((a, b) => {
        const diff = (a.salary_range[0]+ a.salary_range[1])/2 - (b.salary_range[0]+ b.salary_range[1])/2;
        return Ascending ? diff : -diff;
    });

    return returnArray;
}

function sortLocation(Ascending, DataArray){ // Sorts by the location of each job
    let returnArray = [...DataArray];

    returnArray.sort((a,b) => {
        let stringA = a.location;
        let stringB = b.location;
        return stringA.localeCompare(stringB);
    });
    if(!Ascending){
        returnArray.reverse();
    }

    return returnArray;
}

function sortCategory(Ascending, DataArray){ // Sorts by the location of each job
    let returnArray = [...DataArray];

    returnArray.sort((a,b) => {
        let stringA = a.category;
        let stringB = b.category;
        return stringA.localeCompare(stringB);
    });
    if(!Ascending){
        returnArray.reverse();
    }

    return returnArray;
}

export default DataSorter;