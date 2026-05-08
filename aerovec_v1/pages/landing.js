import { Roboto } from "next/font/google";
import { Jersey_10 } from "next/font/google";
import Link from "next/link";
import Header from "@/Components/common/Header";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const jersey_10 = Jersey_10({
  weight: '400',
  subsets: ['latin']
});

export default function Landing() {
  return (
    <div className="w-screen h-screen flex flex-col justify-start items-center bg-white text-black
     p-8">
      <Header />
      <h1 className="text-7xl font-bold mb-4">Bienvenido a AeroVec</h1>
      <p className="text-2xl mb-8">Tu plataforma de gestión de vuelos</p>
      
    </div>
  );
}