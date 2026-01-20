
import React, { useState } from 'react';

interface Category {
  id: string;
  name: string;
  options: string[];
  allowOther: boolean;
}

interface InteractiveStructure {
  title: string;
  categories: Category[];
}

interface InteractiveOptionsProps {
  structure: InteractiveStructure;
  onDone: (selections: Record<string, string>) => void;
  isStreaming: boolean; // New prop
}

const InteractiveOptions: React.FC<InteractiveOptionsProps> = ({ structure, onDone, isStreaming }) => {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [otherValues, setOtherValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (categoryId: string, option: string) => {
    if (isStreaming) return; // Prevent selection during streaming
    setSelections(prev => ({
      ...prev,
      [categoryId]: option
    }));
  };

  const handleOtherChange = (categoryId: string, value: string) => {
    if (isStreaming) return; // Prevent change during streaming
    setOtherValues(prev => ({
      ...prev,
      [categoryId]: value
    }));
    setSelections(prev => ({
      ...prev,
      [categoryId]: `Other: ${value}`
    }));
  };

  const handleSubmit = () => {
    if (isStreaming || isSubmitting) return; // Prevent submission during streaming or if already submitting

    const finalSelections: Record<string, string> = {};
    (structure.categories || []).forEach(cat => { // Defensive check here
      const val = selections[cat.id];
      if (val) finalSelections[cat.name] = val;
    });
    
    if (Object.keys(finalSelections).length === 0) {
      return;
    }

    setIsSubmitting(true);
    // Add a slight delay for aesthetic feedback
    setTimeout(() => {
      onDone(finalSelections);
    }, 400);
  };

  return (
    <div className="mt-8 mb-4 border border-[#262626] bg-[#0d0d0d] rounded-2xl overflow-hidden config-box-shadow animate-in slide-in-from-bottom-2 duration-300 relative">
      {isStreaming && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 transition-opacity animate-fade-in">
          <div className="text-center">
            <h3 className="text-[13px] font-bold text-white tracking-tight mb-2">বক্স তৈরি হচ্ছে...</h3>
            <div className="flex gap-2 py-4 justify-center">
              <span className="w-2 h-2 bg-red-600/40 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-red-600/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-red-600/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-[#141414] px-6 py-4 border-b border-[#262626] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <h3 className="text-[13px] font-bold text-white tracking-tight">
            {structure.title || 'কনফিগারেশন সেটআপ'}
          </h3>
        </div>
        <span className="text-[10px] font-black tracking-widest text-gray-600 uppercase">Interactive Form</span>
      </div>

      <div className="p-6 space-y-8">
        {(structure.categories || []).map((cat) => (
          <div key={cat.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-gray-500 tracking-wide">
                {cat.name}
              </label>
              {selections[cat.id] && (
                <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                  <i className="fa-solid fa-circle-check"></i> সিলেক্টেড
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {cat.options.map((opt) => {
                const isSelected = selections[cat.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(cat.id, opt)}
                    disabled={isSubmitting || isStreaming} // Disable during streaming
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                      isSelected 
                        ? 'bg-red-500/10 border-red-500/50 text-red-400 option-button-active' 
                        : 'bg-[#171717] border-[#262626] text-gray-400 hover:border-[#333] hover:text-gray-300'
                    } ${isStreaming ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {opt}
                  </button>
                );
              })}
              
              {cat.allowOther && (
                <button
                  onClick={() => handleSelect(cat.id, 'Other')}
                  disabled={isSubmitting || isStreaming} // Disable during streaming
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border ${
                    selections[cat.id]?.startsWith('Other') 
                      ? 'bg-red-500/10 border-red-500/50 text-red-400 option-button-active' 
                      : 'bg-[#171717] border-[#262626] text-gray-400 hover:border-[#333]'
                  } ${isStreaming ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  অন্যান্য...
                </button>
              )}
            </div>

            {cat.allowOther && selections[cat.id]?.startsWith('Other') && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="আপনার পছন্দ লিখুন..."
                  value={otherValues[cat.id] || ''}
                  onChange={(e) => handleOtherChange(cat.id, e.target.value)}
                  disabled={isSubmitting || isStreaming} // Disable during streaming
                  className={`w-full bg-[#111] border border-[#262626] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-700 ${isStreaming ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
            )}
          </div>
        ))}

        {/* Action Bar */}
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isStreaming || Object.keys(selections).length === 0} // Disable during streaming
            className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group ${
              isSubmitting || isStreaming || Object.keys(selections).length === 0
                ? 'bg-[#1a1a1a] text-gray-600 border border-[#262626] cursor-not-allowed'
                : 'bg-white text-black hover:bg-red-600 hover:text-white border border-transparent shadow-lg active:scale-[0.98]'
            }`}
          >
            {isSubmitting || isStreaming ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>প্রসেস করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>সাবমিট করুন</span>
                <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveOptions;
