import "./style.css";
import { dummyBlogPosts } from "./data";
import type { IBlogPost } from "./types";

Array.from(dummyBlogPosts).forEach((dummyBlogPost) => {
  blogPostListEl?.appendChild(createBlogPostEl(dummyBlogPost));
});

function createBlogPostEl(blogPost: IBlogPost): HTMLElement {
  const { title, author, content, timeStamp } = blogPost;

  const newBlogPostEl = document.createElement("article");
  const classes = ["blogPost"];

  newBlogPostEl.classList.add(...classes);

  newBlogPostEl.innerHTML = /*html*/ `
    <article>
        <h2>${title}</h2>
        <p>${content}</p>
        
        <div class="action-buttons">
            <button class="delete-post-button" type="button">
                <span class="icon">
                    Delete
                </span>
            </button>
        </div>

        <footer class="post-footer">
            <p>written by ${author}</p>
            <time>${timeStamp.toLocaleDateString()}</time>
        </footer>

    </article>
    `;

  return newBlogPostEl;
}

}
