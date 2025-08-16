import "./CSS/style.css";
import { v4 as generateId } from "uuid";
import * as Constants from "./constants";
import type { IBlogPost } from "./types";
import {
  sortBlogPost,
  buildBlogPostObject,
  deleteBlogPost,
  populateWithLoadedBlogPosts,
  addBlogPost,
} from "./blogPostListServices";
import { editBlogPost } from "./blogPostServices";

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

// Populates with either loaded blogpost or dummy posts
populateWithLoadedBlogPosts(blogPostListEl!);

function handleOnBlogPostFormSubmit(event: SubmitEvent): void {
  // Stops page from reloading
  event.preventDefault();

  const titleInput =
    blogPostFormEl!.querySelector<HTMLInputElement>(".title-text-input");
  const authorInput =
    blogPostFormEl?.querySelector<HTMLInputElement>(".author-text-input");
  const contentInput =
    blogPostFormEl?.querySelector<HTMLInputElement>(".body-text-input");

  const newBlogPost: IBlogPost = buildBlogPostObject(
    generateId(),
    titleInput!.value,
    authorInput!.value,
    new Date(),
    contentInput!.value
  );

  addBlogPost(newBlogPost, blogPostListEl!);
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

// function populateWithLoadedBlogPosts(): void {
//   let blogPosts = getLoadedBlogPosts();

//   if (blogPosts.length == 0) blogPosts = dummyBlogPosts;

//   Array.from(blogPosts).forEach((blogPost) => {
//     addBlogPost(blogPost, blogPostListEl!);
//   });
// }
