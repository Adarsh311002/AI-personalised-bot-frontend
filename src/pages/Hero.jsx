import { useState, useEffect } from "react";

import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Bot, Send, X } from "lucide-react";

// Custom Button component
const Button = ({ children, variant, size, className, ...props }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900";
      case "ghost":
        return "hover:bg-gray-100 text-gray-900";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-4 py-2";
    }
  };

  return (
    <button
      className={`rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Input component
const Input = ({ className, ...props }) => {
  return (
    <input
      className={`rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const glowVariants = {
    initial: { opacity: 0.5, scale: 1 },
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.2, 1],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  };

  const floatingIconsVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      <header className="py-6 relative z-10">
        <nav className="container mx-auto px-4 flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <Bot className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">PersonaAI</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
          >
            
          </motion.div>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center relative">
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-20"
          variants={glowVariants}
          initial="initial"
          animate="animate"
        >
          <div className="w-96 h-96 rounded-full bg-blue-500 filter blur-3xl"></div>
        </motion.div>

        <motion.div
          className="text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
<motion.h1
  className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
  variants={itemVariants}
>
  The Future of AI Interaction
</motion.h1>

<motion.p 
  className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed"
  variants={itemVariants}
>
  Experience conversational AI trained on my portfolio's unique dataset – 
  <span className="inline-block bg-gradient-to-r from-blue-400 to-red-600 text-transparent bg-clip-text mx-1">
    ask technical questions, project details, or industry insights
  </span> 
  and get intelligent responses powered by personalized model.
</motion.p>
          <motion.div variants={itemVariants}>
            <Button size="lg" className="px-8 py-4 text-lg">
              Click Icon
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute top-20 left-20"
          variants={floatingIconsVariants}
          initial="initial"
          animate="animate"
        >
          <Bot className="h-12 w-12 text-blue-300 opacity-50" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-20"
          variants={floatingIconsVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
        >
          <Send className="h-12 w-12 text-purple-300 opacity-50" />
        </motion.div>
      </main>

      <AnimatePresence>
        {showChat && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-gray-800 rounded-lg w-full max-w-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-4 bg-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">Chat with BotAI</h2>
                <Button variant="ghost" onClick={() => setShowChat(false)}>
                  <X />
                </Button>
              </div>
              <div className="h-96 overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span
                      className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                      {message.content}
                    </span>
                  </motion.div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="p-4 bg-gray-100 flex space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-grow"
                />
                <Button type="submit">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-6 text-center text-gray-400 relative z-10">
        <p>© 2025 BotAI With Love 🤍</p>
      </footer>
    </div>
  );
}