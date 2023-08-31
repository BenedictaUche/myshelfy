document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/dashboard";

  const cardContainer = document.getElementById("card-container");
  const articleUrl = document.getElementById("article-url");
  const articleSubmitBtn = document.getElementById("submit-btn");
  const articleUrlForm = document.querySelector(".article-url-form");

  const dashLogout = document.getElementById("dash-logout");
  const articleBtn = document.getElementById("article-btn");
  const articleContainer = document.getElementById("article-container");
  const articleCloseBtn = document.getElementById("cancel");
  const deleteArticleBtn = document.querySelector("delete-article");
  const portfolioBtn = document.getElementById("create_portfolio");
  const profileCover = document.getElementById("profile_cover");
  const editIcon = profileCover.querySelector(".edit-img-pen");
  const imageInput = document.getElementById("imageInput");
  const profileImgCover = document.getElementById('profile-img-cover');
  const editProfileIcon = document.querySelector('.edit-profile-img');
  const imageProfileInput = document.getElementById('imageProfile');

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
        <button class="btn btn-primary like-article" title='like'> <i class="fa-regular fa-star"></i></button>
        <button><a href="${articleUrl.value}" target="_blank" class="btn btn-primary">Read More</a></button>
        <button class='share-article' title='share'><i class="fa-regular fa-share-from-square"></i></button>
        <button class='delete-article' title='delete'> <i class="fa-regular fa-trash-can" ></i></button>
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

    // to display the user name in the dashboard

    // const userEmail = localStorage.getItem("email");
    // splitWord = userEmail.split("@");
    // let userName = splitWord[0] || "Guest";

    // let dashboardLog = document.createElement("h3");
    // dashboardLog.textContent = "Welcome " + userName + "";
    // dashlogout.appendChild(dashboardLog);

    // console.log(userName);

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
          articleUrlForm.reset();
        } catch (error) {
          console.error("Error fetching article data:", error);
        }
      }
    });
  } else {
    console.error("Article submit button not found");
  }

  // function registerUser(email, password) {
  //   // To check if the user already exists
  //   const userExists = users.some((user) => user.email === email);
  //   if (userExists) {
  //     alert("User already exists. Please login or use another email");
  //     return;
  //   }

  //   users.push({
  //     email: email,
  //     password: password,
  //   });
  //   localStorage.setItem("users", JSON.stringify(users));
  // }

  // function loginUser(email, password) {
  //   return users.find((user) => {
  //     return user.email === email && user.password === password;
  //   });
  // }

  function redirectTo(url) {
    window.location.href = url;
  }

  // Event listener for user registration
  // const register = document.getElementById("signup-form");
  // if (register) {
  //   register.addEventListener("submit", (e) => {
  //     e.preventDefault();
  //     const emailValue = document.getElementById("email").value;
  //     const passwordValue = document.getElementById("password").value;
  //     registerUser(emailValue, passwordValue);
  //     console.log(users);
  //     redirectTo("./dashboard.html");
  //   });
  // } else {
  //   console.error("Registration form element not found");
  // }

  if(portfolioBtn){
    portfolioBtn.addEventListener('click', (e) => {
      e.preventDefault();
      redirectTo('./portfolio.html');
    });
  }

  // Event listener for user login
  // const login = document.getElementById("login-form");
  // if (login) {
  //   login.addEventListener("submit", (e) => {
  //     e.preventDefault();
  //     const emailValue = document.getElementById("email").value;
  //     const passwordValue = document.getElementById("password").value;
  //     const user = loginUser(emailValue, passwordValue);
  //     if (user) {
  //       alert("Login successful");
  //       redirectTo("./dashboard.html");
  //     } else {
  //       alert("Login failed");
  //     }
  //   });
  // } else {
  //   console.error("Login form element not found");
  // }

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

  // Event listener for profile cover image

  if (editIcon) {
    editIcon.addEventListener("click", () => {
      imageInput.click();
    });
  } else {
    console.error("Cannot get access to edit icon");
  }

  if (imageInput) {
    imageInput.addEventListener("change", (e) => {
      e.preventDefault();
      const file = e.target.files[0];
      if (file) {
        const img = profileCover.querySelector("img");
        img.src = URL.createObjectURL(file);
        // Revoke the object URL to prevent memory leaks
        
      } else {
        console.error("No file chosen");
      }
    });
  } else {
    console.error("Cannot get access to image input");
  }


  if(editProfileIcon){
    editProfileIcon.addEventListener('click', () => {
      imageProfileInput.click();
    });
  } else {
    console.error("Cannot get access to edit profile icon")
  }

  if(imageProfileInput){
    imageProfileInput.addEventListener("change", (e) => {
      e.preventDefault();
      const file = e.target.files[0];
      if(file) {
        const img = profileImgCover.querySelector("img");
        img.src = URL.createObjectURL(file);
      } else {
        console.error("No file chosen");
      }
    });
  } else {
    console.error("Cannot get access to profile image input");
  }



});
