/**
 * Camada de serviço para gerenciamento de conteúdo do Strapi
 * Fornece funções de alto nível para operações comuns do blog
 */

import { getStrapiClient, type BlogPost, type Author, type Category, type Tag } from '../lib/strapi';

export class ContentManager {
  private client = getStrapiClient();

  /**
   * Buscar posts para a página inicial com paginação
   */
  async getPostsForHomePage(page: number = 1, pageSize: number = 10) {
    try {
      const response = await this.client.getBlogPosts({
        page,
        pageSize,
        sort: 'publishedDate:desc',
        filters: {
          publishedDate: {
            $lte: new Date().toISOString(),
          },
        },
      });

      return {
        posts: response.data,
        pagination: {
          page: response.meta.pagination?.page || 1,
          totalPages: response.meta.pagination?.pageCount || 1,
          totalPosts: response.meta.pagination?.total || 0,
        },
      };
    } catch (error) {
      console.error('Erro ao buscar posts para home:', error);
      throw new Error('Falha ao carregar posts');
    }
  }

  /**
   * Buscar post individual por slug
   */
  async getPostBySlug(slug: string) {
    try {
      const response = await this.client.getBlogPostBySlug(slug);

      if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        throw new Error('Post não encontrado');
      }

      // A API retorna um array, pegar o primeiro item
      const post = Array.isArray(response.data) ? response.data[0] : response.data;
      return post;
    } catch (error) {
      console.error('Erro ao buscar post:', error);
      throw error;
    }
  }

  /**
   * Buscar posts relacionados para um post específico
   */
  async getRelatedPosts(postId: number, limit: number = 3) {
    try {
      const response = await this.client.getRelatedPosts(postId, limit);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar posts relacionados:', error);
      return [];
    }
  }

  /**
   * Buscar posts por categoria
   */
  async getPostsByCategory(categoryId: number, page: number = 1) {
    try {
      const response = await this.client.getPostsByCategory(categoryId, {
        page,
        sort: 'publishedDate:desc',
      });

      return {
        posts: response.data,
        pagination: {
          page: response.meta.pagination?.page || 1,
          totalPages: response.meta.pagination?.pageCount || 1,
          totalPosts: response.meta.pagination?.total || 0,
        },
      };
    } catch (error) {
      console.error('Erro ao buscar posts por categoria:', error);
      throw new Error('Falha ao carregar posts da categoria');
    }
  }

  /**
   * Buscar categorias para navegação
   */
  async getCategories() {
    try {
      const response = await this.client.getCategories();
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  }

  /**
   * Buscar autores
   */
  async getAuthors() {
    try {
      const response = await this.client.getAuthors();
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar autores:', error);
      return [];
    }
  }

  /**
   * Buscar tags
   */
  async getTags() {
    try {
      const response = await this.client.getTags();
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
      return [];
    }
  }

  /**
   * Buscar posts em destaque
   */
  async getFeaturedPosts(limit: number = 5) {
    try {
      const response = await this.client.getBlogPosts({
        pageSize: limit,
        filters: {
          featured: true,
          publishedDate: {
            $lte: new Date().toISOString(),
          },
        },
        sort: 'publishedDate:desc',
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar posts em destaque:', error);
      return [];
    }
  }

  /**
   * Buscar posts recentes
   */
  async getRecentPosts(limit: number = 5) {
    try {
      const response = await this.client.getBlogPosts({
        pageSize: limit,
        sort: 'publishedDate:desc',
        filters: {
          publishedDate: {
            $lte: new Date().toISOString(),
          },
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar posts recentes:', error);
      return [];
    }
  }

  /**
   * Função de busca geral
   */
  async searchPosts(query: string, page: number = 1, pageSize: number = 10) {
    try {
      const response = await this.client.searchPosts({
        query,
        page,
        pageSize,
      });

      return {
        posts: response.data,
        pagination: {
          page: response.meta.pagination?.page || 1,
          totalPages: response.meta.pagination?.pageCount || 1,
          totalPosts: response.meta.pagination?.total || 0,
        },
      };
    } catch (error) {
      console.error('Erro na busca:', error);
      throw new Error('Falha na busca de posts');
    }
  }

  /**
   * Formatar post para exibição
   */
  formatPostForDisplay(post: BlogPost) {
    return {
      ...post,
      formattedDate: this.client.formatDate(post.publishedDate),
      readingTime: post.readingTime || this.client.calculateReadingTime(post.content),
      heroImageUrl: this.client.getOptimizedImageUrl(post.heroImage, 'large'),
      authorName: post.author?.name || 'Autor desconhecido',
      authorAvatar: post.author?.avatar ? this.client.getOptimizedImageUrl(post.author.avatar, 'thumbnail') : null,
      categoryNames: post.categories?.map(cat => cat.name) || [],
      tagNames: post.tags?.map(tag => tag.name) || [],
    };
  }

  /**
   * Verificar se há conexão com o Strapi
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.getCategories();
      return true;
    } catch (error) {
      console.error('Health check falhou:', error);
      return false;
    }
  }
}

// Instância singleton
let contentManager: ContentManager | null = null;

export function getContentManager(): ContentManager {
  if (!contentManager) {
    contentManager = new ContentManager();
  }
  return contentManager;
}
