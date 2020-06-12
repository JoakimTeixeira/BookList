// Draggable functionality
const itemListResults = document.querySelector("#itemListResults");
const form = document.querySelector("#addForm");
const filter = document.querySelector("#filter");
const sort = Sortable.create(itemListResults, {
  handle: ".my-handle",
  animation: 150,
  onEnd,
});

form.addEventListener("submit", saveItem);
filter.addEventListener("keyup", searchItems);
itemListResults.addEventListener("click", event => {
  removeItem(event);
  checkDoneItem(event);
});

function onEnd() {
  const HTMLitems = [
    ...document
      .getElementById("itemListResults")
      .getElementsByClassName("list-group-item"),
  ];
  const orderedItems = HTMLitems.map(HTMLitem => {
    return {
      name: HTMLitem.textContent,
      done: HTMLitem.className.includes("done"),
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
    document.querySelector("#addForm").reset();

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
  return itemList.find(elem => elem.name === item);
}

function fetchListItems() {
  let itemList = getItems();
  let itemListResults = document.getElementById("itemListResults");

  itemListResults.innerHTML = "";

  itemList.map(item => {
    // Create new li element
    let li = document.createElement("li");

    // Add class
    li.className = item.done ? "list-group-item done" : "list-group-item";

    // Create new span element
    let span = document.createElement("span");
    span.className = "my-handle fas fa-arrows-alt";
    li.appendChild(span);

    // Add text node with input value
    li.appendChild(document.createTextNode(item.name));

    // Create del button element
    let deleteBtn = document.createElement("button");

    // Add classes to del button
    deleteBtn.className =
      "fas fa-trash-alt btn btn-danger btn-sm float-right delete";

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
  return event.target.classList.contains("delete");
}

function searchItems(event) {
  // Convert text to lowercase
  let text = event.target.value.toLowerCase();
  // Get list items
  let items = document.querySelectorAll("li");

  // Convert NodeList to array
  Array.from(items).forEach(item => {
    let itemName = item.textContent;
    // Compares input to list items
    item.style.display =
      itemName.toLowerCase().indexOf(text) !== -1 ? "block" : "none";
  });
}

// Retain localStorage list on HTML even after refresh
window.onload = fetchListItems();
