"use client";

// components/ChatWidget.tsx
import { useEffect, useRef } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

export default function ChatBot() {
  const ENABLE_CHAT = process.env.NEXT_PUBLIC_ENABLE_CHAT || "false";

  if (ENABLE_CHAT !== "true") {
    return <></>;
  }
  return <ChatBotWidget />;
}
function ChatBotWidget() {
  const chatContainerRef = useRef(null);
  const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_EMBED_URL || "";

  useEffect(() => {
    createChat({
      webhookUrl: WEBHOOK_URL,
      webhookConfig: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      target: "#n8n-chat-container",
      mode: "window",
      chatInputKey: "chatInput",
      chatSessionKey: "sessionId",
      metadata: {},
      showWelcomeScreen: false,
      loadPreviousSession: true,
      defaultLanguage: "id",
      initialMessages: [
        "Halo, Saya Reva 👋",
        "Saya bisa membantu untuk menjawab pertanyaan seputar Standarisasi EMAS ICMI",
      ],
      i18n: {
        id: {
          title: "Halo",
          subtitle: "Selamat datang di Standarisasi EMAS ICMI EMAS ICMI! 👋",
          footer: "",
          getStarted: "New Conversation",
          inputPlaceholder: "Type your question..",
        },
      },
      enableStreaming: false,
      allowFileUploads: false,
      allowedFilesMimeTypes: "",
    });

    // Cleanup function to remove chat when component unmounts
    return () => {
      const chatElement = document.querySelector("#n8n-chat-container");
      if (chatElement) {
        chatElement.innerHTML = "";
      }
    };
  }, []);

  return <div id="n8n-chat-container" ref={chatContainerRef} />;
}
