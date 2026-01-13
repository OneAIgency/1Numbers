import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <PageLayout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <AlertCircle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="font-cinzel text-6xl md:text-7xl text-primary">404</h1>
          <h2 className="font-cinzel text-2xl md:text-3xl text-foreground">
            {t.notFound?.title || "Pagina nu a fost găsită"}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t.notFound?.description || "Pagina pe care o căutați nu există sau a fost mutată."}
          </p>
          <div className="pt-4">
            <Button asChild className="btn-mystic">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                {t.notFound?.backHome || "Înapoi la Pagina Principală"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
