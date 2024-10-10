// Constants
const ADD_TOY_BTN_SELECTOR = '#new-toy-btn'; // Add toy button selector
const TOY_FORM_SELECTOR = '.container'; // Toy form selector
const TOY_COLLECTION_SELECTOR = '#toy-collection'; // Toy collection selector
const TOY_API_URL = 'http://localhost:3000/toys'; // Toy API URL

// DOM Elements
const addToyBtn = document.querySelector(ADD_TOY_BTN_SELECTOR); // Add toy button
const toyForm = document.querySelector(TOY_FORM_SELECTOR); // Toy form
const toyCollection = document.querySelector(TOY_COLLECTION_SELECTOR); // Toy collection

// State
let isAddToyFormVisible = false; // Flag to show/hide toy form

// Functions
function getToys() { // Get all toys from API
  return fetch(TOY_API_URL)
    .then(response => response.json());
}

function postToy(toyData) { // Post new toy to API
  const toy = {
    name: toyData.name.value,
    image: toyData.image.value,
    likes: 0,
  };

  return fetch(TOY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(toy),
  })
    .then(response => response.json())
    .then(renderToy); // Render new toy
}

function updateToyLikes(toyId, likes) { // Update toy likes
  return fetch(`${TOY_API_URL}/${toyId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ likes }),
  })
    .then(response => response.json());
}

function renderToy(toy) { // Render a toy
  const toyCard = document.createElement('div');
  toyCard.classList.add('card');

  // Create toy elements (name, image, likes, like button)
  const toyName = document.createElement('h2');
  toyName.textContent = toy.name;

  const toyImage = document.createElement('img');
  toyImage.src = toy.image;
  toyImage.classList.add('toy-avatar');

  const toyLikes = document.createElement('p');
  toyLikes.textContent = `${toy.likes} likes`;

  const likeButton = document.createElement('button');
  likeButton.classList.add('like-btn');
  likeButton.id = toy.id;
  likeButton.textContent = 'Like';
  likeButton.addEventListener('click', handleLikeButtonClicked);

  toyCard.appendChild(toyName);
  toyCard.appendChild(toyImage);
  toyCard.appendChild(toyLikes);
  toyCard.appendChild(likeButton);

  toyCollection.appendChild(toyCard);
}

function handleLikeButtonClicked(event) { // Handle like button click
  const toyId = event.target.id;
  const currentLikes = parseInt(event.target.previousElementSibling.textContent.split(' ')[0]);
  const newLikes = currentLikes + 1;

  updateToyLikes(toyId, newLikes)
    .then(() => {
      event.target.previousElementSibling.textContent = `${newLikes} likes`;
    });
}

function handleAddToyButtonClicked() { // Handle add toy button click
  isAddToyFormVisible = !isAddToyFormVisible;

  if (isAddToyFormVisible) {
    toyForm.style.display = 'block';
    toyForm.addEventListener('submit', handleToyFormSubmitted);
  } else {
    toyForm.style.display = 'none';
  }
}

function handleToyFormSubmitted(event) { // Handle toy form submission
  event.preventDefault();
  postToy(event.target);
}

// Event Listeners
addToyBtn.addEventListener('click', handleAddToyButtonClicked);

// Initialize
getToys()
  .then(toys => toys.forEach(renderToy));