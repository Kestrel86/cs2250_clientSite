// https://jsonplaceholder.typicode.com/guide/

/*
posts: https://jsonplaceholder.typicode.com/posts/1 , grabs the title
users: https://jsonplaceholder.typicode.com/users/1 , grabs the username 
comments: https://jsonplaceholder.typicode.com/posts/1/comments , grabs the comments to add to readers section
*/

// 10 posts, 5 comments each
// try to dynamically add the article elements

async function downloadPosts(page = 1) {
  const postsURL = `https://jsonplaceholder.typicode.com/posts?_page=${page}`;
  const response = await fetch(postsURL);
  const articles = await response.json();
  return articles;
}

async function downloadComments(postId) {
  const commentsURL = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
  const response = await fetch(commentsURL);
  const comments = await response.json();
  return comments;
}

async function getUserName(userId) {
  const userURL = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const response = await fetch(userURL);
  const user = await response.json();
  return user.name;
}

// Work from here, the above code is done for us
// remove everything inside main tag in html

function getArticleId(comments) {
  const article = comments.previousElementSibling;
  const data = article.dataset;
  return data.postId;
}

const articles = document.getElementsByTagName("article");

// function addArticle() {
//   const newArt = document.createElement("article");
//   newArt.attribute("data-post-id");
// }

const details = document.getElementsByTagName("details");
for (const detail of details) {
  detail.addEventListener("toggle", async (event) => {
    if (detail.open) {
      const asides = detail.getElementsByTagName("aside");
      const commentsWereDownloaded = asides.length > 0;
      if (!commentsWereDownloaded) {
        const articleId = getArticleId(detail);
        const comments = await downloadComments(articleId);
        console.log(comments);
      }
    }
  });
}

const posts = await downloadPosts();
console.log(posts);
