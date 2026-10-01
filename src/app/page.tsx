import TrekApp from "@/components/TrekApp";
import { trekJsonLd } from "@/lib/jsonLd";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so trek text can never close the script tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(trekJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <TrekApp />
    </>
  );
}
