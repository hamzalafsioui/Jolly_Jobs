import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
  const generatePagination = (current, last) => {
    if (last <= 7) {
      return Array.from({ length: last }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, "...", last];
    }
    if (current >= last - 3) {
      return [1, "...", last - 4, last - 3, last - 2, last - 1, last];
    }
    return [1, "...", current - 1, current, current + 1, "...", last];
  };

  const pages = generatePagination(currentPage, lastPage);

  return (
    <div className="flex items-center justify-center space-x-2 py-12">
      <button 
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 border border-gray-100 rounded-lg transition-all text-gray-400 group
          ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:border-jolly-purple hover:text-jolly-purple'}
        `}
      >
        <ChevronLeft size={20} />
      </button>

      {pages.map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`
            w-10 h-10 rounded-lg text-sm font-bold transition-all
            ${page === currentPage 
              ? "bg-jolly-purple text-white shadow-lg shadow-jolly-purple/20" 
              : "text-jolly-slate hover:bg-white hover:text-jolly-purple border border-transparent hover:border-gray-200"
            }
            ${page === "..." ? "cursor-default pointer-events-none" : "cursor-pointer"}
          `}
        >
          {page}
        </button>
      ))}

      <button 
        onClick={() => currentPage < lastPage && onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className={`p-2 border border-gray-100 rounded-lg transition-all text-jolly-slate group
          ${currentPage === lastPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:border-jolly-purple hover:text-jolly-purple'}
        `}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
