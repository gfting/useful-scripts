// sleep function for async execution
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// through advanced menu, searches for just CS courses
function searchCS() {
	// selects CS as subject area
	document.getElementById("subjAreaMultiSelectOption57").checked = true;

	// sends search request
	document.getElementById("advancedSearchClassesSubmit-button").click();
}

// creates a JSON object to hold on to the class data for us
let classesObj = {};

function loadClasses() {
	// gets all classes on the page
	let classes = document.getElementsByClassName("classTable");

	// iterates through all of the classes we see on the page
	for (let i = 0; i < classes.length; ++i) {
		// create a new object linked to the class name
		let classObj = {};

		let classInfo = classes[i];

		// gets the class number
		classObj["classNumber"] = classInfo
			.getElementsByClassName("classAbbreviation")[0]
			.innerText.trim();

		let className = classInfo
			.getElementsByClassName("classDescription")[0]
			.innerText.trim();

		// gets the class name
		classObj["className"] = className;

		// get all class listings; each of these are rows
		let classListings = classInfo.getElementsByClassName("classRow");

		console.log(classObj);

		// iterate through each class listing
		for (let j = 0; j < classListings.length; ++j) {
			let listingObj = {};
			// add the time
			listingObj["days"] = classListings[j]
				.getElementsByClassName("classMeetingDays")[0]
				.innerText.trim();
			listingObj["time"] = classListings[j]
				.getElementsByClassName("classMeetingTimes")[0]
				.innerText.trim();

			// add the location
			listingObj["location"] = classListings[j]
				.getElementsByClassName("classBuilding")[0]
				.innerText.trim();

			// add each professor's name
			listingObj["instructor"] = classListings[j]
				.getElementsByClassName("classInstructor")[0]
				.innerText.trim();
			// pushes on the section with this listing
			classObj[`section${j}`] = listingObj;
		}

		// ends by pushing on the classObj
		classesObj[className] = classObj;
	}

	console.log(classesObj);

	// go to the next page
	// must find the second page of the paginator results
	document.getElementById("paginator");
	// first iteration should get the 4th child, or the a link to the next page; afterwards, should get the 6th child
}

async function driver() {
	// opens adv search list
	document.getElementById("advancedSearchLink").click();
	await sleep(2000);
	searchCS();

	// checks if there are any results yet, waits until it's loaded

	while (
		document.getElementById("searchClassSectionsResults")
			.childElementCount === 1
	) {
		console.log("loading");
		await sleep(1000); // waits a second until it's loaded again
	}

	// loads the classes after
	loadClasses();
}

driver();
