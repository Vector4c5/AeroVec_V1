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
    <div className="w-full overflow-x-auto">
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
  );
}
