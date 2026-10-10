import Link from "next/link";

export default function IncompleteAccountPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#FAFAF8] p-5"><section className="w-full max-w-lg rounded-lg border border-[#E7E5E4] bg-white p-8"><p className="text-sm font-bold text-[#8C4A16]">Pedago Helper</p><h1 className="mt-4 text-3xl font-bold">Profil indisponible</h1><p className="mt-4 leading-7">Votre session existe, mais votre profil n’a pas pu être chargé. Réessayez après quelques instants ou contactez l’administrateur de la plateforme.</p><Link href="/connexion" className="mt-7 inline-flex min-h-12 items-center rounded-lg bg-[#B5651D] px-5 font-bold text-white">Retour à la connexion</Link></section></main>;
}
