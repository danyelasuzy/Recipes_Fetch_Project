//Dom selectos
const inputField = document.getElementById("input");
const submit = document.querySelector("button");
const card = document.querySelector(".card");
const clearButton = document.getElementById("clear");
const modal = document.querySelector(".modal");
const overlay = document.getElementById("overlay");

// Add a new container for the message
const messageContainer = document.createElement("div");
messageContainer.classList.add("search-message");
card.parentNode.insertBefore(messageContainer, card); //stays always before the next node

const fetchData = async (query) => {
  const url = `https://themealdb.com/api/json/v1/1/search.php?s=${query}`;
  try {
    // Fetch data from API
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error status: ${res.status}`);
    }
    const data = await res.json();

    // Clear previous results
    card.textContent = "";
    messageContainer.textContent = "";

    if (data.meals) {
      // Add a message about the search results
      messageContainer.textContent = `These are the results for "${query}":`;

      // Display the meals
      data.meals.forEach((meal) => {
        const mealCard = document.createElement("div");
        mealCard.classList.add("meal-card");

        // Meal Image
        const mealImage = document.createElement("img");
        mealImage.src = meal.strMealThumb;
        mealImage.alt = meal.strMeal;
        mealImage.classList.add("img");

        // Meal Title
        const mealTitle = document.createElement("h3");
        mealTitle.textContent = meal.strMeal;

        // Append image and title to meal card
        mealCard.appendChild(mealImage);
        mealCard.appendChild(mealTitle);

        // Append meal card to container
        card.appendChild(mealCard);

        // Add click event for modal functionality
        mealCard.addEventListener("click", () => {
          modal.innerHTML = "";

          const modalContent = document.createElement("div");
          modalContent.classList.add("modal-content");

          // Close Button
          const closeButton = document.createElement("button");
          closeButton.textContent = "X";
          closeButton.classList.add("close-button");
          closeButton.addEventListener("click", () => {
            modal.style.display = "none";
          });
          modalContent.appendChild(closeButton);

          // Meal Title in Modal
          const modalTitle = document.createElement("h2");
          modalTitle.textContent = meal.strMeal;
          modalContent.appendChild(modalTitle);

          // Meal Image in Modal
          const modalImage = document.createElement("img");
          modalImage.src = meal.strMealThumb;
          modalImage.alt = meal.strMeal;
          modalContent.appendChild(modalImage);

          // Ingredients List
          const title = document.createElement("h3");
          title.textContent = "Ingredients:";
          modalContent.appendChild(title);

          const ingredientsList = document.createElement("ul");
          for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if (ingredient && ingredient.trim() !== "") {
              const listItem = document.createElement("li");
              listItem.textContent = `${measure || ""} ${ingredient} `;
              ingredientsList.appendChild(listItem);
            }
          }
          modalContent.appendChild(ingredientsList);

          // Instructions
          const instructionsTitle = document.createElement("h3");
          instructionsTitle.textContent = "Instructions:";
          modalContent.appendChild(instructionsTitle);

          const mealInstructions = document.createElement("p");
          mealInstructions.textContent = meal.strInstructions;
          modalContent.appendChild(mealInstructions);

          // Append modal content to modal and show it
          modal.appendChild(modalContent);
          modal.style.display = "flex";

          //Format the text instructions
          const formatInstructions = (instructions) => {
            const sentences = instructions.split(". ");
            return sentences
              .map((sentence) => `<p>${sentence.trim()}.</p>`)
              .join("");
          };

          mealInstructions.innerHTML = formatInstructions(meal.strInstructions);
        });
      });
    } else {
      // Handle no results
      messageContainer.textContent = `No meals found for "${query}". Please try another search.`;
    }
  } catch (error) {
    // Error handling
    console.error("Error fetching data:", error);
    messageContainer.textContent =
      "Something went wrong while fetching the data. Please try again later.";
  }
};

// Add event listener to search button
submit.addEventListener("click", () => {
  const query = inputField.value.trim();
  if (query) {
    fetchData(query);
  } else {
    messageContainer.textContent = "Please enter a search term.";
    card.textContent = "";
  }
});

inputField.addEventListener("keypress", () => {
  const query = inputField.value.trim();
  if (query) {
    fetchData(query);
  } else {
    messageContainer.textContent = "Please enter a search term.";
    card.textContent = "";
    inputField.reset();
  }
});
