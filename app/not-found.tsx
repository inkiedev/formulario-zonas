import Link from 'next/link'

export default function NotFound() {
  return (
    <div className={"text-2xl flex flex-col items-center justify-center h-[90vh] text-center"}>
      <h2>No encontrado</h2>
      <p>La ruta especificada no existe</p>
      <Link className="text-blue-400 mt-10 underline" href="/">Volver al Inicio</Link>
    </div>
  )
}
