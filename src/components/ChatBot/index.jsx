import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FiSend, FiX, FiMessageSquare } from 'react-icons/fi';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ text: "Hi, I'm Mait , Adarsh AI assistant. How can I help you?", isBot: true }]);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage = { text: inputMessage, isBot: false };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');

      const response = await axios.post(
        'https://ai-personalised-chat-bot-backend.vercel.app/api/chat',
        { message: inputMessage },
        { withCredentials: true }
      );

      const botMessage = { text: response.data.reply, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        text: error.response?.data?.error || "Sorry, I'm having trouble connecting.",
        isBot: true 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="w-80 h-[500px] bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl flex flex-col border border-gray-700"
            style={{ position: 'fixed', bottom: '4.5rem', right: '2rem' }}
          >
            <div className="p-4 bg-gradient-to-r from-purple-500 rounded-t-xl flex justify-between items-center">
              <h3 className="font-bold text-white text-sm tracking-wide">Mait Bot</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl max-w-[90%] relative ${
                    msg.isBot 
                      ? 'ml-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none'
                      : 'mr-auto bg-gray-800 text-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-5">{msg.text}</p>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-auto bg-gray-800 rounded-xl p-3 max-w-[60%] rounded-br-none"
                >
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form 
              onSubmit={handleSubmit}
              className="p-4 border-t border-gray-700"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 text-sm bg-gray-800 text-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-800 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  <FiSend className="text-white" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-xl flex items-center justify-center relative"
      >
        {isOpen ? (
          <FiX className="h-6 w-6 text-white" />
        ) : (
          <FiMessageSquare className="h-6 w-6 text-white" />
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot;