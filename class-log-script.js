// selects CS as subject area
document.getElementById("subjAreaMultiSelectOption57").checked = true;

// sends search request
document.getElementById("advancedSearchClassesSubmit-button").click();

// checks if there are any results yet, waits until it's loaded
while (document.getElementById("searchClassSectionsResults").innerHTML === "") {
	window.setTimeout({}, 1000); // waits a second until it's loaded again
}
