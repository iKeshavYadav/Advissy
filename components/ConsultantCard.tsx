
import React from 'react';
import { Star, ShieldCheck, Clock, DollarSign } from 'lucide-react';
import { Consultant } from '../types';

interface ConsultantCardProps {
  consultant: Consultant;
  onBook: (id: string) => void;
}

export const ConsultantCard: React.FC<ConsultantCardProps> = ({ consultant, onBook }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={consultant.imageUrl} 
          alt={consultant.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {consultant.isVerified && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-bold text-gray-800">Verified</span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{consultant.name}</h3>
            <p className="text-sm text-orange-600 font-medium">{consultant.title}</p>
          </div>
          <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-sm font-bold text-gray-800">{consultant.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
          {consultant.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-t pt-4">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>${consultant.pricePerHour}/hr</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Next: Today</span>
          </div>
        </div>
        
        <button 
          onClick={() => onBook(consultant.id)}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
        >
          Book Consultation
        </button>
      </div>
    </div>
  );
};
