import LandingHomeClient from "../components/landing/LandingHomeClient";

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Pedago Helper · المساعد البيداغوجي",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    inLanguage: ["fr", "ar", "en"],
    description: "Outils de préparation des leçons et d’apprentissage des sciences de la vie et de la Terre au Maroc.",
    url: "https://pedago-helper.vercel.app/",
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><LandingHomeClient /></>;
}
