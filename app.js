// Draggable functionality
const itemListResults = document.querySelector("#book-list-results");
const form = document.querySelector("#book-form");
const search = document.querySelector("#header-search");
const sort = Sortable.create(itemListResults, {
  ghostClass: "blue-background-class",
  animation: 150,
  onEnd,
});

form.addEventListener("submit", saveItem);
search.addEventListener("keyup", searchItems);
itemListResults.addEventListener("click", event => {
  removeItem(event);
  checkDoneItem(event);
});

function onEnd() {
  const htmlItems = [
    ...document
      .getElementById("book-list-results")
      .getElementsByClassName("book-item"),
  ];

  const orderedItems = htmlItems.map(htmlItem => {
    return {
      name: htmlItem.textContent,
      done: htmlItem.className.includes("done"),
    };
  });

  localStorage.setItem("itemList", JSON.stringify(orderedItems));
}

// Save items into localStorage
function saveItem(event) {
  try {
    // Stops "submit" button default behaviour
    event.preventDefault();

    let itemName = document.getElementById("input").value;
    let done = false;

    validateInput(itemName);

    const newItem = {
      name: itemName,
      done: done,
    };

    const itemList = JSON.parse(localStorage.getItem("itemList")) || [];
    itemList.push(newItem);

    localStorage.setItem("itemList", JSON.stringify(itemList));
    document.querySelector("#book-form").reset();

    fetchListItems();
  } catch (error) {
    alert(error.message);
  }
}

function validateInput(itemName) {
  if (itemName === "") throw new Error("Please add an item");

  if (itemExists(itemName))
    throw new Error("Duplicate item, please chose other name");
}

function itemExists(item) {
  let itemList = getItems();
  return itemList.find(elem => elem.name.toLowerCase() === item.toLowerCase());
}

function fetchListItems() {
  let itemList = getItems();
  let itemListResults = document.getElementById("book-list-results");

  itemListResults.innerHTML = "";

  itemList.map(item => {
    // Create new li element
    let li = document.createElement("li");

    // Add class
    li.className = item.done ? "book-item done" : "book-item";

    // Add paragraph with text
    var paragraph = document.createElement("p");
    var text = document.createTextNode(item.name);
    paragraph.appendChild(text);
    li.appendChild(paragraph);

    // Create del button element
    let deleteBtn = document.createElement("button");

    // Add classes to del button
    deleteBtn.className = "fas fa-trash btn-delete";

    // Append button to li
    li.appendChild(deleteBtn);

    // Append li to list
    itemListResults.appendChild(li);
  });
}

function getItems() {
  return JSON.parse(localStorage.getItem("itemList")) || [];
}

function setItems(itemList) {
  localStorage.setItem("itemList", JSON.stringify(itemList));
}

const removeItem = event => {
  if (compareDelBtn(event)) {
    let itemList = getItems();
    let itemName = event.target.previousSibling.textContent;
    console.log(event.target.previousSibling.textContent);

    // Loop through the list items
    if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
      itemList.filter((item, index) => {
        if (item.name === itemName) {
          // Remove item from array
          itemList.splice(index, 1);
        }
      });

      // Re-set back to localStorage
      setItems(itemList);
      // Re-fetch list items
      fetchListItems();
    }
  }
};

const checkDoneItem = event => {
  if (compareDelBtn(event) === false) {
    let itemName = event.target.textContent;
    let itemList = getItems();

    itemList.filter(item => {
      if (item.name === itemName) {
        item.done = !item.done;
      }
    });

    setItems(itemList);
    fetchListItems();
  }
};

// Sees if element has "delete"
function compareDelBtn(event) {
  return event.target.classList.contains("btn-delete");
}

function searchItems(event) {
  // Convert text to lowercase
  let text = event.target.value.toLowerCase();
  // Get list items
  let items = document.querySelectorAll("li");

  // Convert NodeList to array
  Array.from(items).map(item => {
    let itemName = item.textContent;
    // Compares input to list items
    item.style.display =
      itemName.toLowerCase().indexOf(text) !== -1 ? "grid" : "none";
  });
}

// Retain localStorage list on HTML even after refresh
window.onload = fetchListItems();
