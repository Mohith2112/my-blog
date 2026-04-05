// Dark mode
document.getElementById("dark-btn").onclick = function () {
    document.body.classList.toggle("dark");
};

// On load
window.onload = function () {
    if (localStorage.getItem("loggedIn") !== "true") {
        document.getElementById("admin-panel").style.display = "none";
    }
    displayPosts();
};

// Create post
function createPost() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const file = document.getElementById("imageFile").files[0];

    if (!title || !content || !file) {
        alert("Please fill all fields");
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        const post = {
            title: title,
            content: content,
            image: reader.result,
            likes: 0,
            comments: []
        };

        let posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts.push(post);
        localStorage.setItem("posts", JSON.stringify(posts));

        displayPosts();
    };

    reader.readAsDataURL(file);
}

// Display posts
function displayPosts() {
    const postContainer = document.getElementById("posts");
    postContainer.innerHTML = "";

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    posts.forEach((post, index) => {
        const article = document.createElement("article");
        article.className = "post";

        article.innerHTML = `
            <img src="${post.image}">
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <button onclick="likePost(${index})">❤️ ${post.likes}</button>
            <button onclick="showComments(${index})">Comments</button>
            <div id="comments-${index}"></div>
            ${
                isLoggedIn
                ? `<button onclick="editPost(${index})">Edit</button>
                   <button onclick="deletePost(${index})">Delete</button>`
                : ""
            }
        `;

        postContainer.appendChild(article);
    });
}

// Like
function likePost(index) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts[index].likes++;
    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts();
}

// Delete
function deletePost(index) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.splice(index, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts();
}

// Edit
function editPost(index) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = posts[index];

    document.getElementById("title").value = post.title;
    document.getElementById("content").value = post.content;

    deletePost(index);
}

// Comments
function showComments(index) {
    const commentDiv = document.getElementById(`comments-${index}`);

    commentDiv.innerHTML = `
        <input type="text" id="commentInput-${index}">
        <button onclick="addComment(${index})">Add</button>
        <div id="commentList-${index}"></div>
    `;

    loadComments(index);
}

function addComment(index) {
    const input = document.getElementById(`commentInput-${index}`);

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts[index].comments.push(input.value);

    localStorage.setItem("posts", JSON.stringify(posts));
    loadComments(index);
}

function loadComments(index) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const commentList = document.getElementById(`commentList-${index}`);

    commentList.innerHTML = "";
    posts[index].comments.forEach(c => {
        commentList.innerHTML += `<p>💬 ${c}</p>`;
    });
}

// Logout
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}