import { AlertCircle } from "lucide-react";

const DisclaimerBanner = () => {
  return (
    <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 py-3 px-4 z-30 flex items-start justify-center gap-3 text-xs sm:text-sm">
      <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
      <p className="text-gray-300 text-center leading-relaxed">
        <span className="text-yellow-500 font-semibold">⚠️ Disclaimer:</span> MarketPulse is a practice/learning project. All data shown is for educational purposes only and is <span className="font-semibold">NOT real financial advice</span>. Do not make investment decisions based on this data.
      </p>
    </div>
  );
};

export default DisclaimerBanner;
