import { BlogSource } from "../types";

export const defaultSources: BlogSource[] = [
  {
    id: "music-in",
    name: "music-in tistory",
    url: "https://music-in.tistory.com/category/찬양팀 악보",
    type: "tistory",
    enabled: true
  },
  {
    id: "god-is-with-me",
    name: "god-is-with-me tistory",
    url: "https://god-is-with-me.tistory.com/category/찬양악보",
    type: "tistory",
    enabled: true
  },
  {
    id: "godinthebible",
    name: "godinthebible naver",
    url: "https://blog.naver.com/godinthebible",
    type: "naver",
    enabled: true
  },
  {
    id: "relishsky",
    name: "relishsky naver",
    url: "https://m.blog.naver.com/PostList.naver?blogId=relishsky&categoryName=CCM&categoryNo=50",
    type: "naver",
    enabled: true
  }
];
