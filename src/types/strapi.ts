/**
 * Tipos TypeScript para integração com Strapi CMS
 * Baseado nos schemas definidos no Strapi
 */

// Tipos base do Strapi
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiImage {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
}

export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

// Tipos de conteúdo do blog
export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  publishedDate: string;
  heroImage: StrapiImage;
  author: Author;
  categories: Category[];
  tags: Tag[];
  featured: boolean;
  readingTime: number;
}

export interface Author {
  id: number;
  documentId: string;
  name: string;
  email: string;
  bio: string;
  avatar: StrapiImage;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Configuração da API
export interface StrapiConfig {
  baseURL: string;
  apiToken: string;
  webhooks: {
    secret: string;
    events: string[];
  };
}

// Props para páginas Astro
export interface BlogPageProps {
  posts: BlogPost[];
  pagination: {
    page: number;
    totalPages: number;
    totalPosts: number;
  };
  categories: Category[];
}

export interface BlogPostProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  author: Author;
}

// Parâmetros para consultas à API
export interface GetPostsParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  filters?: {
    featured?: boolean;
    categories?: number[];
    tags?: number[];
    author?: number;
    id?: { $ne?: number };
    publishedDate?: {
      $gte?: string;
      $lte?: string;
    };
  };
  populate?: string[];
}

export interface SearchParams {
  query: string;
  page?: number;
  pageSize?: number;
}
