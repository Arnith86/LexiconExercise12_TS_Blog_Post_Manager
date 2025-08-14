import type { IBlogPost } from "./types";

export const dummyBlogPosts: IBlogPost[] = [
  {
    title: "first post",
    author: "jp",
    content: "With this I want to announce that i have started writing blogs!",
    timeStamp: new Date(),
  },
  {
    title: "second post",
    author: "jp",
    content: "I found blogs to be boring!",
    timeStamp: new Date(),
  },
  {
    title: "last post",
    author: "jp",
    content: "I don't want to write blogpost's anymore..",
    timeStamp: new Date(),
  },
];
