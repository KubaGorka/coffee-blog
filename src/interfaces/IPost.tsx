export interface IPost {
  ID: string;
  Author: string;
  Content: string;
  Image: string;
  Name: string;
  Date: number;
}
export interface INewPost {
  Content: string;
  Image: File;
  Name: string;
}
