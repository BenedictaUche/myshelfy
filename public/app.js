document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/dashboard";

  const cardContainer = document.getElementById("card-container");
  const articleUrl = document.getElementById("article-url");
  const articleSubmitBtn = document.getElementById("submit-btn");
  // const registerForm = document.getElementById("signup-form");
  // const loginForm = document.getElementById("login-form");
  const dashLogout = document.getElementById("dash-logout");
  const articleBtn = document.getElementById("article-btn");
  const articleContainer = document.getElementById("article-container");
  const articleCloseBtn = document.getElementById("cancel");
  const deleteArticleBtn = document.querySelector("delete-article");
  const shareArticleBtn = document.getElementById("share-article");
  const likeArticleBtn = document.getElementById("like-article");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let articles = JSON.parse(localStorage.getItem("articles")) || [];
  let articleCount = 0;

  function displayArticle(data, articleId) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${data.imageUrl}" alt="Avatar" style="width:100%">
      <div class="container">
        <h4><b>${data.title}</b></h4>
        <p>${data.description}</p>
      </div>
      <div class='features'>
        <button class="btn btn-primary like-article"> <i class="fa-regular fa-star"></i></button>
        <button><a href="${articleUrl.value}" target="_blank" class="btn btn-primary">Read More</a></button>
        <button class='share-article'><i class="fa-regular fa-share-from-square"></i></button>
        <button class='delete-article'> <i class="fa-regular fa-trash-can" ></i></button>
      </div>
    `;

    card.setAttribute("data-article-id", articleCount);

    // to like the article

    const likeButton = card.querySelector(".like-article");
    likeButton.addEventListener("click", (e) => {
      e.preventDefault();
      likeButton.classList.toggle("liked");
    });

    // to delete the article
    const deleteButton = card.querySelector(".delete-article");
    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      const card = e.target.closest(".card");
      const articleId = card.getAttribute("data-article-id");

      const userArticles =
        JSON.parse(localStorage.getItem("userArticles")) || [];
      const updatedArticles = userArticles.filter(
        (article, index) => index !== parseInt(articleId)
      );
      localStorage.setItem("userArticles", JSON.stringify(updatedArticles));

      card.remove();
    });

    // to share the article

    const shareButton = card.querySelector(".share-article");
    shareButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (navigator.share) {
        navigator
          .share({
            title: "Web Share API Demo",
            url: `${articleUrl.value}`,
          })
          .then(() => {
            alert("Thanks for sharing!");
          })
          .catch(console.error);
      } else {
        alert("Web share not supported");
      }
    });

    cardContainer.appendChild(card);

    articleCount++;
    if (articleCount % 3 === 0) {
      cardContainer.appendChild(document.createElement("br"));
    }
  }

  // to delete the article

  if (deleteArticleBtn) {
    deleteArticleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = e.target.closest(".card");
      const articleId = card.getAttribute("data-article-id");

      const userArticles =
        JSON.parse(localStorage.getItem("userArticles")) || [];
      const updatedArticles = userArticles.filter(
        (article, index) => index !== parseInt(articleId)
      );
      localStorage.setItem("userArticles", JSON.stringify(updatedArticles));

      card.remove();
    });
  }

  async function fetchArticleData(url) {
    try {
      const response = await fetch(`${API_URL}?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      console.log(data);

      const article = {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
      };

      articles.push(article);
      localStorage.setItem("articles", JSON.stringify(articles));

      const userArticles =
        JSON.parse(localStorage.getItem("userArticles")) || [];
      userArticles.push(article);
      localStorage.setItem("userArticles", JSON.stringify(userArticles));

      displayArticle(data);

      return data;
    } catch (error) {
      console.error("Error fetching article data:", error);
      throw error;
    }
  }

  if (articleSubmitBtn) {
    articleSubmitBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const articleUrlValue = articleUrl.value;
      if (articleUrlValue) {
        try {
          const response = await fetchArticleData(articleUrlValue);
          const articleData = response.data;
          console.log(articleData);
          displayArticle(articleData);
        } catch (error) {
          console.error("Error fetching article data:", error);
        }
      }
    });
  } else {
    console.error("Article submit button not found");
  }

  if (deleteArticleBtn) {
    deleteArticleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = document.querySelector(".card");
      card.remove();
    });
  } else {
    console.error("Delete article button not found");
  }

  function registerUser(email, password) {
    // To check if the user already exists
    const userExists = users.some((user) => user.email === email);
    if (userExists) {
      alert("User already exists. Please login or use another email");
      return;
    }

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
        alert("Login successful");
        redirectTo("./dashboard.html");
      } else {
        alert("Login failed");
      }
    });
  } else {
    console.error("Login form element not found");
  }

  // Event listener for user logout

  if (dashLogout) {
    dashLogout.addEventListener("click", (e) => {
      e.preventDefault();
      redirectTo("./index.html");
    });
  } else {
    console.error("Logout button not found");
  }

  // Event listener for article button

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

  // function to delete article
  function deleteArticle() {
    const card = document.querySelector(".card");
    card.remove();
  }

  if (deleteArticleBtn) {
    deleteArticleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      deleteArticle();
    });
  }


});


