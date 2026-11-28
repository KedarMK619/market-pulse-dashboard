import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative z-20 lg:ml-60 bg-sidebar border-t border-sidebar-border py-6 px-4 md:px-6 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="text-sm text-muted-foreground">
            © 2026 MarketPulse — Built strictly for educational purposes
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/disclaimer" className="text-muted-foreground hover:text-[#FFE055] transition-colors">
              Disclaimer
            </Link>
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-[#FFE055] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-muted-foreground hover:text-[#FFE055] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
        <div className="text-xs text-muted-foreground/80 text-center border-t border-border pt-4">
          <p>Not financial advice. Do not use this dashboard to make financial or investment decisions.</p>
          <p className="mt-1">Data provided by Alpha Vantage, NewsAPI, and Financial Modeling Prep</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
