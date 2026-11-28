import { AlertCircle } from "lucide-react";

const DisclaimerBanner = () => {
  return (
    <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-60 right-0 bg-sidebar/95 backdrop-blur-md border-t border-border py-2.5 px-4 z-30 flex items-center justify-center gap-2.5 text-xs">
      <AlertCircle className="h-4 w-4 text-[#FFE055] shrink-0" />
      <p className="text-muted-foreground text-center leading-snug">
        <span className="text-[#FFE055] font-semibold">Educational Project:</span> MarketPulse data &amp; PulseAI outputs are for learning only and{" "}
        <span className="font-semibold text-foreground">NOT financial advice</span>. Do not make investment decisions based on this app.
      </p>
    </div>
  );
};

export default DisclaimerBanner;
