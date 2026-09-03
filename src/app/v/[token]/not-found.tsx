export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Cotización no encontrada
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          El enlace es inválido o la cotización ya no está disponible.
        </p>
      </div>
    </div>
  );
}