import React, { useState, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { chatService } from '@/lib/chat';
import { Message } from '../../worker/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Sparkles, Code, Cpu, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
export function ArchitectPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    checkConnection();
    loadMessages();
  }, []);
  const checkConnection = async () => {
    try {
      const res = await fetch('/api/health');
      setIsOnline(res.ok);
    } catch {
      setIsOnline(false);
    }
  };
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
    } else {
      setIsOnline(false);
    }
    setIsLoading(false);
  };
  return (
    <AppLayout className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col h-full bg-[#020617] relative">
        <div className="p-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">AI Architect</h1>
              <div className="flex items-center gap-1.5">
                {isOnline === null ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-pulse" />
                ) : isOnline ? (
                  <Wifi className="h-3 w-3 text-emerald-500" />
                ) : (
                  <WifiOff className="h-3 w-3 text-rose-500" />
                )}
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  {isOnline === null ? "Verifying Link..." : isOnline ? "Active Core" : "Core Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {isOnline === false && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-rose-500/50" />
                <h3 className="text-lg font-bold text-white">Connection Interrupted</h3>
                <p className="text-sm text-slate-500 max-w-xs">The Architect is currently unreachable. Check your network or Cloudflare Worker status.</p>
                <Button variant="outline" size="sm" onClick={checkConnection} className="border-white/10 hover:bg-white/5">
                  Retry Protocol
                </Button>
              </div>
            )}
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-4 mb-8", msg.role === 'user' ? "flex-row-reverse" : "")}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
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
                    <div className={cn(msg.role === 'assistant' ? "font-mono text-[13px] text-slate-400 whitespace-pre-wrap" : "")}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {streamingContent && (
                <motion.div
                  key="streaming"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 mb-8"
                >
                  <div className="h-8 w-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-sky-400" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed bg-slate-900 border border-white/5 text-slate-300 rounded-tl-none font-mono text-[13px] whitespace-pre-wrap">
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
          <div className="max-w-4xl mx-auto relative">
            <div className="relative flex items-end gap-2 rounded-2xl bg-slate-900 border border-white/10 p-2 shadow-2xl">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isOnline === false && messages.length === 0}
                placeholder="Describe your next island or schema..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 placeholder:text-slate-600 resize-none py-3 h-[48px] max-h-40 min-h-[48px] overflow-auto scrollbar-hide"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim() || isOnline === false}
                className={cn(
                  "h-10 w-10 flex items-center justify-center rounded-xl transition-all",
                  input.trim() && !isLoading ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "bg-slate-800 text-slate-600"
                )}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}