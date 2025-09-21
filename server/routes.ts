import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getCareerAdvice } from "./services/openai";
import { insertChatMessageSchema } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint for career advice
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const chatSessionId = sessionId || randomUUID();
      
      // Get AI response
      const careerResponse = await getCareerAdvice(message);
      
      // Store the message and response
      const savedMessage = await storage.createChatMessage({
        sessionId: chatSessionId,
        message,
        response: careerResponse,
      });
      
      res.json({
        sessionId: chatSessionId,
        response: careerResponse,
        messageId: savedMessage.id,
      });
    } catch (error) {
      console.error("Chat endpoint error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to process your request" 
      });
    }
  });

  // Get chat history for a session
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json({ messages });
    } catch (error) {
      console.error("Chat history error:", error);
      res.status(500).json({ error: "Failed to retrieve chat history" });
    }
  });

  // Get all chat sessions overview
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllChatSessions();
      res.json({ sessions });
    } catch (error) {
      console.error("Sessions overview error:", error);
      res.status(500).json({ error: "Failed to retrieve sessions" });
    }
  });



  // Export chat history for analysis
  app.get("/api/export/:sessionId?", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      if (sessionId) {
        // Export specific session
        const messages = await storage.getChatMessages(sessionId);
        res.json({
          sessionId,
          exportDate: new Date().toISOString(),
          messageCount: messages.length,
          messages: messages.map(msg => ({
            id: msg.id,
            message: msg.message,
            response: msg.response,
            createdAt: msg.createdAt
          }))
        });
      } else {
        // Export all sessions summary
        const sessions = await storage.getAllChatSessions();
        res.json({
          exportDate: new Date().toISOString(),
          totalSessions: sessions.length,
          sessions
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ error: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
