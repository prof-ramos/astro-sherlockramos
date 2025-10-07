/**
 * Cliente principal para integração com Strapi CMS
 */

import type {
  StrapiConfig,
  BlogPost,
  Author,
  Category,
  Tag,
  StrapiResponse,
  GetPostsParams,
  SearchParams
} from '../types/strapi';

class StrapiClient {
  private baseURL: string;
  private apiToken: string;

  constructor(config: StrapiConfig) {
    this.baseURL = config.baseURL;
    this.apiToken = config.apiToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...(this.apiToken && { Authorization: `Bearer ${this.apiToken}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Buscar posts do blog com paginação e filtros
   */
  async getBlogPosts(params: GetPostsParams = {}): Promise<StrapiResponse<BlogPost[]>> {
    const {
      page = 1,
      pageSize = 10,
      sort = 'publishedDate:desc',
      filters = {},
      populate = ['author', 'categories', 'tags', 'heroImage']
    } = params;

    const queryParams = new URLSearchParams({
      'pagination[page]': page.toString(),
      'pagination[pageSize]': pageSize.toString(),
      'sort': sort,
      'populate': populate.join(','),
    });

    // Adicionar filtros se existirem
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([filterKey, filterValue]) => {
            if (filterValue !== undefined && filterValue !== null) {
              queryParams.append(`filters[${key}][${filterKey}]`, String(filterValue));
            }
          });
        } else {
          queryParams.append(`filters[${key}]`, String(value));
        }
      }
    });

    return this.request<StrapiResponse<BlogPost[]>>(
      `/api/blog-posts?${queryParams.toString()}`
    );
  }

  /**
   * Buscar post individual por slug
   */
  async getBlogPostBySlug(slug: string): Promise<StrapiResponse<BlogPost>> {
    return this.request<StrapiResponse<BlogPost>>(
      `/api/blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=author,categories,tags,heroImage`
    );
  }

  /**
   * Buscar todas as categorias
   */
  async getCategories(): Promise<StrapiResponse<Category[]>> {
    return this.request<StrapiResponse<Category[]>>(
      '/api/categories?sort=name:asc'
    );
  }

  /**
   * Buscar posts por categoria
   */
  async getPostsByCategory(categoryId: number, params: GetPostsParams = {}): Promise<StrapiResponse<BlogPost[]>> {
    return this.getBlogPosts({
      ...params,
      filters: {
        ...params.filters,
        categories: [categoryId],
      },
    });
  }

  /**
   * Buscar posts relacionados
   */
  async getRelatedPosts(currentPostId: number, limit: number = 3): Promise<StrapiResponse<BlogPost[]>> {
    return this.getBlogPosts({
      pageSize: limit,
      filters: {
        // Excluir o post atual
        id: { $ne: currentPostId },
      },
    });
  }

  /**
   * Buscar posts por busca textual
   */
  async searchPosts(params: SearchParams): Promise<StrapiResponse<BlogPost[]>> {
    const { query, page = 1, pageSize = 10 } = params;

    const queryParams = new URLSearchParams({
      'pagination[page]': page.toString(),
      'pagination[pageSize]': pageSize.toString(),
      'filters[$or][0][title][$containsi]': query,
      'filters[$or][1][description][$containsi]': query,
      'populate': 'author,categories,tags,heroImage',
    });

    return this.request<StrapiResponse<BlogPost[]>>(
      `/api/blog-posts?${queryParams.toString()}`
    );
  }

  /**
   * Buscar autores
   */
  async getAuthors(): Promise<StrapiResponse<Author[]>> {
    return this.request<StrapiResponse<Author[]>>(
      '/api/authors?populate=avatar&sort=name:asc'
    );
  }

  /**
   * Buscar tags
   */
  async getTags(): Promise<StrapiResponse<Tag[]>> {
    return this.request<StrapiResponse<Tag[]>>(
      '/api/tags?sort=name:asc'
    );
  }

  /**
   * Gerar URL otimizada para imagens
   */
  getOptimizedImageUrl(image: any, format: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'): string {
    if (!image?.url) return '';

    // Se for desenvolvimento local, usar URL relativa
    if (image.url.startsWith('/')) {
      return `${this.baseURL}${image.url}`;
    }

    // Para produção, usar formatos otimizados se disponíveis
    if (image.formats?.[format]) {
      return `${this.baseURL}${image.formats[format].url}`;
    }

    return `${this.baseURL}${image.url}`;
  }

  /**
   * Calcular tempo de leitura baseado no conteúdo
   */
  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  /**
   * Formatar data do Strapi para exibição
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

// Configuração padrão - Astro usa uma abordagem diferente para variáveis de ambiente
const defaultConfig: StrapiConfig = {
  baseURL: (globalThis as any).import_meta_env?.STRAPI_BASE_URL || 'http://localhost:1337',
  apiToken: (globalThis as any).import_meta_env?.STRAPI_API_TOKEN || '',
  webhooks: {
    secret: (globalThis as any).import_meta_env?.STRAPI_WEBHOOK_SECRET || '',
    events: ['entry.create', 'entry.update', 'entry.delete', 'entry.publish', 'entry.unpublish'],
  },
};

// Instância singleton do cliente
let strapiClient: StrapiClient | null = null;

export function getStrapiClient(): StrapiClient {
  if (!strapiClient) {
    strapiClient = new StrapiClient(defaultConfig);
  }
  return strapiClient;
}

// Exportar tipos e funções auxiliares
export type { BlogPost, Author, Category, Tag, GetPostsParams, SearchParams };
export { StrapiClient };
