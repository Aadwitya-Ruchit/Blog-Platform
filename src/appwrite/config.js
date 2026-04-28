import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);

    console.log("[Appwrite] Client initialized with:", {
      endpoint: conf.appwriteUrl,
      projectId: conf.appwriteProjectId,
    });
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      console.log("[Appwrite] Creating post with:", {
        title,
        slug,
        content,
        featuredImage,
        status,
        userId,
      });

      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage, // must be file.$id
          status,
          userId,
        }
      );
    } catch (error) {
      console.error("[Appwrite] createPost error:", error);
      throw error;
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      console.log("[Appwrite] Updating post:", slug, {
        title,
        content,
        featuredImage,
        status,
      });

      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.error("[Appwrite] updatePost error:", error);
      throw error;
    }
  }

  async deletePost(slug) {
    try {
      console.log("[Appwrite] Deleting post:", slug);
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.error("[Appwrite] deletePost error:", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      console.log("[Appwrite] Fetching post:", slug);
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.error("[Appwrite] getPost error:", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      console.log("[Appwrite] Listing posts with queries:", queries);
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.error("[Appwrite] getPosts error:", error);
      return false;
    }
  }

  // ------------------------
  // File services
  // ------------------------
  async uploadFile(file) {
    try {
      console.log("[Appwrite] Uploading file:", file?.name || file);
      const uploadedFile = await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
      console.log("[Appwrite] File uploaded:", uploadedFile);
      return uploadedFile;
    } catch (error) {
      console.error("[Appwrite] uploadFile error:", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      console.log("[Appwrite] Deleting file:", fileId);
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error("[Appwrite] deleteFile error:", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    console.log("[Appwrite] Generating preview for file:", fileId);
    return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
  }
}

const service = new Service();
export default service;
