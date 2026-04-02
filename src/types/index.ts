export type Role = "reader" | "writer" | "admin";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  profileImage: string | null;
  role: Role;
  isVerified: boolean;
  createdAt: number;
}

export type BlockType = "h1" | "h2" | "p" | "image" | "quote" | "table" | "youtube" | "webview" | "cta" | "banner";

export interface EditorBlock {
  id: string;
  type: BlockType;
  content: string;
  imageSize?: string;
  highlightColor?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  blocks: EditorBlock[];
  authorId: string;
  authorName: string;
  authorImage: string | null;
  published: boolean;
  createdAt: number;
  updatedAt: number;
  slug: string;
}
