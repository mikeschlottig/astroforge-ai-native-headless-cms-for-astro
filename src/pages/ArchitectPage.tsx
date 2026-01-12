import React, { useState, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { chatService } from '@/lib/chat';
import { Message } from '../../worker/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Sparkles, Terminal, Code, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
export function ArchitectPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    loadMessages();
  }, []);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);
  const loadMessages = async () => {
    const response = await chatService.getMessages();
    if (response.success && response.data) {
      setMessages(response.data.messages);
    }
  };
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');
    const response = await chatService.sendMessage(
      userMessage.content,
      undefined,
      (chunk) => {
        setStreamingContent(prev => prev + chunk);
      }
    );
    if (response.success) {
      await loadMessages();
      setStreamingContent('');
    }
    setIsLoading(false);
  };
  return (
    <AppLayout className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col h-full bg-[#020617] relative">
        {/* Context Awareness Badge */}
        <div className="absolute top-20 right-8 z-20 pointer-events-none">
          <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/30 text-indigo-400 py-1 px-3 flex items-center gap-2 backdrop-blur-md">
            <Cpu className="h-3 w-3 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-tighter">Content Cosmos Aware</span>
          </Badge>
        </div>
        <div className="p-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">AI Architect</h1>
              <p className="text-[10px] font-mono text-sky-400 uppercase tracking-widest">Phase 2: Active Schema Protocol</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400">CORE SYNCED</span>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1 p-4 md:p-8" ref={scrollAreaRef}>
          <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {messages.length === 0 && !streamingContent && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="h-16 w-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
                  <Sparkles className="h-8 w-8 text-sky-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white tracking-tighter">What are we building today?</h2>
                  <p className="text-slate-500 max-w-sm">I can now see your Content Cosmos. Try: "Add a Price field to the Products collection".</p>
                </div>
              </div>
            )}
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-inner",
                    msg.role === 'user' ? "bg-sky-500" : "bg-slate-800 border border-white/10"
                  )}>
                    {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-sky-400" />}
                  </div>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed",
                    msg.role === 'user'
                      ? "bg-sky-500/10 text-sky-50 border border-sky-500/20 rounded-tr-none"
                      : "bg-slate-900 border border-white/5 text-slate-300 rounded-tl-none font-sans"
                  )}>
                    <div className={cn(msg.role === 'assistant' ? "font-mono text-[13px] text-slate-400" : "")}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {streamingContent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="h-8 w-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-sky-400" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed bg-slate-900 border border-white/5 text-slate-300 rounded-tl-none font-mono text-[13px]">
                    {streamingContent}
                    <span className="inline-block h-4 w-1 bg-sky-400 ml-1 animate-pulse" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </ScrollArea>
        <div className="p-4 md:p-6 border-t border-white/5 bg-slate-950/50">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 opacity-20 blur group-focus-within:opacity-40 transition-opacity duration-500" />
            <div className="relative flex items-end gap-2 rounded-2xl bg-slate-900 border border-white/10 p-2 shadow-2xl">
              <button className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-white transition-colors">
                <Code className="h-5 w-5" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Talk to the Architect about your cosmos..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 placeholder:text-slate-600 resize-none py-3 h-[48px] max-h-40 min-h-[48px] overflow-auto scrollbar-hide"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={cn(
                  "h-10 w-10 flex items-center justify-center rounded-xl transition-all",
                  input.trim() ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "bg-slate-800 text-slate-600 cursor-not-allowed"
                )}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 flex justify-between px-2">
              <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                Astro Intelligence Unit v2.4
              </p>
              <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                Shift+Enter for newline
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}