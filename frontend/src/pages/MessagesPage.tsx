import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetConversations, useGetConversation, useSendMessage } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { ScrollArea } from '../components/ui/scroll-area';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { MessageCircle, Send, ArrowLeft, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

export default function MessagesPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const [selectedConversation, setSelectedConversation] = useState<Principal | null>(null);
  const [messageText, setMessageText] = useState('');

  const { data: conversations, isLoading: conversationsLoading } = useGetConversations();
  const { data: messages, isLoading: messagesLoading } = useGetConversation(selectedConversation);
  const sendMessage = useSendMessage();

  const isAuthenticated = !!identity;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      await sendMessage.mutateAsync({
        receiverId: selectedConversation,
        content: messageText.trim(),
      });
      setMessageText('');
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    }
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!isAuthenticated) {
    return (
      <div className="container px-4 py-12">
        <Card className="max-w-md mx-auto text-center border-2 border-dashed">
          <CardContent className="pt-12 pb-8 space-y-4">
            <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <MessageCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Connect with Sellers</h2>
            <p className="text-muted-foreground">
              Login to chat with buyers and sellers
            </p>
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              className="gap-2 mt-4"
              size="lg"
            >
              <LogIn className="h-4 w-4" />
              {loginStatus === 'logging-in' ? 'Logging in...' : 'Login to Continue'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Conversation List View
  if (!selectedConversation) {
    return (
      <div className="container px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Messages</h1>
              <p className="text-muted-foreground">
                {conversations?.length || 0} conversation{conversations?.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        {conversationsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : !conversations || conversations.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-16 text-center space-y-3">
              <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <h3 className="text-xl font-bold">No messages yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Start a conversation by contacting a seller from their product listing
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <Card
                key={conv.userId.toString()}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-98 border-2 hover:border-primary/50"
                onClick={() => setSelectedConversation(conv.userId)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                        {conv.userName?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold truncate">
                          {conv.userName || 'User'}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Chat View
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Header */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedConversation(null)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
              U
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-bold">Seller</h2>
            <p className="text-xs text-muted-foreground">
              {selectedConversation.toString().slice(0, 10)}...
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        {messagesLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-3/4" />
            ))}
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.sender.toString() === identity?.getPrincipal().toString();
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm break-words">{message.content}</p>
                    <p className={`text-[10px] mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-border bg-card px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!messageText.trim() || sendMessage.isPending}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
