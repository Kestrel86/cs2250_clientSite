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

// Including the <summary>, <section>, <header>, and <h3> tags, but do not add any <aside>

const main = document.querySelector("main");

const posts = await downloadPosts();

console.log(posts);

for (const post of posts) {
  const container = document.createElement("article");
  container.setAttribute("data-post-id", post.id);
  const heading = document.createElement("h2");
  const content = document.createElement("p");

  heading.textContent = post.title;
  content.textContent = post.body;

  container.appendChild(heading);
  container.appendChild(content);

  main.appendChild(container);
}

/*
Desired structure of article

<article>
   <h2 data-post-id="1">(Title of the post)</h2>
   <aside><span>(Author name)</span></aside>
   <p><content)</p>
</article>


<details>
   <summary>See what our readers had to say...</summary>
   <section>
      <header>
         <h3>Comments</h3>
      </header>
      <section>
         <p>(User comment)</p>
         <p><small>(theme)</small></p>
      </section>
</details>
*/
