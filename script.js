const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const addQuoteForm = document.getElementById("addQuoteForm");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");
const conflictNotification = document.getElementById("conflictNotification");

let quotes = [];
let lastSyncTime = 0;
const syncInterval = 30000;

function showRandomQuote(category) {
  let filteredQuotes = quotes;
  if (category !== "all") {
    filteredQuotes = quotes.filter((quote) => quote.category === category);
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = randomQuote.text;
}

function createAddQuoteForm() {
  addQuoteForm.style.display = "block";
}

function addQuote() {
  const newQuote = {
    text: newQuoteText.value,
    category: newQuoteCategory.value,
  };

  quotes.push(newQuote);

  const newQuoteElement = document.createElement("p");
  newQuoteElement.textContent = newQuote.text;

  quoteDisplay.appendChild(newQuoteElement);

  if (!categories.includes(newQuote.category)) {
    const newOption = document.createElement("option");
    newOption.value = newQuote.category;
    newOption.textContent = newQuote.category;
    categoryFilter.appendChild(newOption);
  }

  newQuoteText.value = "";
  newQuoteCategory.value = "";
  addQuoteForm.style.display = "none";
  showRandomQuote(lastSelectedCategory);

  syncData();
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  lastSelectedCategory = selectedCategory;
  localStorage.setItem("lastSelectedCategory", selectedCategory);
  showRandomQuote(selectedCategory);
}

function populateCategories() {
  const categories = quotes
    .map((quote) => quote.category)
    .filter((category, index, arr) => arr.indexOf(category) === index);

  categories.forEach((category) => {
    const newOption = document.createElement("option");
    newOption.value = category;
    newOption.textContent = newQuote.category;
    categoryFilter.appendChild(newOption);
  });

  categoryFilter.value = lastSelectedCategory;
}

async function syncData() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuote),
    });
    const serverQuotes = await response.json();

    const mergedQuotes = serverQuotes
      .map((serverQuote) => ({
        text: serverQuote.title,
        category: serverQuote.body,
      }))
      .concat(
        quotes.filter(
          (localQuote) =>
            !serverQuotes.some(
              (serverQuote) => serverQuote.text === localQuote.text
            )
        )
      );

    const conflicts = mergedQuotes.filter((quote) =>
      quotes.some(
        (localQuote) =>
          localQuote.text === quote.text &&
          localQuote.category !== quote.category
      )
    );

    if (conflicts.length > 0) {
      conflictNotification.textContent =
        "Conflicts detected. Server data takes precedence.";
      conflictNotification.style.display = "block";
    } else {
      conflictNotification.style.display = "none";
    }

    quotes = mergedQuotes;
    localStorage.setItem("quotes", JSON.stringify(quotes));
    showRandomQuote(lastSelectedCategory);
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }

  lastSyncTime = Date.now();
  setTimeout(syncData, syncInterval);
}

newQuoteButton.addEventListener("click", () =>
  showRandomQuote(lastSelectedCategory)
);
addQuoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addQuote();
});
categoryFilter.addEventListener("change", filterQuotes);

populateCategories();

syncData();
