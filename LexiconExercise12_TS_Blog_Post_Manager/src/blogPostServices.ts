import { replaceBlogPostElement } from "./blogPostListServices";
// import { dummyBlogPosts } from "./data";

export function editBlogPost(
  blogListEl: HTMLElement,
  blogPostListEl: HTMLElement
): void {
  // Edit logic
  const elements = getOriginalElementsFromBlogPost(blogListEl);
  if (!elements) return;

  const { originalId, originalTitleEl, originalContentEl, originalAuthor } =
    elements;

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
        originalId,
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
        originalId,
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
  const originalId = blogListEl.id;
  const originalTitleEl =
    blogListEl.querySelector<HTMLHeadingElement>(".blog-post-title");
  const originalContentEl =
    blogListEl.querySelector<HTMLParagraphElement>(".blog-post-content");
  const originalAuthor =
    blogListEl.querySelector<HTMLParagraphElement>(".author-name");

  if (!originalId || !originalTitleEl || !originalContentEl || !originalAuthor)
    return;

  return { originalId, originalTitleEl, originalContentEl, originalAuthor };
}
