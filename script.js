//initial references
let draggableObjects;
let dropPoints;
const startButton = document.getElementById("start");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".draggable-objects");
const dropContainer = document.querySelector(".drop-points");
const data = [
  "Gen-Z",
  "Millenial",
  "Gen-X",
  "Baby-Boomer",
];


let deviceType = "";
let initialX = 0,
  initialY = 0;
let currentElement = "";
let moveElement = false;

//detect touch device
const isTouchDevice = () => {
  try {
    //create touch event (fail for desktops and throw error)
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

let count = 0;

//random value from array
const randomValueGenerator = () => {
  return data[Math.floor(Math.random() * data.length)];
};


//drag & drop functions
function dragStart(e) {
  if (isTouchDevice()) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
    //start movement for touch
    moveElement = true;
    currentElement = e.target;
  } else {
    //for non touch devices set data to be transfered
    e.dataTransfer.setData("text", e.target.id);
  }
}

//events fired on the drop target
function dragOver(e) {
  e.preventDefault();
}

//for touch screen
const touchMove = (e) => {
  if (moveElement) {
    e.preventDefault();
    let newX = e.touches[0].clientX;
    let newY = e.touches[0].clientY;
    let currentSelectedElement = document.getElementById(e.target.id);
    currentSelectedElement.parentElement.style.top =
      currentSelectedElement.parentElement.offsetTop - (initialY - newY) + "px";
    currentSelectedElement.parentElement.style.left =
      currentSelectedElement.parentElement.offsetLeft -
      (initialX - newX) +
      "px";
    initialX = newX;
    initialY - newY;
  }
};

const drop = (e) => {
  e.preventDefault();
  //for touch screen
  if (isTouchDevice()) {
    moveElement = false;
    //select generation div using the custom attribute
    const currentDrop = document.querySelector(`div[data-id='${e.target.id}']`);
    
    //get boundaries of div
    const currentDropBound = currentDrop.getBoundingClientRect();
    //if the position of quote falls inside the bounds of the generation box
    if (
      initialX >= currentDropBound.left &&
      initialX <= currentDropBound.right &&
      initialY >= currentDropBound.top &&
      initialY <= currentDropBound.bottom
    ) {
      currentDrop.classList.add("dropped");
      //hide actual image
      currentElement.classList.add("hide");
      currentDrop.innerHTML = ``;
      //insert new img element
      currentDrop.insertAdjacentHTML(
        "afterbegin",
        `<img src= "https://jvina2003.github.io/love/${currentElement.id}.png">`
      );
      count += 1;
    }
  } else {
    //access data
    const draggedElementData = e.dataTransfer.getData("text");
    //get custom attribute value
    const droppableElementData = e.target.getAttribute("data-id");
    if (draggedElementData === droppableElementData) {
      const draggedElement = document.getElementById(draggedElementData);
      //dropped class
      e.target.classList.add("dropped");
      //hide current img
      draggedElement.classList.add("hide");
      //draggable set to false
      draggedElement.setAttribute("draggable", "false");
      e.target.innerHTML = ``;
      //insert new img
      e.target.insertAdjacentHTML(
        "afterbegin",
        `<img src="https://jvina2003.github.io/love/${draggedElementData}.png">`
      );
      count += 1;
    }
  }

  //END
  if (count == 4) {
    result.innerText = `Well done! Read more below!`;
    const stopGame = () => {
      controls.classList.remove("hide");
      startButton.classList.remove("hide");
    };
  }
};

//creates img and text
const creator = () => {
  dragContainer.innerHTML = "";
  dropContainer.innerHTML = "";
  let randomData = [];
  //for string random values in array
  for (let i = 1; i <= 4; i++) {
    let randomValue = randomValueGenerator();
    if (!randomData.includes(randomValue)) {
      randomData.push(randomValue);
    } else {
      //if value already exists then decrement i by 1
      i -= 1;
    }
  }
  for (let i of randomData) {
    const quoteDiv = document.createElement("div");
    quoteDiv.classList.add("draggable-image");
    quoteDiv.setAttribute("draggable", true);
    if (isTouchDevice()) {
      quoteDiv.style.position = "absolute";
    }
    quoteDiv.innerHTML = `<img src="https://jvina2003.github.io/love/${i}.png" id="${i}">`;
    dragContainer.appendChild(quoteDiv);
  }
  //sort the array randomly before creating gen divs
  randomData = randomData.sort(() => 0.5 - Math.random());
  for (let i of randomData) {
    const genDiv = document.createElement("div");
    genDiv.innerHTML = `<div class='generations' data-id='${i}'>
    ${i.charAt(0).toUpperCase() + i.slice(1).replace("-", " ")}
    </div>
    `;
    dropContainer.appendChild(genDiv);
  }
};

//start Game
startButton.addEventListener(
  "click",
  (startGame = async () => {
    controls.classList.add("hide");
    startButton.classList.add("hide");
    await creator();
    count = 0;
    dropPoints = document.querySelectorAll(".generations");
    draggableObjects = document.querySelectorAll(".draggable-image");

    //events
    draggableObjects.forEach((element) => {
      element.addEventListener("dragstart", dragStart);
      //for touch screen
      element.addEventListener("touchstart", dragStart);
      element.addEventListener("touchend", drop);
      element.addEventListener("touchmove", touchMove);
    });
    dropPoints.forEach((element) => {
      element.addEventListener("dragover", dragOver);
      element.addEventListener("drop", drop);
    });
  })
);


//art page color change
function bodyPaint() {
	window.addEventListener("scroll", function () {
		const scrollTop =
			window.pageYOffset ||
			document.documentElement.scrollTop ||
			document.body.scrollTop ||
			0;

		const triggers = document.querySelectorAll("[data-color]");

		const body = document.body;
		
		const scroll = scrollTop + window.innerHeight / 3;

		for (var i = 0; i < triggers.length; i++) {
			const trigger = triggers[i];
			const triggerRect = trigger.getBoundingClientRect();
			const triggerRectTop = triggerRect.top + scrollTop;
			const triggerHeight = trigger.offsetHeight;
			const triggerColor = trigger.getAttribute("data-color");

			// if position is within range of this panel.
			// So position of (position of top of div <= scroll position) && (position of bottom of div > scroll position).
			if (triggerRectTop <= scroll && triggerRectTop + triggerHeight > scroll) {
				body.setAttribute("data-paint", triggerColor);
				console.log(body.dataset.paint);
			}
		}
	});
}

bodyPaint();




