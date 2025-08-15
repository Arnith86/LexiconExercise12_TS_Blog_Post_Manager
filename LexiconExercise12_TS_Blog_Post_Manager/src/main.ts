import "./style.css";
import * as Constants from "./constants";
import { dummyBlogPosts } from "./data";
import type { IBlogPost } from "./types";

const blogPostFormEl =
  document.querySelector<HTMLFormElement>(".blog-post-form");
const blogPostListEl = document.querySelector<HTMLElement>(".blog-post-list");
const sortButtonsEl = document.querySelector<HTMLElement>(
  ".sort-action-buttons"
);

// Register events
blogPostFormEl?.addEventListener("submit", (event) =>
  handleOnBlogPostFormSubmit(event)
);
blogPostListEl?.addEventListener("click", (event) =>
  handleOnBlogPostClick(event)
);
sortButtonsEl?.addEventListener("click", (event) =>
  handleOnSortButtonClick(event)
);

addDummyData();

function createBlogPostEl(blogPost: IBlogPost): HTMLElement {
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

function handleOnBlogPostFormSubmit(event: SubmitEvent): void {
  // Stops page from reloading
  event.preventDefault();

  const titleInput =
    blogPostFormEl!.querySelector<HTMLInputElement>(".title-text-input");
  const authorInput =
    blogPostFormEl?.querySelector<HTMLInputElement>(".author-text-input");
  const newTimeStamp = new Date();
  const contentInput =
    blogPostFormEl?.querySelector<HTMLInputElement>(".body-text-input");

  console.log(titleInput!.value, authorInput, contentInput);

  const newBlogPost: IBlogPost = buildBlogPostObject(
    titleInput!.value,
    authorInput!.value,
    newTimeStamp,
    contentInput!.value
  );

  blogPostListEl?.appendChild(createBlogPostEl(newBlogPost));
}

function buildBlogPostObject(
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

function handleOnSortButtonClick(event: MouseEvent): void {
  const target = event.target;

  if (!(target instanceof HTMLElement)) return;

  if (target.closest(".sort-new-first-button"))
    sortBlogPost(Constants.TIME, blogPostListEl);
  if (target.closest(".sort-alphabetically-button"))
    sortBlogPost(Constants.AUTHOR_NAME, blogPostListEl);
}

function sortBlogPost(
  sortType: string,
  listOfBlogPostEl: HTMLElement | null
): void {
  const posts = Array.from(blogPostListEl!.children) as HTMLElement[];

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

function handleOnBlogPostClick(event: MouseEvent): void {
  const target = event.target;

  // TypeScript can’t know what type event.target will be before the event happens.
  // This if ensures both runtime safety and type safety.
  if (!(target instanceof HTMLElement)) return;

  const blogListEl = target.closest<HTMLElement>(".blog-post");
  if (blogListEl === null) return;

  if (target.closest(".delete-post-button")) deleteBlogPost(blogListEl);
  if (target.closest(".edit-post-button")) editBlogPost(blogListEl);
}

function deleteBlogPost(blogPostEl: HTMLElement): void {
  blogPostListEl!.removeChild(blogPostEl);
}

function editBlogPost(blogListEl: HTMLElement): void {
  // Edit logic
  const elements = getOriginalElementsFromBlogPost(blogListEl);
  if (!elements) return;

  const { originalTitleEl, originalContentEl, originalAuthor } = elements;

  const { editableBlogTitleEl, editableBlogContentEl } = createEditableFields(
    originalTitleEl.innerText,
    originalContentEl.innerText
  );

  const actionButtonsEl = blogListEl.querySelector(".action-buttons");
  if (!actionButtonsEl) return;

  changeToEditActionButtons(actionButtonsEl);

  originalTitleEl.replaceWith(editableBlogTitleEl);
  originalContentEl.replaceWith(editableBlogContentEl);

  // Save logic
  actionButtonsEl
    ?.querySelector(".save-edit-button")
    ?.addEventListener("click", () =>
      replaceBlogPostElement(
        editableBlogTitleEl.value,
        originalAuthor!.innerText,
        editableBlogContentEl.value,
        blogListEl
      )
    );

  // Cancel logic
  actionButtonsEl
    ?.querySelector(".cancel-edit-button")
    ?.addEventListener("click", () =>
      replaceBlogPostElement(
        originalTitleEl.innerText,
        originalAuthor!.innerText,
        originalContentEl.innerText,
        blogListEl
      )
    );
}

function changeToEditActionButtons(actionButtonsEl: Element) {
  actionButtonsEl!.innerHTML = /*html*/ `
        <button class="save-edit-button">
            <span class="icon">Save</span>
        </button>
        
        <button class="cancel-edit-button">
            <span class="icon">Cancel</span>
        </button>
    `;
}

function createEditableFields(title: string, content: string) {
  const editableBlogTitleEl = document.createElement("input");
  editableBlogTitleEl.type = "text";
  editableBlogTitleEl.value = title;

  const editableBlogContentEl = document.createElement("textarea");
  editableBlogContentEl.value = content;

  return { editableBlogTitleEl, editableBlogContentEl };
}

function getOriginalElementsFromBlogPost(blogListEl: HTMLElement) {
  const originalTitleEl =
    blogListEl.querySelector<HTMLHeadingElement>(".blog-post-title");
  const originalContentEl =
    blogListEl.querySelector<HTMLParagraphElement>(".blog-post-content");
  const originalAuthor =
    blogListEl.querySelector<HTMLParagraphElement>(".author-name");

  if (!originalTitleEl || !originalContentEl || !originalAuthor) return;

  return { originalTitleEl, originalContentEl, originalAuthor };
}

function replaceBlogPostElement(
  newTitle: string,
  author: string,
  newContent: string,
  blogListEl: HTMLElement
) {
  const updatedBlogPost: IBlogPost = buildBlogPostObject(
    newTitle,
    author,
    new Date(),
    newContent
  );

  blogPostListEl?.replaceChild(createBlogPostEl(updatedBlogPost), blogListEl);
}

function addDummyData() {
  Array.from(dummyBlogPosts).forEach((dummyBlogPost) => {
    blogPostListEl?.appendChild(createBlogPostEl(dummyBlogPost));
  });
}
