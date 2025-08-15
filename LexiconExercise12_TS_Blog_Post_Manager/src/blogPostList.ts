import type { IBlogPost } from "./types";
import * as Constants from "./constants";

export function createBlogPostEl(blogPost: IBlogPost): HTMLElement {
  const { title, author, content, timeStamp } = blogPost;

  const newBlogPostEl = document.createElement("article");
  const classes = ["blog-post"];

  newBlogPostEl.classList.add(...classes);

  newBlogPostEl.innerHTML = /*html*/ `
    <article >
        <h2 class="blog-post-title">${title}</h2>
        <p class="blog-post-content">${content}</p>
        
        <div class="action-buttons">
            <button class="delete-post-button" type="button">
                <span class="icon">Delete</span>
            </button>
            
            <button class="edit-post-button" type="button">
                <span class="icon">Edit</span>
            </button>

        </div>
        
        <footer class="post-footer">
            <p>Author: <i class="author-name">${author}</i></p>
            <time>${timeStamp.toLocaleDateString()}</time>
        </footer>
        
    </article>
    `;

  return newBlogPostEl;
}

export function sortBlogPost(
  sortType: string,
  listOfBlogPostEl: HTMLElement | null
): void {
  const posts = Array.from(listOfBlogPostEl!.children) as HTMLElement[];

  posts.sort((a, b) => {
    if (sortType === Constants.AUTHOR_NAME) {
      const nameA = a
        .querySelector(Constants.AUTHOR_NAME)!
        .textContent!.toLowerCase();
      const nameB = b
        .querySelector(Constants.AUTHOR_NAME)!
        .textContent!.toLowerCase();

      return nameA.localeCompare(nameB);
    } else if (sortType === Constants.TIME) {
      const dateA = new Date(a.querySelector(Constants.TIME)!.innerHTML);
      const dateB = new Date(b.querySelector(Constants.TIME)!.innerHTML!);

      return dateA.getTime() - dateB.getTime(); // newest first
    }

    return 0;
  });

  listOfBlogPostEl!.innerHTML = ""; // This clears the element

  posts.forEach((post) => listOfBlogPostEl?.appendChild(post));
}
