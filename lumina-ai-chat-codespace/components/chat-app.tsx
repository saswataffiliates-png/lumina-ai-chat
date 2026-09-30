"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  Copy,
  Menu,
  MessageSquarePlus,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

const starters = [
  { icon: "✦", title: "Brainstorm ideas", text: "Give me 5 creative ideas for a small online business." },
  { icon: "⌘", title: "Write something", text: "Write a short, friendly launch announcement for my app." },
  { icon: "◌", title: "Explain a topic", text: "Explain how APIs work like I’m a beginner." },
];

const initialMessage: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey! I’m Lumina. Ask me anything, or pick one of the ideas below to get started.",
};

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function titleFrom(text: string) {
  return text.trim().slice(0, 34) || "New conversation";
}

export default function ChatApp() {
  const [chats, setChats] = useState<Chat[]>([
    { id: "first", title: "Welcome to Lumina", messages: [initialMessage] },
  ]);
  const [activeId, setActiveId] = useState("first");
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((chat) => chat.id === activeId) ?? chats[0];

  const groupedChats = useMemo(() => {
    return { today: chats };
  }, [chats]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isSending]);

  function createChat() {
    const id = makeId();
    setChats((current) => [
      { id, title: "New conversation", messages: [] },
      ...current,
    ]);
    setActiveId(id);
    setInput("");
    setSidebarOpen(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  function updateActiveMessages(next: Message[]) {
    setChats((current) =>
      current.map((chat) =>
        chat.id === activeId ? { ...chat, messages: next } : chat
      )
    );
  }

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    const userMessage: Message = { id: makeId(), role: "user", content: text };
    const nextMessages = [...(activeChat?.messages ?? []), userMessage];

    setChats((current) =>
      current.map((chat) =>
        chat.id === activeId
          ? {
              ...chat,
              title: chat.messages.length === 0 ? titleFrom(text) : chat.title,
              messages: nextMessages,
            }
          : chat
      )
    );
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");

      updateActiveMessages([
        ...nextMessages,
        { id: makeId(), role: "assistant", content: data.message },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      updateActiveMessages([
        ...nextMessages,
        {
          id: makeId(),
          role: "assistant",
          content: `I couldn't complete that request.\n\n${message}`,
        },
      ]);
    } finally {
      setIsSending(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }

  async function copyMessage(message: Message) {
    await navigator.clipboard.writeText(message.content);
    setCopiedId(message.id);
    setTimeout(() => setCopiedId(null), 1200);
  }

  function useStarter(text: string) {
    setInput(text);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={18} /></div>
          <span>Lumina</span>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        <button className="new-chat" onClick={createChat}>
          <MessageSquarePlus size={18} />
          <span>New chat</span>
          <span className="shortcut">⌘ K</span>
        </button>

        <div className="sidebar-search">
          <Search size={16} />
          <input placeholder="Search chats" aria-label="Search chats" />
        </div>

        <div className="chat-list">
          <div className="list-label">Today</div>
          {groupedChats.today.map((chat) => (
            <button
              key={chat.id}
              className={`chat-row ${chat.id === activeId ? "active" : ""}`}
              onClick={() => {
                setActiveId(chat.id);
                setSidebarOpen(false);
              }}
            >
              <MessageSquarePlus size={16} />
              <span>{chat.title}</span>
              <MoreHorizontal size={16} className="row-more" />
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="profile">
            <div className="avatar">Y</div>
            <div>
              <strong>Your workspace</strong>
              <span>Personal</span>
            </div>
            <ChevronDown size={15} />
          </div>
        </div>
      </aside>

      <section className="chat-panel">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
            <Menu size={20} />
          </button>
          <div className="model-picker">
            <div className="mini-mark"><Bot size={16} /></div>
            <div>
              <strong>Lumina AI</strong>
              <span>Smart assistant</span>
            </div>
            <ChevronDown size={15} />
          </div>
          <button className="icon-button" aria-label="More options">
            <MoreHorizontal size={20} />
          </button>
        </header>

        <div className="conversation">
          <div className="message-column">
            {activeChat?.messages.length === 0 ? (
              <div className="welcome">
                <div className="welcome-orb"><Sparkles size={28} /></div>
                <h1>What can I help you with?</h1>
                <p>Ask a question, explore an idea, or start building something.</p>
                <div className="starter-grid">
                  {starters.map((starter) => (
                    <button key={starter.title} onClick={() => useStarter(starter.text)}>
                      <span className="starter-icon">{starter.icon}</span>
                      <span>
                        <strong>{starter.title}</strong>
                        <small>{starter.text}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {activeChat.messages.map((message) => (
                  <article key={message.id} className={`message ${message.role}`}>
                    <div className="message-avatar">
                      {message.role === "assistant" ? <Sparkles size={15} /> : <User size={15} />}
                    </div>
                    <div className="message-body">
                      <div className="message-name">
                        {message.role === "assistant" ? "Lumina" : "You"}
                      </div>
                      <div className="message-content">{message.content}</div>
                      {message.role === "assistant" && (
                        <div className="message-actions">
                          <button onClick={() => copyMessage(message)}>
                            <Copy size={13} /> {copiedId === message.id ? "Copied" : "Copy"}
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
                {activeChat.messages.length === 1 && activeChat.messages[0].role === "assistant" && (
                  <div className="starter-grid inline-starters">
                    {starters.map((starter) => (
                      <button key={starter.title} onClick={() => useStarter(starter.text)}>
                        <span className="starter-icon">{starter.icon}</span>
                        <span><strong>{starter.title}</strong><small>{starter.text}</small></span>
                      </button>
                    ))}
                  </div>
                )}
                {isSending && (
                  <article className="message assistant">
                    <div className="message-avatar"><Sparkles size={15} /></div>
                    <div className="message-body">
                      <div className="message-name">Lumina</div>
                      <div className="typing"><i /><i /><i /></div>
                    </div>
                  </article>
                )}
              </>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="composer-wrap">
          <form className="composer" onSubmit={sendMessage}>
            <div className="composer-tools">
              <button type="button" className="tool-button" aria-label="Attach file">
                <Paperclip size={18} />
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Message Lumina..."
              rows={1}
              aria-label="Message Lumina"
            />
            <button
              className={`send-button ${input.trim() ? "ready" : ""}`}
              type="submit"
              disabled={!input.trim() || isSending}
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </form>
          <p className="composer-note">
            Lumina can make mistakes. Check important information.
          </p>
        </div>
      </section>
    </main>
  );
}