import { Roboto } from "next/font/google";
import { Jersey_10 } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
import Header from "@/Components/common/Header";
import DocumentModal from "@/Components/common/DocumentModal";
import DocumentsGrid from "@/Components/common/DocumentsGrid";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const jersey_10 = Jersey_10({
  weight: '400',
  subsets: ['latin']
});

const STORAGE_KEY = 'aerovec_documents_temp';

export default function Landing() {
  const [documents, setDocuments] = useState([]);

  // Cargar documentos desde sessionStorage solo en el cliente después de la hidratación
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const id = setTimeout(() => setDocuments(parsed), 0);
        return () => clearTimeout(id);
      }
    } catch (err) {
      console.error('Error al leer documentos desde sessionStorage:', err);
    }
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // (Carga inicial movida al initializer de useState)

  // Guardar documentos en sessionStorage cada vez que cambien
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  }, [documents]);

  const handleCreateDocument = (formData) => {
    if (editingIndex !== null) {
      // Actualizar documento existente
      const updatedDocuments = [...documents];
      updatedDocuments[editingIndex] = formData;
      setDocuments(updatedDocuments);
      setEditingIndex(null);
    } else {
      // Crear nuevo documento
      setDocuments([...documents, formData]);
    }
    setIsModalOpen(false);
  };

  const handleEditDocument = (index) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDeleteDocument = (index) => {
    if (confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      setDocuments(documents.filter((_, i) => i !== index));
    }
  };

  const handleOpenModal = () => {
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col justify-start items-center bg-white text-black p-8">
      <Header />
      
      <div className="w-full max-w-6xl h-auto flex flex-col items-start justify-start gap-6 mt-8">
        {/* Encabezado con botón */}
        <div className="w-full flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Documentos</h1>
            <p className="text-gray-600 mt-2">
              Crea y gestiona tus documentos temporalmente
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
          >
            + Nuevo Documento
          </button>
        </div>

        {/* Información de almacenamiento temporal */}
        <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            ℹ️ <strong>Almacenamiento temporal:</strong> Los documentos se guardan temporalmente en esta sesión. 
            Se perderán al cerrar la pestaña. Total: <strong>{documents.length}</strong> documento(s).
          </p>
        </div>

        {/* Grid de documentos */}
        <div className="w-full">
          <DocumentsGrid 
            documents={documents}
            onEdit={handleEditDocument}
            onDelete={handleDeleteDocument}
          />
        </div>
      </div>

      {/* Modal de creación/edición */}
      <DocumentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateDocument}
        editingDoc={editingIndex !== null ? documents[editingIndex] : null}
      />
    </div>
  );
}