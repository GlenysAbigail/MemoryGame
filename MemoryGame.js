/*Following is the JavaScript code for the Memory Game for Practical 1 */

/*
The startTimer() function is used to create <img> elements and start the timer (countdown)
*/
const startTimer = () => {
	getImages(allURLs);
	setTimer();
}

/*
The stopTimer() function is used to reset timer and display message using alert()
*/
const stopTimer = () => {
	clearInterval(interval);
	document.getElementById('timer').innerHTML = "0 minutes 0 seconds";
	alert ("Click Clear Screen and Start Timer to play again.");
}

/*
The clearScreen() function is used to clear screen and restart game
*/
const clearScreen = () => {
	allURLs = [];
	matchedImages = []; //emptying the array that stores previously fetched URLs
	useFetch();
	clearInterval(interval);
	//clearing the screen using class name and innerHTML
	var divIDs = document.getElementsByClassName("main-grid");
	for (i = 0; i < divIDs.length; i++){
		divIDs[i].innerHTML = " ";
	}
	//console.log(divIDs);			
	getImages(allURLs);
}

		
/*
The setTimer() function starts a countdown timer when it is called
It uses the setInterval() to update the timer every second
When time runs out it stops the timer using clearInterval()
*/
const setTimer = () => { 
	let seconds;
	let minutes;
	//based on the level selected the seconds and minutes variable is set with a different value
	if (document.getElementById('easy').checked){
		seconds = 45;
		minutes = 0;
	}

	else if (document.getElementById('normal').checked) {
		seconds = 0;
		minutes = 1;
	}
	else if (document.getElementById('hard').checked) {
		seconds = 30;
		minutes = 1;
	}
	else {
		document.getElementById('normal').checked = true;
		seconds = 0;
		minutes = 1;
	}
	//interval is declared as a global variable to be accessed from anywhere in the code to reset timer
	//the setInterval() runs every second till 0 seconds and 0 minutes condition is met
	window.interval = setInterval(function(){
		document.getElementById('timer').innerHTML = `${minutes} minute ${seconds} seconds`;
		if (seconds != 0) {
			seconds --;
		}
		else if (seconds === 0 && minutes >= 1) {
			minutes --;
			seconds = 60;
		}
		else {
			//console.log ("Time's up! Start Again.");
			alert ("Time's up! Restart Game.");
			clearInterval(interval);
		}
	}, 1000);
			
}

/*
The useFetch() function is used to fetch the images from the dog API
The level of difficulty chosen on the HTML page using checkboxes, determines
the number of dog images to fetch from the API

Once the images are retrieved the method to seperate the URLs of the images is called
*/
const useFetch = () => {
	//value of numberOfDogs depending on level selected
	if (document.getElementById('easy').checked){
		numberOfDogs = 4;
	}
	else if (document.getElementById('normal').checked) {
		numberOfDogs = 6;
	}
	else if (document.getElementById('hard').checked) {
		numberOfDogs = 9;
	}
	else {
		document.getElementById('normal').checked = true;
		numberOfDogs = 6;
	}
	
	//retrieve from API
	let fetchURL =`https://api.thedogapi.com/v1/images/search?limit=${numberOfDogs}&mime_types=jpg`;
	fetch(fetchURL)
  	.then(response => response.json())
  	//.then(data => console.log(data))
  	.then(collectURLs)
  	.catch(function(error) {
	console.log(error);
	});
}

let allURLs = []; //the variable where the URLs of the images are stored

/*
The collectURLs() function is used to separate the URLs of the dog images from the other
information in the JSON object

A for loop is used to loop through the list of JSON objects retrieved
*/
const collectURLs = imgObject => {
	for(i=0; i<numberOfDogs; i++){
			var jsObject = imgObject[i].url;
  			console.log(jsObject);
			allURLs.push(jsObject);
			//console.log(allURLs);				
	}
}

/*
The shuffle() function is declared to shuffle the URLs when they are to be displayed

The code for randomising the array elements was taken from the following link:
https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

Variable names and array structure have been adapted to suit this solution.
*/
const shuffle = allURLs => {
    for (let i = allURLs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allURLs[i], allURLs[j]] = [allURLs[j], allURLs[i]];
    }
}

/*
The getImages() function is used to create a div element
Inside the div element, <img> tags are created with the URLs stored in the variable 'allURLs'

Two loops are used to display the images twice, before the images are displayed
for the second time, the shuffle() function is called to mix the order of the images displayed
*/
const getImages = arr => {
	var gridview = document.createElement('div'); //creating <div> element
  	gridview.className = "main-grid";

  	//depending on level selected the ID of <div> element is set
  	if (numberOfDogs === 4) {
  		gridview.id="newgrideasy";
  	}
  	else if (numberOfDogs === 9){
  		gridview.id="newgridhard"
  	}
  	else {
  		gridview.id="newgrid"
  	}

  	//adding the element to the DOM
    document.body.appendChild(gridview);
    for (j=0; j<2; j++) {
    	for (i=0; i<arr.length; i++) {

    		//creating <img> elements for dog images and dog emoji image
    		var section = document.createElement('div');
  			section.className = "hide-img";
    		gridview.appendChild(section);
    		section.innerHTML +=
    			`<img src=${arr[i]} height = 100 width = 100 alt="image not found" class = back-card />
    			<img src="dogpic.png" id = ${arr[i]} class="front-card" height = 100 width = 100 alt = "img not found" onclick = "changeImage(this)" />`;
    		//if else condition to attatch IDs to the elements
    		if(j==1) {
    			section.id = i + "copy";
    		}
    		else {
    			section.id = i;
    		}
		}
		//calling the shuffle() function before creating the second round of <img> elements
		shuffle(arr);
	}
}


let clickCounter = 0; //keeps track of number of clicks
let firstImage, secondImage; //used to store the clicked (i.e. opened) images
let openImages = []; //this array contains two elements at a time (the opened images)
let matchedImages = []; //this array is used to store the matched pairs of cards
let highScores = []; //this array stores the scores of the user

/*
The changeImage() function is used to flip the image and 
call the function that compares the two images
*/
const changeImage = clickedImage => {
	//console.log(clickedImage.className);
  	clickedImage.className += "open"; //updating class name to change CSS properties
  	openImages.push(clickedImage); //adding clicked image to the array containing opened images

  	//if condition to check if two images are open, and calling the compareImage() function if satisfied
  	if(openImages.length === 2) {
  		compareImages(openImages[0],openImages[1]);
  		document.getElementById("clicks").innerHTML = `<h4>Number of Clicks: ${clickCounter}</h4>`;
  		clickCounter ++;
  		//console.log(clickCounter);
  	}
}

/*
The compareImages() function is used to compare and check if 
the two images are the same by using the id of each image

The ID of each image is the image URL 

If the images match it calls matchFound()
Else it calls closeCards()
*/
const compareImages = (img1, img2) => {
  	if(img1.id === img2.id){
  		matchFound(img1,img2);
  		return;
  	}
	else {
  		closeCards(img1, img2); //calling the function that flips the images back to its previous state
  	}
}

/*
The matchFound() function is used to push the images that match into 
an array that stores all the matched pairs
*/
const matchFound = (img1,img2) => {
  	console.log("match found");
  	matchedImages.push(img1);
  	matchedImages.push(img2);
	openImages = []; //clearing array with opened images for next pair

	//checking the winning condition
	if((matchedImages.length)%(numberOfDogs*2) === 0) {
		//console.log("Winner");
		alert("You won!");
		highScores.push(clickCounter--); //adding the final click count to calculate best score in next step
		document.getElementById("result").innerHTML = `<h4> High Score: ${Math.min.apply(Math, highScores)}</h4>`;
		clickCounter = 0;
		clearInterval(interval);
	}
}

/*
The closeCards() function is called when the images don't match and
have to be flipped again
*/
const closeCards = (img1,img2) => {
  	setTimeout(() => {
  		img1.className = "front-card";
      	img2.className = "front-card"; }, 500);
  	openImages = []; //emptying array to allow used to open the next pair of images
	//console.log("no match");
}
