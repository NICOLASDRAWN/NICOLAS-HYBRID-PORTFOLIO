import Link from "next/link";
export const metadata = { alternates: { canonical: "https://ncls.lat/carta/" }, robots: { index: false, follow: false } };
export default function Page() { return <main id="main-content" className="shell py-24"><h1 className="text-4xl mb-8">Carta de presentación</h1><Link className="text-acid underline" href="/carta/">Consultar la carta actualizada</Link></main>; }
