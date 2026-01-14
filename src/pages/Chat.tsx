import { useState } from 'react';
import { mockCustomers } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  MoreHorizontal,
  Search,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'business';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  unreadCount: number;
  messages: Message[];
}

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    customerId: 'cust-1',
    customerName: 'Maria Silva',
    lastMessage: 'Olá! Gostaria de saber se ainda tem a pizza de calabresa disponível?',
    lastMessageTime: '10:30',
    unread: true,
    unreadCount: 2,
    messages: [
      {
        id: 'msg-1',
        text: 'Olá! Gostaria de saber se ainda tem a pizza de calabresa disponível?',
        sender: 'customer',
        timestamp: '10:30',
        status: 'read'
      },
      {
        id: 'msg-2',
        text: 'Olá Maria! Sim, temos pizza de calabresa disponível. Gostaria de fazer um pedido?',
        sender: 'business',
        timestamp: '10:32',
        status: 'delivered'
      },
      {
        id: 'msg-3',
        text: 'Sim, por favor. Uma pizza grande de calabresa.',
        sender: 'customer',
        timestamp: '10:35',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-2',
    customerId: 'cust-3',
    customerName: 'Ana Costa',
    lastMessage: 'Obrigada pelo atendimento! 😊',
    lastMessageTime: '09:15',
    unread: false,
    unreadCount: 0,
    messages: [
      {
        id: 'msg-4',
        text: 'Obrigada pelo atendimento! 😊',
        sender: 'customer',
        timestamp: '09:15',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-3',
    customerId: 'cust-2',
    customerName: 'João Santos',
    lastMessage: 'Qual o horário de funcionamento hoje?',
    lastMessageTime: 'Ontem',
    unread: false,
    unreadCount: 0,
    messages: [
      {
        id: 'msg-5',
        text: 'Qual o horário de funcionamento hoje?',
        sender: 'customer',
        timestamp: 'Ontem',
        status: 'read'
      }
    ]
  }
];

export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
  const [search, setSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.customerName.toLowerCase().includes(search.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      sender: 'business',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          lastMessage: newMessage,
          lastMessageTime: 'Agora',
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation({
      ...selectedConversation,
      lastMessage: newMessage,
      lastMessageTime: 'Agora',
      messages: [...selectedConversation.messages, newMsg]
    });
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusIcon = (status: 'sent' | 'delivered' | 'read') => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-background">
      {/* Conversations List */}
      <Card className="w-80 gradient-border-card flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold gradient-text">Chat</h1>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar conversas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-0">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-muted' : ''
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={conversation.customerAvatar} />
                  <AvatarFallback>
                    {conversation.customerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium truncate">{conversation.customerName}</h3>
                    <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    {conversation.unread && (
                      <Badge variant="destructive" className="ml-2">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col border-l border-border"> {/* Added border-l for separation */}
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedConversation.customerAvatar} />
                  <AvatarFallback>
                    {selectedConversation.customerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{selectedConversation.customerName}</h2>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === 'business' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'customer' && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={selectedConversation.customerAvatar} />
                      <AvatarFallback>
                        {selectedConversation.customerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.sender === 'business'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${
                      message.sender === 'business' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      <span className="text-xs">{message.timestamp}</span>
                      {message.sender === 'business' && getStatusIcon(message.status)}
                    </div>
                  </div>
                  {message.sender === 'business' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>DS</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite uma mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Selecione uma conversa</h3>
              <p className="text-muted-foreground">Escolha uma conversa para começar a chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}