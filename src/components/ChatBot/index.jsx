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
        'http://localhost:5000/api/chat',
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
            className="w-80 h-[500px] bg-black/90 backdrop-blur-lg rounded-xl shadow-xl flex flex-col border border-white/10"
          >
            <div className="p-4 bg-gradient-to-r from-green-600 to-purple-600 rounded-t-xl flex justify-between items-center">
              <h3 className="font-bold text-white">Adarsh's AI Assistant</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full"
              >
                <FiX className="text-white" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-white max-w-[85%] ${
                    msg.isBot 
                      ? 'bg-white/5 ml-auto' 
                      : 'bg-blue-600/30 mr-auto'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-white/5 rounded-lg max-w-[85%] ml-auto"
                >
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form 
              onSubmit={handleSubmit}
              className="p-4 border-t border-white/10"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 text-white bg-white/5 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <FiSend className="inline-block" />
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
        className="w-14 h-14 bg-green-700 rounded-full shadow-lg flex items-center justify-center"
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