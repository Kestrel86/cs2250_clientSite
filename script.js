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

const main = document.querySelector("main");

const posts = await downloadPosts();

console.log(posts);

//Creates the posts and details button
for (const post of posts) {
  const container = document.createElement("article");
  container.setAttribute("data-post-id", post.id);
  const heading = document.createElement("h2");
  const user = document.createElement("aside");
  const content = document.createElement("p");

  heading.innerText = post.title;
  user.innerText = "by " + (await getUserName(post.userId));
  content.innerText = post.body;

  content.innerText.replaceAll("\n", `<br/>`);

  container.appendChild(heading);
  container.appendChild(user);
  container.appendChild(content);

  main.appendChild(container);

  const detailContainer = document.createElement("details");
  const summary = document.createElement("summary");
  summary.innerText = "See what our readers had to say...";

  const contSec = document.createElement("section");

  const header = document.createElement("header");
  const comments = document.createElement("h3");
  comments.innerText = "Comments";

  contSec.appendChild(header);
  header.appendChild(comments);

  detailContainer.appendChild(summary);
  detailContainer.appendChild(contSec);
  main.appendChild(detailContainer);
}

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

        //created to post every comment
        for (const comment of comments) {
          const container = document.createElement("aside");
          const content = document.createElement("p");
          const contentSmall = document.createElement("p");
          content.innerText = comment.body;
          content.innerText.replaceAll("\n", `<br/>`);
          contentSmall.innerHTML = `<small>${comment.name}</small>`;
          container.appendChild(content);
          container.appendChild(contentSmall);
          detail.lastChild.appendChild(container);
        }
      }
    }
  });
}
