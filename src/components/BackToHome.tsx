import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * Back to Home button - renders as a link to the home page
 * positioned at the top-left of a page section
 */
const BackToHome = () => {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
    >
      <ArrowLeft size={16} />
      Back to Home
    </Link>
  );
};

export default BackToHome;
