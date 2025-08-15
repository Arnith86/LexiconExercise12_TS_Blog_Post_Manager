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

export function buildBlogPostObject(
  titleInput: string,
  authorInput: string,
  newTimeStamp: Date,
  contentInput: string
): IBlogPost {
  return {
    title: titleInput,
    author: authorInput,
    timeStamp: newTimeStamp,
    content: contentInput,
  };
}

export function replaceBlogPostElement(
  newTitle: string,
  author: string,
  newContent: string,
  blogPostEl: HTMLElement,
  blogPostListEl: HTMLElement
) {
  const updatedBlogPost: IBlogPost = buildBlogPostObject(
    newTitle,
    author,
    new Date(),
    newContent
  );

  blogPostListEl?.replaceChild(createBlogPostEl(updatedBlogPost), blogPostEl);
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

      return dateB.getTime() - dateA.getTime(); // newest first
    }

    return 0;
  });

  listOfBlogPostEl!.innerHTML = ""; // This clears the element

  posts.forEach((post) => listOfBlogPostEl?.appendChild(post));
}

export function deleteBlogPost(
  blogPostEl: HTMLElement,
  blogPostListEl: HTMLElement
): void {
  blogPostListEl!.removeChild(blogPostEl);
}
