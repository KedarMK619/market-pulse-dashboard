import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative z-20 bg-gray-900 border-t border-gray-700 py-6 px-4 md:px-6 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="text-sm text-gray-400">
            © 2025 MarketPulse — Built for educational purposes
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/disclaimer" className="text-gray-400 hover:text-primary transition-colors">
              Disclaimer
            </Link>
            <Link to="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center border-t border-gray-800 pt-4">
          <p>Not financial advice. For learning purposes only.</p>
          <p className="mt-1">Data provided by Alpha Vantage, NewsAPI, and Financial Modeling Prep</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
