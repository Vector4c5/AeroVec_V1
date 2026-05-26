import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'aerovec_documents_temp';

export default function PreviewPage() {
  const router = useRouter();
  const { index } = router.query;
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof index === 'undefined') return;
    const timeouts = [];
    const i = parseInt(Array.isArray(index) ? index[0] : index, 10);
    if (Number.isNaN(i)) {
      timeouts.push(setTimeout(() => setError('Índice inválido'), 0));
      timeouts.push(setTimeout(() => setLoading(false), 0));
      return () => timeouts.forEach(clearTimeout);
    }

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        timeouts.push(setTimeout(() => setError('No hay documentos guardados en esta sesión.'), 0));
        timeouts.push(setTimeout(() => setLoading(false), 0));
        return () => timeouts.forEach(clearTimeout);
      }
      const docs = JSON.parse(raw);
      const doc = docs[i];
      if (!doc) {
        timeouts.push(setTimeout(() => setError('Documento no encontrado.'), 0));
        timeouts.push(setTimeout(() => setLoading(false), 0));
        return () => timeouts.forEach(clearTimeout);
      }

      let createdUrl = null;
      (async () => {
        try {
          const { jsPDF } = await import('jspdf');
          const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
          const margin = 40;
          const pageWidth = pdf.internal.pageSize.getWidth();
          let cursorY = 60;

          const title = doc.nombre || 'Documento';
          pdf.setFontSize(18);
          pdf.text(String(title), margin, cursorY);

          cursorY += 20;
          pdf.setFontSize(11);
          pdf.setTextColor(100);
          pdf.text(`Tipo: ${doc.tipo || '-'}`, margin, cursorY);
          pdf.text(`Fecha: ${doc.fecha || '-'}`, pageWidth - margin - 150, cursorY);

          cursorY += 24;
          pdf.setTextColor(0);
          const desc = doc.descripcion ? String(doc.descripcion) : '';
          pdf.setFontSize(12);
          const splitDesc = pdf.splitTextToSize(desc, pageWidth - margin * 2);
          const lineHeight = 14;
          for (let i = 0; i < splitDesc.length; i++) {
            if (cursorY + lineHeight > pdf.internal.pageSize.getHeight() - margin) {
              pdf.addPage();
              cursorY = margin;
            }
            pdf.text(splitDesc[i], margin, cursorY);
            cursorY += lineHeight;
          }

          const blob = pdf.output('blob');
          const url = URL.createObjectURL(blob);
          createdUrl = url;
          setPdfUrl(url);
          setLoading(false);
          } catch (e) {
            console.error(e);
            timeouts.push(setTimeout(() => setError('Error generando el PDF.'), 0));
            timeouts.push(setTimeout(() => setLoading(false), 0));
          }
      })();
      } catch (err) {
        console.error(err);
        timeouts.push(setTimeout(() => setError('Error leyendo documentos.'), 0));
        timeouts.push(setTimeout(() => setLoading(false), 0));
      }

    return () => {
      timeouts.forEach(clearTimeout);
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [index]);

  return (
    <div className="w-screen min-h-screen p-6 bg-white text-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Vista previa PDF</h1>
        {loading && <p>Cargando vista previa...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && pdfUrl && (
          <div className="w-full h-[80vh] border">
            <iframe src={pdfUrl} className="w-full h-full" title="preview" />
          </div>
        )}
        <div className="mt-4">
          <button onClick={() => router.back()} className="px-4 py-2 bg-gray-200 rounded mr-2">Volver</button>
          {pdfUrl && <a href={pdfUrl} download className="px-4 py-2 bg-blue-600 text-white rounded">Descargar PDF</a>}
        </div>
      </div>
    </div>
  );
}
