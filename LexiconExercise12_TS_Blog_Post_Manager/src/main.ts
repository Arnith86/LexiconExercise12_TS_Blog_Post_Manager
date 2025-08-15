import "./style.css";
import * as Constants from "./constants";
import { dummyBlogPosts } from "./data";
import type { IBlogPost } from "./types";
import {
  createBlogPostEl,
  sortBlogPost,
  buildBlogPostObject,
  deleteBlogPost,
  editBlogPost,
} from "./blogPostList";

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

  const newBlogPost: IBlogPost = buildBlogPostObject(
    titleInput!.value,
    authorInput!.value,
    newTimeStamp,
    contentInput!.value
  );

  blogPostListEl?.appendChild(createBlogPostEl(newBlogPost));
}

function handleOnSortButtonClick(event: MouseEvent): void {
  const target = event.target;

  if (!(target instanceof HTMLElement)) return;

  if (target.closest(".sort-new-first-button"))
    sortBlogPost(Constants.TIME, blogPostListEl);
  if (target.closest(".sort-alphabetically-button"))
    sortBlogPost(Constants.AUTHOR_NAME, blogPostListEl);
}

function handleOnBlogPostClick(event: MouseEvent): void {
  const target = event.target;

  // TypeScript can’t know what type event.target will be before the event happens.
  // This if ensures both runtime safety and type safety.
  if (!(target instanceof HTMLElement)) return;

  const blogListEl = target.closest<HTMLElement>(".blog-post");
  if (blogListEl === null) return;

  if (target.closest(".delete-post-button"))
    deleteBlogPost(blogListEl, blogPostListEl!);
  if (target.closest(".edit-post-button"))
    editBlogPost(blogListEl, blogPostListEl!);
}

function addDummyData() {
  Array.from(dummyBlogPosts).forEach((dummyBlogPost) => {
    blogPostListEl?.appendChild(createBlogPostEl(dummyBlogPost));
  });
}
