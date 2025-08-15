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

export function editBlogPost(
  blogListEl: HTMLElement,
  blogPostListEl: HTMLElement
): void {
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
        blogListEl,
        blogPostListEl!
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
        blogListEl,
        blogPostListEl!
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

export function deleteBlogPost(
  blogPostEl: HTMLElement,
  blogPostListEl: HTMLElement
): void {
  blogPostListEl!.removeChild(blogPostEl);
}
