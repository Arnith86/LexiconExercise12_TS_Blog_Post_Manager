import type { IBlogPost } from "./types";

export const dummyBlogPosts: IBlogPost[] = [
  {
    title: "first post",
    author: "bp",
    content: "With this I want to announce that i have started writing blogs!",
    timeStamp: new Date("2023-05-10T08:30:00"),
  },
  {
    title: "second post",
    author: "ap",
    content: "I found blogs to be boring!",
    timeStamp: new Date("2024-09-15T14:45:00"),
  },
  {
    title: "last post",
    author: "jp",
    content: "I don't want to write blogpost's anymore..",
    timeStamp: new Date("2024-02-20T19:15:00"),
  },
];
