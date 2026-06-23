import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, fetchMessages, addMessage } from '../features/chat/chatSlice';
import { MessageSquare, Send, Search, Smile, Circle, ArrowLeft, Sparkles } from 'lucide-react';
import { io } from 'socket.io-client';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';

const Chat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { contacts, messages, contactsLoading, messagesLoading } = useSelector((state) => state.chat);

  const [selectedContact, setSelectedContact] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOtherUserTyping]);

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  // Socket.io Connection & Listeners
  useEffect(() => {
    if (!user?.id) return;

    // Detect server url based on environment
    const socketUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'http://localhost:8080' 
      : window.location.origin;

    const socket = io(socketUrl);
    socketRef.current = socket;

    // Register current user
    socket.emit('register_user', user.id);

    // Listen for online users update
    socket.on('get_online_users', (userIds) => {
      setOnlineUserIds(userIds);
    });

    // Listen for incoming messages
    socket.on('receive_message', (message) => {
      // If the incoming message is from the active selected contact, add to list
      if (selectedContact && (message.sender === selectedContact._id || message.receiver === selectedContact._id)) {
        dispatch(addMessage(message));
      }
      // Refresh contacts list to update last messages
      dispatch(fetchContacts());
    });

    // Listen for message sent confirmation
    socket.on('message_sent', (message) => {
      dispatch(addMessage(message));
      dispatch(fetchContacts());
    });

    // Listen for typing statuses
    socket.on('typing_status', (data) => {
      if (selectedContact && data.sender === selectedContact._id) {
        setIsOtherUserTyping(data.isTyping);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id, selectedContact?._id, dispatch]);

  // Fetch messages when selected contact changes
  useEffect(() => {
    if (selectedContact?._id) {
      dispatch(fetchMessages(selectedContact._id));
      setIsOtherUserTyping(false);
    }
  }, [selectedContact, dispatch]);

  // Handle typing status triggers
  const handleInputChange = (e) => {
    setTypedMessage(e.target.value);

    if (!socketRef.current || !selectedContact) return;

    // Send typing status
    socketRef.current.emit('typing', {
      sender: user.id,
      receiver: selectedContact._id,
    });

    // Debounce stop_typing status
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('stop_typing', {
        sender: user.id,
        receiver: selectedContact._id,
      });
    }, 2000);
  };

  // Handle Send Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedContact || !socketRef.current) return;

    // Emit send_message socket event
    socketRef.current.emit('send_message', {
      sender: user.id,
      receiver: selectedContact._id,
      message: typedMessage.trim(),
    });

    // Clear typing timeout and stop typing instantly
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketRef.current.emit('stop_typing', {
      sender: user.id,
      receiver: selectedContact._id,
    });

    setTypedMessage('');
  };

  // Filter contacts by search
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden bg-black text-white h-screen">
        <Navbar />
        
        <main className="flex-1 flex overflow-hidden pt-16 pb-20 md:pb-0 h-full">
          {/* Main container with glassmorphic cards */}
          <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 md:p-6 gap-6 h-full overflow-hidden">
            
            {/* Contacts Sidebar List */}
            <div className={`w-full md:w-80 lg:w-96 flex flex-col glass-card rounded-3xl overflow-hidden h-full ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-syne font-bold flex items-center gap-2">
                    <MessageSquare className="text-fuchsia-500 w-5 h-5" /> Chats
                  </h2>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400 font-medium">
                    {onlineUserIds.length - 1 > 0 ? `${onlineUserIds.length - 1} Online` : '0 Online'}
                  </span>
                </div>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search followers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                  />
                </div>
              </div>

              {/* Contacts List */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2 space-y-1">
                {contactsLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <span className="animate-spin rounded-full h-6 w-6 border-2 border-violet-500 border-t-transparent"></span>
                  </div>
                ) : filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => {
                    const isOnline = onlineUserIds.includes(contact._id);
                    const isSelected = selectedContact?._id === contact._id;
                    return (
                      <button
                        key={contact._id}
                        onClick={() => setSelectedContact(contact)}
                        className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition duration-200 ${
                          isSelected ? 'bg-white/10 border border-white/10 shadow-lg' : 'hover:bg-white/5'
                        }`}
                      >
                        {/* Avatar Column */}
                        <div className="relative flex-shrink-0">
                          {contact.avatar ? (
                            <img
                              src={contact.avatar}
                              alt={contact.name}
                              className="w-12 h-12 rounded-full object-cover border border-white/10"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-lg text-white">
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          {/* Online status indicator */}
                          <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-black ${isOnline ? 'bg-green-500' : 'bg-zinc-600'}`}></span>
                        </div>

                        {/* Name & last message details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-semibold truncate text-sm ${contact.lastMessage && contact.lastMessage.sender !== user.id && !contact.lastMessage.isRead ? 'text-white font-bold' : ''}`}>{contact.name}</h3>
                            {contact.lastMessage && (
                              <span className={`text-[10px] ${contact.lastMessage.sender !== user.id && !contact.lastMessage.isRead ? 'text-fuchsia-400 font-bold' : 'text-gray-500'}`}>
                                {new Date(contact.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs truncate ${contact.lastMessage && contact.lastMessage.sender !== user.id && !contact.lastMessage.isRead ? 'text-white font-medium' : 'text-gray-400'}`}>
                            {contact.lastMessage ? (
                              contact.lastMessage.sender === user.id ? (
                                `You: ${contact.lastMessage.message}`
                              ) : (
                                contact.lastMessage.message
                              )
                            ) : (
                              contact.bio || 'Tap to chat'
                            )}
                          </p>
                        </div>
                        {contact.lastMessage && contact.lastMessage.sender !== user.id && !contact.lastMessage.isRead && (
                          <div className="w-2.5 h-2.5 bg-fuchsia-500 rounded-full ml-2 shrink-0"></div>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500 text-sm">
                    No contacts found.
                  </div>
                )}
              </div>
            </div>

            {/* Conversation Window */}
            <div className={`flex-1 flex flex-col glass-card rounded-3xl overflow-hidden h-full ${!selectedContact ? 'hidden md:flex' : 'flex'}`}>
              {selectedContact ? (
                <>
                  {/* Chat Window Header */}
                  <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedContact(null)}
                        className="md:hidden p-1 hover:bg-white/10 rounded-full transition"
                      >
                        <ArrowLeft className="w-6 h-6" />
                      </button>
                      <div className="relative">
                        {selectedContact.avatar ? (
                          <img
                            src={selectedContact.avatar}
                            alt={selectedContact.name}
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white">
                            {selectedContact.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${onlineUserIds.includes(selectedContact._id) ? 'bg-green-500' : 'bg-zinc-600'}`}></span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm leading-tight">{selectedContact.name}</h3>
                        <p className="text-[10px] text-gray-400">
                          {onlineUserIds.includes(selectedContact._id) ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messagesLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <span className="animate-spin rounded-full h-8 w-8 border-2 border-violet-500 border-t-transparent"></span>
                      </div>
                    ) : messages.length > 0 ? (
                      messages.map((message) => {
                        const isOwn = message.sender === user.id;
                        return (
                          <div
                            key={message._id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="max-w-[70%] flex flex-col">
                              <div
                                className={`px-4 py-2.5 rounded-2xl text-sm shadow-md ${
                                  isOwn
                                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-tr-none'
                                    : 'bg-white/10 border border-white/10 text-white rounded-tl-none'
                                }`}
                              >
                                {message.message}
                              </div>
                              <span className={`text-[9px] text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-12 gap-3">
                        <Sparkles className="w-10 h-10 text-violet-500/40" />
                        <p className="text-sm">This is the start of your message history.</p>
                      </div>
                    )}

                    {/* Typing Indicator */}
                    {isOtherUserTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5 flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Write your message..."
                      value={typedMessage}
                      onChange={handleInputChange}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                    />
                    <button
                      type="submit"
                      disabled={!typedMessage.trim()}
                      className="p-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white hover:opacity-90 transition disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
                  <div className="w-20 h-20 bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 rounded-full flex items-center justify-center border border-violet-500/20 shadow-lg shadow-violet-500/5">
                    <MessageSquare className="w-10 h-10 text-violet-500" />
                  </div>
                  <h3 className="text-xl font-syne font-bold text-white/80">Direct Messaging</h3>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Select a follower or creator you follow from the list to start sharing ideas and artwork in real-time.
                  </p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default Chat;
