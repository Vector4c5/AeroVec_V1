import { Roboto } from "next/font/google";
import { Jersey_10 } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";



const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "700"],
  subsets: ["latin"],
});
const jersey_10 = Jersey_10({
  weight: '400',
  subsets: ['latin']
});


export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div
      className={`${roboto.className} w-screen h-screen flex flex-col justify-center items-center 
        bg-black text-black p-8`}
    >
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <img
          src="/Fondo_Cielo.jpg"
          alt="Inicio"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {status === "loading" ? (
        <p className="mt-4 text-lg">Cargando...</p>
      ) : session ? (
        <div
          className="w-screen h-screen flex flex-col justify-center items-center z-10"
        >
          <div className=" w-6/12 h-auto flex flex-col items-center justify-center border-b-2 border-white
          my-4">
            <h1 className={`${jersey_10.className} text-center text-white text-7xl `}>
              Bienvenido, {session.user.name}
            </h1>
          </div>
          <div className="flex flex-col justify-center items-center w-6/12 h-auto">

            <Link
              href="/landing"
              className="flex flex-col items-center justify-center w-4/12 group relative mt-4 overflow-hidden border border-white bg-transparent rounded-3xl px-8 py-3 
              text-white hover:scale-105 hover:shadow-xl shadow-black transition-transform duration-400 
              "
            >
              <span className="relative z-10 text-3xl">Comenzar</span>
              <span className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-amber-900 transition-transform 
              duration-300 ease-out group-hover:scale-y-100"></span>
              
            </Link>


          </div>

        </div>

      ) : (
        <div
          className="w-screen h-screen flex flex-col justify-center items-center z-10"
        >
          <div className=" w-6/12 h-auto flex flex-col items-center justify-center border-b-2 border-white">
            <p className={`${jersey_10.className} text-center text-white text-8xl `}>
              Bievenido a AeroVec
            </p>

          </div>

          <div className="w-5/12 h-auto flex flex-col items-center justify-center p-6 gap-4 text-white">
            <p className="text-2xl text-center">
              Optimiza mantenimiento, operaciones y control de aeronaves desde un solo lugar.
            </p>
            <button
              onClick={() => signIn()}
              className="group relative mt-4 overflow-hidden border border-white bg-transparent rounded-3xl px-8 py-3 
              text-white hover:scale-105 hover:shadow-xl shadow-black transition-transform duration-400 
              "
            >
              <span className="relative z-10 text-2xl">Iniciar sesión</span>
              <span className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-blue-900 transition-transform 
              duration-300 ease-out group-hover:scale-y-100"></span>

            </button>
          </div>
        </div>
      )}




    </div>
  );
}
