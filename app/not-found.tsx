import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="text-center px-4 py-20">
        <p className="text-8xl font-heading mb-4 text-muted-foreground/30">404</p>
        <h1 className="font-heading text-3xl mb-3">Pagina nu a fost găsită</h1>
        <p className-="text-muted-foreground text-base mb-8">
          Pagina pe care o cauți nu există sau a fost mutată.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Înapoi acasă
        </Link>
      </div>
    </main>
  );
}
