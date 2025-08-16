import * as Constants from "./constants";
import type { IBlogPost } from "./types";

export function savePostsToLocalStorage(storedBlogPosts: IBlogPost[]): void {
  localStorage.setItem(Constants.BLOG_POSTS, JSON.stringify(storedBlogPosts));
}

export function loadPostsFromLocalStorage(): IBlogPost[] {
  const stored = localStorage.getItem(Constants.BLOG_POSTS);
  return stored ? JSON.parse(stored) : [];
}

export function saveSortTypeToLocalStorage(sortType: string): void {
  localStorage.setItem(Constants.SORT_TYPE_KEY, sortType);
}

export function loadSortTypeFromLocalStorage(): string {
  const storedType = localStorage.getItem(Constants.SORT_TYPE_KEY);
  return storedType ? storedType : Constants.TIME;
}
