import "./style.css";
import { dummyBlogPosts } from "./data";
import type { IBlogPost } from "./types";

const blogPostListEl = document.querySelector<HTMLElement>(".blog-post-list");

// Register click events
blogPostListEl?.addEventListener("click", (event) => handleOnClick(event));

addDummyData();

function createBlogPostEl(blogPost: IBlogPost): HTMLElement {
  const { title, author, content, timeStamp } = blogPost;

  const newBlogPostEl = document.createElement("article");
  const classes = ["blog-post"];

  newBlogPostEl.classList.add(...classes);

  newBlogPostEl.innerHTML = /*html*/ `
    <article>
    <h2>${title}</h2>
    <p>${content}</p>
    
    <div class="action-buttons">
        <button class="delete-post-button" type="button">
            <span class="icon">Delete</span>
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

function handleOnClick(event: MouseEvent): void {
  const target = event.target;

  // TypeScript can’t know what type event.target will be before the event happens.
  // This if ensures both runtime safety and type safety.
  if (!(target instanceof HTMLElement)) return;

  const blogListEl = target.closest<HTMLElement>(".blog-post");
  if (blogListEl === null) return;

  if (target.closest(".delete-post-button")) deleteBlogPost(blogListEl);
}

function deleteBlogPost(blogPostEl: HTMLElement): void {
  blogPostListEl!.removeChild(blogPostEl);
}

function addDummyData() {
  Array.from(dummyBlogPosts).forEach((dummyBlogPost) => {
    blogPostListEl?.appendChild(createBlogPostEl(dummyBlogPost));
  });
}
