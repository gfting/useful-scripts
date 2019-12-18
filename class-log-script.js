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
		// get the class name
		let classInfo = classes[i];

		let className = classInfo
			.getElementsByClassName("classDescription")[0]
			.innerText.trim();

		let classNumber = classInfo
			.getElementsByClassName("classAbbreviation")[0]
			.innerText.trim();

		// create a new object linked to the class name, or gets the old information from it
		let classObj =
			classesObj[className] === undefined ? {} : classesObj[className];

		// get and set the class number
		classObj["classNumber"] = classNumber;

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
}

// function to load the next page
function advancePage() {
	// go to the next page
	// must find the second page of the paginator results
	let paginator = document.getElementById("paginator");
	let paginatorChildren = paginator.childNodes;
	// first iteration should get the 4th child, or the a link to the next page; afterwards, should get the 6th child
	let links = paginator.getElementsByTagName("a");

	let directSpans = document.querySelectorAll("#paginator > span");
	// // counts direct children
	// let numSpans = paginator.children.reduce((acc, child) => {
	// 	return child.tagName === "SPAN" ? acc + 1 : acc;
	// }, 0);

	console.log(paginatorChildren);
	// if there's just one span, then we are at an middle page
	if (directSpans.length === 1) {
		// advances to the next page
		links[5].click();
		return true;
	} else {
		if (paginatorChildren[0].tagName === "SPAN") {
			links[0].click();
			return true;
		} else if (paginatorChildren[0].tagName === "A") {
			// multiple spans and we're at the last page
			return false;
		}
	}

	return false;
	// if the first element is an a element, and we have multiple spans, then we're at the last element. if we have just one span and mutliple links, then we want to click the a link after the span. if we start off with a span and have multiple spans, then we want
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

	// loads the classes for this page
	loadClasses();
	// advances the page
	while (advancePage()) {
		// waits for it to load
		console.log("attempting to advance");
		while (
			document.getElementById("searchClassSectionsResults")
				.childElementCount === 1
		) {
			console.log("advance sleep");
			await sleep(1000);
		}
		loadClasses();
		await sleep(1000);
	}

	console.log("Complete!");
	console.log(JSON.stringify(classesObj));
	convertJSON(classesObj);
}

async function loadEmails() {
	window.location =
		"https://engineering.vanderbilt.edu/eecs/faculty-staff/index.php";
	while (!document.readyState === "complete") {
		await sleep(250);
	}
	let searchBar = document.getElementById("peoplelisting_filter").children[0]
		.children[0];
	let peopleTable = document.getElementById("peoplelisting");
	Object.keys(classesObj).forEach(key => {
		// gets the instructor's last name
		let lastName = classesObj[key].instructor.split(",")[0];
		searchBar.value = lastName;
	});
}

// converts JSON in to CSV file
function convertJSON(data) {
	let csv = "CS Course Lisings\r\n\n";
	csv +=
		"Course Name,Course Number,Days,Time,Location,Instructor,Instructor Email";

	// iterate through the list
	Object.keys(data).forEach(key => {
		let obj = data[key];
		let numSections = Object.keys(obj).length - 2;
		csv += `${obj.className},${obj.classNumber},,,,,\n`;
		for (let i = 0; i < numSections; ++i) {
			let sectionInfo = obj[`section${i}`];
			console.log(sectionInfo);
			csv += `${obj.className},${obj.classNumber},${sectionInfo.days},${sectionInfo.time},${sectionInfo.location},"${sectionInfo.instructor}",\n`;
		}
	});
	// download it
	let hiddenElement = document.createElement("a");
	hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
	hiddenElement.target = "_blank";
	hiddenElement.download = "csCourseListings.csv";
	hiddenElement.click();
}
driver();
