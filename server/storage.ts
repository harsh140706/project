import { type User, type InsertUser, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getAllChatSessions(): Promise<{ sessionId: string; messageCount: number; lastActivity: Date }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chatMessages: Map<string, ChatMessage[]>;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return this.chatMessages.get(sessionId) || [];
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
      response: insertMessage.response || null,
    };
    
    const sessionMessages = this.chatMessages.get(insertMessage.sessionId) || [];
    sessionMessages.push(message);
    this.chatMessages.set(insertMessage.sessionId, sessionMessages);
    
    return message;
  }

  async getAllChatSessions(): Promise<{ sessionId: string; messageCount: number; lastActivity: Date }[]> {
    const sessions = [];
    for (const [sessionId, messages] of this.chatMessages.entries()) {
      const messageCount = messages.length;
      const lastActivity = messages.length > 0 ? messages[messages.length - 1].createdAt! : new Date();
      
      sessions.push({ sessionId, messageCount, lastActivity });
    }
    
    return sessions.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }
}

export const storage = new MemStorage();
