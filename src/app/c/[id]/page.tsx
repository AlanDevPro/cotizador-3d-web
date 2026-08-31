import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/lib/supabase';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CotizacionClientePage({ params }: Props) {
  const { id } = await params;

  // Obtener datos de la cotización desde Supabase
  const { data: cotizacion, error } = await supabase
    .from('cotizaciones')
    .select('*, empresa(nombre, qr_pago_url)')
    .eq('id', id)
    .single();

  if (error || !cotizacion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <h1 className="text-xl text-red-600 font-semibold">Cotización no encontrada o expirada.</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 p-6 space-y-6">
        <header className="border-b pb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">{cotizacion.empresa?.nombre || 'Taller 3D'}</h1>
          <p className="text-sm text-gray-500">Resumen de Cotización</p>
        </header>

        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Pieza / Proyecto:</span>
            <span className="font-medium text-gray-900">{cotizacion.nombre_proyecto}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
            <span>Total a pagar:</span>
            <span className="text-emerald-600">{cotizacion.total_bs} Bs</span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl text-center space-y-3 border">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Escanea para pagar por QR</p>
          <div className="flex justify-center p-2 bg-white rounded-lg inline-block mx-auto border">
            <QRCodeSVG value={cotizacion.empresa?.qr_pago_url || 'https://tutaller.com'} size={180} />
          </div>
          <p className="text-xs text-gray-500">Monto exacto: {cotizacion.total_bs} Bs</p>
        </div>

        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-all shadow-md">
          Confirmar e Informar Pago
        </button>
      </div>
    </main>
  );
}