export interface AddPostDTO {
  image?: any[];
  video?: any;
  described: string;
  status?: string;
  auto_accept?: string;
}

export interface TAuthor {
  id: string;
  name: string;
  avatar?: string;
}

export interface TPost {
  id: string;
  name: string;
  image: {id: string; url: string}[];
  described: string;
  created: string;
  feel: string;
  comment_mark: string;
  is_felt: string;
  is_blocked: string;
  can_edit: string;
  banned: string;
  state: string;
  author: TAuthor;
}
export interface TAuthorDetail {
  id: string;
  name: string;
  avatar: string;
  coins: string;
  listing: any[];
}

interface TCategory {
  id: string;
  has_name: string;
  name: string;
}

export interface TPostDetail {
  id: string;
  name: string;
  created: string;
  described: string;
  modified: string;
  fake: string;
  trust: string;
  kudos: string;
  disappointed: string;
  is_felt: string;
  is_marked: string;
  your_mark: string;
  image: {id: string; url: string}[];
  video: string;
  author: TAuthor;
  category: TCategory;
  state: string;
  is_blocked: string;
  can_edit: string;
  banned: string;
  can_mark: string;
  can_rate: string;
  url: string;
  messages: string;
  deleted: string;
}
export type GetListPostsDTO = {
  user_id: string;
  in_campaign?: string;
  campaign_id?: string;
  latitude?: string;
  longitude?: string;
  last_id?: string;
  index: string;
  count: string;
};
export type ReportPostDTO = {id: string; subject: string; detail: string};
