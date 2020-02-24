// Draggable functionality
var itemListResults = document.querySelector('#itemListResults'); 
var form = document.querySelector("#addForm");
var filter = document.querySelector("#filter");
var sort = Sortable.create(itemListResults, {
	handle: '.my-handle', 
	animation: 150
});

form.addEventListener("submit", saveItem);
filter.addEventListener("keyup", searchItems);
itemListResults.addEventListener("click", (event)=> {
    removeItem(event);
    checkDoneItem(event);
});


// Save items into localStorage
function saveItem(event) {
	// Stops "submit" button default behaviour
	event.preventDefault();	

	let itemName = document.getElementById('input').value;
	let done = false;

	if(!validateInput(itemName)){
		return false;
	}

	let newItem = {
		'name': itemName,
		'done': done
	}

	if(localStorage.getItem('itemList') === null){
		let itemList = [];
		itemList.push(newItem);
		localStorage.setItem('itemList', JSON.stringify(itemList));

	} else {
		let itemList = JSON.parse(localStorage.getItem('itemList'));
		itemList.push(newItem);
		localStorage.setItem('itemList', JSON.stringify(itemList));
	}

	document.querySelector('#addForm').reset();
	fetchListItems();		
}

function validateInput(itemName){
	if(!itemName){
		alert('Please add an item');
		return false;
	} else {		
		let itemList = getItems();
		for(i = 0; i < itemList.length; i++){
			if(itemName === itemList[i].name){
				alert('Duplicate item, please chose other name');
				return false;
			}		
		}		
	}
	return true;
}

function fetchListItems(){

	let itemList = getItems();

	let itemListResults = document.getElementById('itemListResults');

	itemListResults.innerHTML = '';

	for(i = 0; i < itemList.length; i++){
		// Create new li element
		let li = document.createElement("li");
	
		// Add class
		if (itemList[i].done === true){
			li.className = "list-group-item done";
		} else {
			li.className = "list-group-item";
		}		

		// Create new span element
		let span = document.createElement("span");
		span.className = "my-handle fas fa-arrows-alt";
		li.appendChild(span);

		// Add text node with input value
		li.appendChild(document.createTextNode(itemList[i].name));

		// Create del button element
		let deleteBtn = document.createElement("button");

		// Add classes to del button
		deleteBtn.className = "fas fa-trash-alt btn btn-danger btn-sm float-right delete";
		
		// Append button to li
		li.appendChild(deleteBtn);

		// Append li to list
		itemListResults.appendChild(li);
	}		
}

function getItems(){
	if (JSON.parse(localStorage.getItem('itemList') !== null)){
		return JSON.parse(localStorage.getItem('itemList'));
	} else {
		return [];
	}
}

function setItems(itemList){
	localStorage.setItem('itemList', JSON.stringify(itemList));
}

const removeItem = (event)=> {
	if(compareDelBtn(event) === true){		

		let itemList = getItems();
		let itemName = event.target.previousSibling.textContent;

		// Loop through the list items
		if(confirm(`Are you sure you want to delete "${itemName}"?`)){

			for(var i =0;i < itemList.length;i++){
				if(itemList[i].name === itemName){
					// Remove from array
					itemList.splice(i, 1);
				}
			} 
		} else {
			return false;
		}

		// Re-set back to localStorage
		setItems(itemList);		
		// Re-fetch list items
		fetchListItems();
	}
}

const checkDoneItem = (event)=> {
	if(compareDelBtn(event) === false){
		let item = event.target;
		item.classList.toggle("done");

		let itemList = getItems();
		let itemName = event.target.textContent;

		for(let i =0;i < itemList.length;i++){
			if(itemList[i].name === itemName){
				if (itemList[i].done === false){
					itemList[i].done = true;
				} else {
					itemList[i].done = false;
				}
			}
		}

		setItems(itemList);
		fetchListItems();
	}
}
// Sees if element has "delete"
function compareDelBtn(event){
	return event.target.classList.contains("delete") ? true : false;
}

function searchItems(event){
	// Convert text to lowercase
	let text = event.target.value.toLowerCase();
	// Get list items
	let items = document.querySelectorAll("li");

	// Convert NodeList to array
	Array.from(items).forEach(function(item){			
		let itemName = item.textContent;
		// Compares input to list items
		if(itemName.toLowerCase().indexOf(text) != -1){
			item.style.display = "block";
		} 
		else {
			item.style.display = "none";
		}
	});
}

// Retain localStorage list on HTML even after refresh
window.onload = fetchListItems();