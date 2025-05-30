import React, { useState } from 'react';
import { FiMenu, FiX, FiHome, FiTv, FiDollarSign, FiTrendingUp, FiStar, FiHelpCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 1, text: 'Início', icon: <FiHome className="w-5 h-5" />, href: '#home' },
    { id: 2, text: 'Serviços', icon: <FiTv className="w-5 h-5" />, href: '#servicos' },
    { id: 3, text: 'Planos', icon: <FiDollarSign className="w-5 h-5" />, href: '#planos' },
    { id: 4, text: 'Em Alta 🔥', icon: <FiTrendingUp className="w-5 h-5" />, href: '#trending' },
    { id: 5, text: 'Recomendações ✨', icon: <FiStar className="w-5 h-5" />, href: '#recomendacoes' },
    { id: 6, text: 'FAQ', icon: <FiHelpCircle className="w-5 h-5" />, href: '#faq' }
  ];

  return (
    <header className="bg-gradient-to-r from-gray-900 to-black text-white fixed w-full z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg"></div>
            <img
              src="/AGTV.jpg"
              alt="Logo AGTV"
              className="relative w-16 h-16 rounded-full border-2 border-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          </div>
        </a>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none focus:text-white">
            {isOpen ? (
              <FiX className="w-8 h-8" />
            ) : (
              <FiMenu className="w-8 h-8" />
            )}
          </button>
        </div>

        <div className="hidden md:flex space-x-8">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-lg font-medium text-gray-300 hover:text-white transition duration-300 flex items-center space-x-2 group"
            >
              {item.icon}
              <span className="group-hover:translate-x-1 transition-transform duration-300">{item.text}</span>
            </a>
          ))}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          <motion.div
            className={`md:hidden fixed right-0 top-0 w-72 h-screen bg-gradient-to-r from-gray-900 to-black z-50`}
            initial={{ x: '100%' }}
            animate={{ x: isOpen ? 0 : '100%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center px-4 py-4">
                <div></div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="text-white"
                >
                  <FiX className="w-6 h-6" />
                </motion.button>
              </div>
              <div className="flex-1 flex flex-col space-y-4 px-4">
                {menuItems.map((item) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    className="text-lg font-medium text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: item.id * 0.1 }}
                  >
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white bg-opacity-10">
                      {item.icon}
                    </div>
                    <span>{item.text}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
