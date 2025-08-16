import type { IBlogPost } from "./types";
import * as Constants from "./constants";
import { dummyBlogPosts } from "./data";

let storedBlogPosts: IBlogPost[] = loadPostsFromLocalStorage();

function savePostsToLocalStorage(): void {
  localStorage.setItem(Constants.BLOG_POSTS, JSON.stringify(storedBlogPosts));
}

function loadPostsFromLocalStorage(): IBlogPost[] {
  const stored = localStorage.getItem(Constants.BLOG_POSTS);
  return stored ? JSON.parse(stored) : [];
}

export function createBlogPostEl(blogPost: IBlogPost): HTMLElement {
  const { id, title, author, content, timeStamp } = blogPost;

  // Ensures that timeStamp is a Date object,
  // does not happen automatically when loaded from localStorage.
  const date = timeStamp instanceof Date ? timeStamp : new Date(timeStamp);

  const newBlogPostEl = document.createElement("article");
  newBlogPostEl.id = String(id);
  newBlogPostEl.classList.add("blog-post");

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
            <time>${date.toLocaleDateString()}</time>
        </footer>
        
    </article>
    `;

  return newBlogPostEl;
}

export function buildBlogPostObject(
  postId: string,
  titleInput: string,
  authorInput: string,
  newTimeStamp: Date,
  contentInput: string
): IBlogPost {
  return {
    id: postId,
    title: titleInput,
    author: authorInput,
    timeStamp: newTimeStamp,
    content: contentInput,
  };
}

export function replaceBlogPostElement(
  blogPostId: string,
  newTitle: string,
  author: string,
  newContent: string,
  blogPostEl: HTMLElement,
  blogPostListEl: HTMLElement
) {
  const updatedBlogPost: IBlogPost = buildBlogPostObject(
    blogPostId,
    newTitle,
    author,
    new Date(),
    newContent
  );

  blogPostListEl?.replaceChild(createBlogPostEl(updatedBlogPost), blogPostEl);
  savePostsToLocalStorage();
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

  posts.forEach((post) => {
    listOfBlogPostEl?.appendChild(post);
  });
}

export function deleteBlogPost(
  blogPostEl: HTMLElement,
  blogPostListEl: HTMLElement
): void {
  blogPostListEl!.removeChild(blogPostEl);

  storedBlogPosts = storedBlogPosts.filter(
    (blogPost) => blogPost.id != blogPostEl.id
  );

  savePostsToLocalStorage();
}

export function addBlogPost(
  newBlogPost: IBlogPost,
  blogPostListEl: HTMLElement,
  persist: boolean = true
): void {
  blogPostListEl?.appendChild(createBlogPostEl(newBlogPost));

  if (persist) {
    storedBlogPosts.push(newBlogPost);
    savePostsToLocalStorage();
  }
}

export function populateWithLoadedBlogPosts(blogPostListEl: HTMLElement): void {
  let blogPosts = loadPostsFromLocalStorage();
  let persist = false;

  if (blogPosts.length == 0) {
    blogPosts = dummyBlogPosts;
    persist = true;
  }

  Array.from(blogPosts).forEach((blogPost) => {
    addBlogPost(blogPost, blogPostListEl!, persist);
  });
}
