// Generate and download PDF directly using jspdf (dynamic import)
async function generateAndDownloadPDF(docData, filename) {
  try {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    const pageWidth = pdf.internal.pageSize.getWidth();
    let cursorY = 60;

    const title = docData.nombre || 'Documento';
    pdf.setFontSize(18);
    pdf.text(String(title), margin, cursorY);

    cursorY += 20;
    pdf.setFontSize(11);
    pdf.setTextColor(100);
    pdf.text(`Tipo: ${docData.tipo || '-'}`, margin, cursorY);
    pdf.text(`Fecha: ${docData.fecha || '-'}`, pageWidth - margin - 150, cursorY);

    cursorY += 24;
    pdf.setTextColor(0);
    const desc = docData.descripcion ? String(docData.descripcion) : '';
    pdf.setFontSize(12);
    const splitDesc = pdf.splitTextToSize(desc, pageWidth - margin * 2);
    // handle pagination
    const lineHeight = 14;
    for (let i = 0; i < splitDesc.length; i++) {
      if (cursorY + lineHeight > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        cursorY = margin;
      }
      pdf.text(splitDesc[i], margin, cursorY);
      cursorY += lineHeight;
    }

    pdf.save(filename || `${(title || 'document').replace(/\s+/g, '_')}.pdf`);
  } catch (err) {
    console.error('Error generating PDF:', err);
    alert('No se pudo generar el PDF en este navegador. Revisa la consola para más detalles.');
  }
}

export default function DocumentsGrid({ documents, onEdit, onDelete }) {
  if (documents.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No hay documentos creados</p>
          <p className="text-gray-400 text-sm">Crea uno nuevo para empezar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Exportar todos removido - preview por documento arriba */}
      <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-4 py-3 text-left font-semibold">Nombre</th>
            <th className="px-4 py-3 text-left font-semibold">Tipo</th>
            <th className="px-4 py-3 text-left font-semibold">Fecha</th>
            <th className="px-4 py-3 text-left font-semibold">Descripción</th>
            <th className="px-4 py-3 text-center font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3 font-medium text-gray-800">{doc.nombre}</td>
              <td className="px-4 py-3">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {doc.tipo}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{doc.fecha}</td>
              <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                {doc.descripcion || '-'}
              </td>
              <td className="px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => generateAndDownloadPDF(doc, `${(doc.nombre||'documento').replace(/\s+/g,'_') || 'document'}.pdf`)}
                  className="inline-block px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm font-medium"
                >
                  Descargar (PDF)
                </button>
                <button
                  onClick={() => window.open(`/preview/${index}`, '_blank')}
                  className="inline-block px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition text-sm font-medium"
                >
                  Vista previa
                </button>
                <button
                  onClick={() => onEdit(index)}
                  className="inline-block px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(index)}
                  className="inline-block px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm font-medium"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
