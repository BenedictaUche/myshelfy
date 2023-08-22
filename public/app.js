// const axios = require('axios');
// const appDiv = document.getElementById('app');
const cardDiv = document.getElementById("card-container");
const articleUrl = document.getElementById("article-url");
const removeArticle = document.getElementById("removeArticle")
// const scrape = require('./scrape');

// To load users and articles from local storage
let users = JSON.parse(localStorage.getItem("users")) || [];
let articles = JSON.parse(localStorage.getItem("articles")) || [];

// To fetch article data from server
async function fetchArticleData(url) {
  try {
    const response = await fetch(
      `http://localhost:3000/dashboard?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();
    articles.push(data);
    localStorage.setItem("articles", JSON.stringify(articles));
    console.log(data);
    displayArticle(data);
    return data;
  } catch (error) {
    console.log("Error fetching article data:", error);
    throw error;
  }
}

// To display article data
function displayArticle(data) {
  console.log("Received data:", data);
  cardDiv.innerHTML = "";

  for (let i = 0; i < articles.length; i += 3) {
    const columnDiv = document.createElement("div");
    columnDiv.classList.add("column");

    for (let j = 1; j < i + 3 && j < articles.length; j++) {
      const article = articles[j];
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
      <i class="fa-regular fa-circle-xmark article-cancel" id='removeArticle'></i>
        <img src="${article.imageUrl}" alt="Avatar" style='width: 100%'>
        <div class="container">
          <h4><b>${article.title}</b></h4>
          <p>${article.description}</p>
        </div>
      `;
      columnDiv.appendChild(card);
    }

    cardDiv.appendChild(columnDiv);
  }
}

function registerUser(email, password) {
  users.push({
    email: email,
    password: password,
  });
  localStorage.setItem("users", JSON.stringify(users));
}

function loginUser(email, password) {
  return users.find((user) => {
    return user.email === email && user.password === password;
  });
}

function redirectTo(url) {
  window.location.href = url;
}

function setupArticleListeners() {
  // Event listener for article submit button
  const articleSubmitBtn = document.getElementById("submit-btn");
  if (articleSubmitBtn) {
    articleSubmitBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const articleUrlValue = articleUrl.value;
      if (articleUrlValue) {
        try {
          const response = await fetchArticleData(articleUrlValue);
          const articleData = response.data;
          console.log(articleData);
        } catch (error) {
          console.log("Error fetching article data:", error);
        }
      }
    });
  } else {
    console.error("Article submit button not found");
  }

  // Event listener for user registration
  const register = document.getElementById("signup-form");
  if (register) {
    register.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailValue = document.getElementById("email").value;
      const passwordValue = document.getElementById("password").value;
      registerUser(emailValue, passwordValue);
      console.log(users);
      redirectTo("./dashboard.html");
    });
  } else {
    console.error("Registration form element not found");
  }

  // Event listener for user login
  const login = document.getElementById("login-form");
  if (login) {
    login.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailValue = document.getElementById("email").value;
      const passwordValue = document.getElementById("password").value;
      const user = loginUser(emailValue, passwordValue);
      if (user) {
        console.log(user);
        redirectTo("./dashboard.html");
      } else {
        alert("Invalid email or password");
      }
    });
  } else {
    console.error("Login form element not found");
  }

  // Event listener for user logout
  const dashLogout = document.getElementById("dash-logout");
  if (dashLogout) {
    dashLogout.addEventListener("click", (e) => {
      e.preventDefault();
      redirectTo("./index.html");
    });
  } else {
    console.error("Logout button not found");
  }

  displayArticle(articles);
}


// Entry point when the page loads
function initializePage() {
  setupArticleListeners();
}

initializePage();


// To remove article on click of remove button
removeArticle.addEventListener('click', (e) => {
  e.preventDefault();
  cardDiv.innerHTML = "";
  articles.pop();
  localStorage.setItem("articles", JSON.stringify(articles));
  displayArticle(articles);
})




// Event listener for article button
const articleBtn = document.getElementById("article-btn");
const articleContainer = document.getElementById("article-container");
const articleCloseBtn = document.getElementById("cancel");
if (articleBtn && articleContainer && articleCloseBtn) {
  articleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    articleContainer.style.display = "block";
  });

  articleCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    articleContainer.style.display = "none";
  });
} else {
  console.error("Article-related elements not found");
}
