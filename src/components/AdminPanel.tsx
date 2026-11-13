import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  LogOut,
  ArrowLeft,
  Pencil,
  Trash2,
  Check,
  X,
  Upload,
  Mail,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import { STORE_INFO, STORE_IMAGE_PRESETS, Product, formatCOP } from '../data/products';
import { useCatalog, ProductInput } from '../context/CatalogContext';
import { ADMIN_EMAIL } from '../firebase';

interface AdminPanelProps {
  onExitAdmin: () => void;
}

const SIZE_SUGGESTIONS: Record<'gorras' | 'camisas' | 'jeans', string[]> = {
  gorras: ['Ajustable', 'Única', 'S/M', 'L/XL'],
  camisas: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  jeans: ['28', '30', '32', '34', '36', '38'],
};

async function compressImageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('El archivo seleccionado no es una imagen válida.'));
      img.onload = () => {
        const maxDimension = 720;
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo procesar la imagen.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

interface ProductFormModalProps {
  initialProduct?: Product | null;
  onClose: () => void;
  onSave: (data: ProductInput, existingId?: string) => Promise<void>;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  initialProduct,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(initialProduct?.name ?? '');
  const [category, setCategory] = useState<'gorras' | 'camisas' | 'jeans'>(
    initialProduct?.category ?? 'gorras'
  );
  const [priceText, setPriceText] = useState(
    initialProduct ? String(initialProduct.price) : ''
  );
  const [available, setAvailable] = useState(
    initialProduct ? initialProduct.available !== false : true
  );
  const [sizes, setSizes] = useState<string[]>(
    initialProduct?.sizes ?? ['Ajustable']
  );
  const [newSizeInput, setNewSizeInput] = useState('');
  const [image, setImage] = useState(
    initialProduct?.image ?? STORE_IMAGE_PRESETS[0].url
  );
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [tag, setTag] = useState(initialProduct?.tag ?? '');
  const [description, setDescription] = useState(initialProduct?.description ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericPrice = Math.max(0, Number(priceText.replace(/\D/g, '')) || 0);

  const handleAddSize = (sizeToAdd: string) => {
    const clean = sizeToAdd.trim().slice(0, 24);
    if (!clean) return;
    if (sizes.includes(clean)) {
      setNewSizeInput('');
      return;
    }
    if (sizes.length >= 15) {
      setError('Puedes agregar máximo 15 tallas por producto.');
      return;
    }
    setSizes((prev) => [...prev, clean]);
    setNewSizeInput('');
    setError(null);
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    if (sizes.length <= 1) {
      setError('El producto debe tener al menos una talla.');
      return;
    }
    setSizes((prev) => prev.filter((s) => s !== sizeToRemove));
    setError(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFileToDataUrl(file);
      if (compressed.length > 195000) {
        setError('La imagen es demasiado pesada. Intenta con otra imagen más ligera.');
        return;
      }
      setImage(compressed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Escribe el nombre del producto.');
      return;
    }
    if (!priceText.trim() || numericPrice <= 0) {
      setError('Ingresa un precio válido mayor a 0.');
      return;
    }
    if (sizes.length === 0) {
      setError('Agrega al menos una talla disponible.');
      return;
    }
    if (!image.trim()) {
      setError('Agrega o selecciona una imagen para el producto.');
      return;
    }

    setError(null);
    setSaving(true);
    try {
      await onSave(
        {
          name: name.trim(),
          category,
          price: numericPrice,
          sizes,
          available,
          image: image.trim(),
          description: description.trim(),
          tag: tag.trim(),
          features: initialProduct?.features ?? [],
        },
        initialProduct?.id
      );
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? 'No se pudo guardar el producto. Verifica tu conexión o permisos.'
          : 'Ocurrió un error al guardar.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#121212] border border-[#2A2A2A] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#0B0B0B] border-b border-[#222222] flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-white">
              {initialProduct ? 'Editar producto' : 'Añadir nuevo producto'}
            </h2>
            <p className="text-xs text-neutral-400">
              Los cambios se reflejan al instante en el catálogo de la tienda.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1B1B1B] transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Name + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Nombre del producto *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                placeholder="Ej. Gorra Urbana Negra"
                className="w-full px-3.5 py-2.5 bg-[#1A1A1A] border border-[#2C2C2C] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DFB15B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Categoría *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['gorras', 'camisas', 'jeans'] as const).map((cat) => {
                  const active = category === cat;
                  const label = cat === 'gorras' ? 'Gorras' : cat === 'camisas' ? 'Camisas' : 'Jeans';
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                        active
                          ? 'bg-[#DFB15B] text-black border-[#DFB15B]'
                          : 'bg-[#1A1A1A] text-neutral-300 border-[#2C2C2C] hover:border-neutral-500'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Price + Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Precio (COP) *
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                value={priceText}
                onChange={(e) => setPriceText(e.target.value)}
                placeholder="Ej. 75000"
                className="w-full px-3.5 py-2.5 bg-[#1A1A1A] border border-[#2C2C2C] rounded-xl text-sm text-white tabular-nums placeholder:text-neutral-500 focus:outline-none focus:border-[#DFB15B]"
              />
              <p className="text-[11px] text-[#DFB15B] mt-1 tabular-nums">
                Vista previa: {formatCOP(numericPrice)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Estado del producto *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAvailable(true)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    available
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/60'
                      : 'bg-[#1A1A1A] text-neutral-400 border-[#2C2C2C] hover:text-neutral-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Disponible</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAvailable(false)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    !available
                      ? 'bg-red-500/15 text-red-300 border-red-500/60'
                      : 'bg-[#1A1A1A] text-neutral-400 border-[#2C2C2C] hover:text-neutral-200'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  <span>Agotado</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sizes Manager */}
          <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-200">
                Tallas disponibles *
              </label>
              <span className="text-[11px] text-neutral-400">
                Toca × para quitar o agrega nuevas
              </span>
            </div>

            {/* Active Sizes */}
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#DFB15B]/15 border border-[#DFB15B]/40 text-xs font-bold text-[#DFB15B]"
                >
                  <span>{size}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(size)}
                    className="p-0.5 rounded hover:bg-[#DFB15B]/20 text-[#DFB15B] hover:text-white transition-colors"
                    aria-label={`Quitar talla ${size}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Suggested Sizes */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-neutral-500 mr-1">Sugeridas:</span>
              {SIZE_SUGGESTIONS[category].map((suggestion) => {
                const alreadyAdded = sizes.includes(suggestion);
                return (
                  <button
                    key={suggestion}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => handleAddSize(suggestion)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                      alreadyAdded
                        ? 'bg-[#121212] text-neutral-600 border-[#222222] cursor-default'
                        : 'bg-[#1D1D1D] text-neutral-300 border-[#2E2E2E] hover:border-[#DFB15B] hover:text-white'
                    }`}
                  >
                    + {suggestion}
                  </button>
                );
              })}
            </div>

            {/* Custom Size Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSizeInput}
                onChange={(e) => setNewSizeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSize(newSizeInput);
                  }
                }}
                maxLength={24}
                placeholder="Otra talla (ej. XXL, 40, Única)"
                className="flex-1 px-3 py-2 bg-[#111111] border border-[#2C2C2C] rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DFB15B]"
              />
              <button
                type="button"
                onClick={() => handleAddSize(newSizeInput)}
                className="px-3.5 py-2 rounded-lg bg-[#252525] hover:bg-[#303030] text-xs font-bold text-white border border-[#353535] transition-colors shrink-0"
              >
                Añadir talla
              </button>
            </div>
          </div>

          {/* Image Picker */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-neutral-300">
              Foto del producto *
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <div className="w-24 h-24 rounded-xl bg-[#0A0A0A] border border-[#2B2B2B] overflow-hidden shrink-0 flex items-center justify-center">
                {image ? (
                  <img src={image} alt="Vista previa" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-neutral-600" />
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#333333] text-xs font-semibold text-white cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#DFB15B]" />
                    <span>Subir foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowGalleryPicker((v) => !v)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#333333] text-xs font-semibold text-neutral-200 transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#DFB15B]" />
                    <span>{showGalleryPicker ? 'Ocultar galería' : 'Elegir de galería'}</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={image.startsWith('data:') ? '' : image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder={
                    image.startsWith('data:')
                      ? 'Imagen subida desde tu dispositivo'
                      : 'O pega el enlace de una imagen...'
                  }
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2C2C2C] rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DFB15B]"
                />
              </div>
            </div>

            {showGalleryPicker && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-2.5 rounded-xl bg-[#161616] border border-[#262626]">
                {STORE_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setImage(preset.url);
                      setShowGalleryPicker(false);
                    }}
                    className={`group rounded-lg overflow-hidden border text-left transition-all ${
                      image === preset.url
                        ? 'border-[#DFB15B] ring-1 ring-[#DFB15B]'
                        : 'border-[#2A2A2A] hover:border-neutral-500'
                    }`}
                    title={preset.label}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Optional Tag + Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Etiqueta (opcional)
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                maxLength={40}
                placeholder="Ej. Nueva llegada"
                className="w-full px-3.5 py-2.5 bg-[#1A1A1A] border border-[#2C2C2C] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DFB15B]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Descripción corta (opcional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                placeholder="Ej. Algodón premium, ajuste cómodo y acabado de alta calidad."
                className="w-full px-3.5 py-2.5 bg-[#1A1A1A] border border-[#2C2C2C] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DFB15B]"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-[#222222] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#1C1C1C] hover:bg-[#262626] text-xs font-semibold text-neutral-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#DFB15B] hover:bg-[#e5be70] disabled:opacity-60 text-black text-xs font-bold transition-colors"
            >
              {saving
                ? 'Guardando...'
                : initialProduct
                ? 'Guardar cambios'
                : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExitAdmin }) => {
  const {
    products,
    loadingCatalog,
    catalogInitialized,
    authUser,
    authReady,
    isAdminUser,
    authError,
    authLoading,
    seeding,
    signInAdmin,
    signOutAdmin,
    seedInitialCatalog,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useCatalog();

  const [emailInput, setEmailInput] = useState(ADMIN_EMAIL);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'gorras' | 'camisas' | 'jeans'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'out'>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState('');

  const [addingSizeId, setAddingSizeId] = useState<string | null>(null);
  const [sizeDraft, setSizeDraft] = useState('');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => {
      setFeedback((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const availableCount = useMemo(
    () => products.filter((p) => p.available !== false).length,
    [products]
  );
  const outOfStockCount = products.length - availableCount;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
      const isAvail = p.available !== false;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'available' && isAvail) ||
        (statusFilter === 'out' && !isAvail);
      const q = search.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sizes.some((s) => s.toLowerCase().includes(q));
      return matchesCat && matchesStatus && matchesQuery;
    });
  }, [products, categoryFilter, statusFilter, search]);

  const handleSaveForm = async (data: ProductInput, existingId?: string) => {
    if (existingId) {
      await updateProduct(existingId, data);
      showToast(`"${data.name}" actualizado correctamente.`);
    } else {
      await addProduct(data);
      showToast(`"${data.name}" añadido al catálogo.`);
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    const nextAvailable = product.available === false;
    await updateProduct(product.id, { available: nextAvailable });
    showToast(
      nextAvailable
        ? `"${product.name}" marcado como Disponible.`
        : `"${product.name}" marcado como Agotado.`
    );
  };

  const handleSaveInlinePrice = async (product: Product) => {
    const parsed = Math.max(0, Number(priceDraft.replace(/\D/g, '')) || 0);
    if (parsed <= 0) return;
    await updateProduct(product.id, { price: parsed });
    setEditingPriceId(null);
    showToast(`Precio de "${product.name}" actualizado a ${formatCOP(parsed)}.`);
  };

  const handleInlineRemoveSize = async (product: Product, size: string) => {
    if (product.sizes.length <= 1) {
      showToast('Cada producto debe mantener al menos 1 talla.');
      return;
    }
    const nextSizes = product.sizes.filter((s) => s !== size);
    await updateProduct(product.id, { sizes: nextSizes });
    showToast(`Talla ${size} eliminada de "${product.name}".`);
  };

  const handleInlineAddSize = async (product: Product) => {
    const clean = sizeDraft.trim().slice(0, 24);
    if (!clean) return;
    if (product.sizes.includes(clean)) {
      setSizeDraft('');
      setAddingSizeId(null);
      return;
    }
    if (product.sizes.length >= 15) {
      showToast('Máximo 15 tallas por producto.');
      return;
    }
    await updateProduct(product.id, { sizes: [...product.sizes, clean] });
    setSizeDraft('');
    setAddingSizeId(null);
    showToast(`Talla ${clean} añadida a "${product.name}".`);
  };

  const handleConfirmDelete = async (product: Product) => {
    await deleteProduct(product.id);
    setConfirmDeleteId(null);
    showToast(`"${product.name}" eliminado del catálogo.`);
  };

  // Loading auth gate
  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-2 border-[#DFB15B] border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-neutral-400">Cargando panel de administrador...</p>
        </div>
      </div>
    );
  }

  // Private Login Screen
  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#FAF9F6] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#141414] border border-[#262626] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full border border-[#DFB15B]/60 bg-[#0A0A0A] p-1.5 flex items-center justify-center shadow-[0_0_24px_rgba(223,177,91,0.3)] mb-4">
              <img
                src={STORE_INFO.logoUrl}
                alt="J Store Quality"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DFB15B] mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Acceso Privado</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl text-white">
              Administrador de Catálogo
            </h1>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              Ingresa con tu correo electrónico autorizado para añadir productos, cambiar precios, editar tallas y marcar disponibles o agotados.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void signInAdmin(emailInput);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Correo electrónico de administrador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={ADMIN_EMAIL}
                  className="w-full pl-10 pr-4 py-3 bg-[#1B1B1B] border border-[#2E2E2E] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DFB15B]"
                />
              </div>
            </div>

            {authError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#DFB15B] hover:bg-[#e5be70] disabled:opacity-60 text-black font-bold text-sm transition-all shadow-[0_0_20px_rgba(223,177,91,0.3)]"
            >
              {authLoading ? 'Verificando acceso...' : 'Ingresar con correo electrónico'}
            </button>
          </form>

          <div className="pt-4 border-t border-[#222222] flex items-center justify-center">
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la tienda</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#FAF9F6]">
      {/* Clean Admin Top Bar */}
      <header className="sticky top-0 z-30 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#222222]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full border border-[#DFB15B]/50 bg-[#121212] p-1 shrink-0">
              <img
                src={STORE_INFO.logoUrl}
                alt="J Store Quality"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-sm sm:text-base text-white truncate">
                J Store Quality · Administrador
              </h1>
              <p className="text-[11px] text-neutral-400 truncate">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#161616] hover:bg-[#202020] border border-[#2B2B2B] text-xs font-semibold text-neutral-200 whitespace-nowrap shrink-0 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver tienda</span>
            </button>
            <button
              type="button"
              onClick={() => void signOutAdmin()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#161616] hover:bg-red-950/50 border border-[#2B2B2B] hover:border-red-500/40 text-xs font-semibold text-neutral-300 hover:text-red-300 whitespace-nowrap shrink-0 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Feedback Toast */}
        {feedback && (
          <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#181818] border border-[#DFB15B]/60 text-xs font-semibold text-white shadow-2xl">
            <CheckCircle2 className="w-4 h-4 text-[#DFB15B] shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
            <p className="text-[11px] sm:text-xs text-neutral-400">Total productos</p>
            <p className="font-display font-extrabold text-xl sm:text-2xl text-white mt-1 tabular-nums">
              {products.length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
            <p className="text-[11px] sm:text-xs text-neutral-400">Disponibles</p>
            <p className="font-display font-extrabold text-xl sm:text-2xl text-emerald-400 mt-1 tabular-nums">
              {availableCount}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
            <p className="text-[11px] sm:text-xs text-neutral-400">Agotados</p>
            <p className="font-display font-extrabold text-xl sm:text-2xl text-red-400 mt-1 tabular-nums">
              {outOfStockCount}
            </p>
          </div>
        </div>

        {/* Action & Filters Bar */}
        <div className="p-4 rounded-2xl bg-[#141414] border border-[#242424] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o talla..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DFB15B]"
              />
            </div>

            <div className="flex items-center gap-2">
              {!catalogInitialized && !seeding && (
                <button
                  type="button"
                  onClick={() => void seedInitialCatalog()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#1E1E1E] hover:bg-[#262626] border border-[#333333] text-xs font-semibold text-neutral-200 whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cargar catálogo base</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsFormOpen(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#DFB15B] hover:bg-[#e5be70] text-black font-bold text-xs sm:text-sm whitespace-nowrap shrink-0 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir producto</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#202020]">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(
                [
                  { id: 'all', label: 'Todos' },
                  { id: 'gorras', label: 'Gorras' },
                  { id: 'camisas', label: 'Camisas' },
                  { id: 'jeans', label: 'Jeans' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    categoryFilter === tab.id
                      ? 'bg-[#DFB15B] text-black'
                      : 'bg-[#1B1B1B] text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Availability Filter */}
            <div className="flex items-center gap-1.5">
              {(
                [
                  { id: 'all', label: 'Todos' },
                  { id: 'available', label: 'Disponibles' },
                  { id: 'out', label: 'Agotados' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                    statusFilter === tab.id
                      ? 'bg-[#252525] text-white border-[#DFB15B]/50'
                      : 'bg-transparent text-neutral-400 border-[#262626] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product List */}
        {loadingCatalog || seeding ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-28 rounded-2xl bg-[#141414] border border-[#242424] animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#141414] border border-[#242424] text-center space-y-3">
            <p className="font-display font-bold text-base text-white">
              No hay productos para mostrar
            </p>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Cambia los filtros de búsqueda o añade un nuevo producto al catálogo.
            </p>
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DFB15B] text-black font-bold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir producto</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const isAvailable = product.available !== false;
              const isEditingPrice = editingPriceId === product.id;
              const isAddingSize = addingSizeId === product.id;
              const isConfirmingDelete = confirmDeleteId === product.id;

              return (
                <div
                  key={product.id}
                  className="p-4 rounded-2xl bg-[#141414] border border-[#242424] hover:border-[#333333] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Product Thumbnail + Basic Info */}
                  <div className="flex items-start gap-3.5 min-w-0 lg:w-[32%]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-[#0A0A0A] border border-[#2B2B2B] shrink-0 ${
                        !isAvailable ? 'opacity-55 grayscale-[30%]' : ''
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                        <span className="text-[#DFB15B] font-semibold">
                          {product.categoryLabel}
                        </span>
                        {product.tag && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="truncate">{product.tag}</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-sm sm:text-base text-white mt-0.5 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Quick Inline Price Edit */}
                      <div className="mt-1.5">
                        {isEditingPrice ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              step={1000}
                              value={priceDraft}
                              onChange={(e) => setPriceDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') void handleSaveInlinePrice(product);
                                if (e.key === 'Escape') setEditingPriceId(null);
                              }}
                              className="w-28 px-2.5 py-1 bg-[#0B0B0B] border border-[#DFB15B] rounded-lg text-xs text-white tabular-nums focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => void handleSaveInlinePrice(product)}
                              className="p-1.5 rounded-lg bg-[#DFB15B] text-black hover:bg-[#e5be70]"
                              aria-label="Guardar precio"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPriceId(null)}
                              className="p-1.5 rounded-lg bg-[#222222] text-neutral-300 hover:text-white"
                              aria-label="Cancelar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPriceId(product.id);
                              setPriceDraft(String(product.price));
                            }}
                            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#DFB15B] hover:text-white tabular-nums transition-colors group"
                            title="Haz clic para cambiar el precio"
                          >
                            <span>{formatCOP(product.price)}</span>
                            <Pencil className="w-3 h-3 text-neutral-500 group-hover:text-[#DFB15B]" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Sizes Manager */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-neutral-400 mb-1.5">
                      Tallas ({product.sizes.length}):
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {product.sizes.map((size) => (
                        <span
                          key={size}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#1C1C1C] border border-[#2D2D2D] text-xs font-semibold text-neutral-200"
                        >
                          <span>{size}</span>
                          {product.sizes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => void handleInlineRemoveSize(product, size)}
                              className="text-neutral-500 hover:text-red-400 transition-colors"
                              title={`Quitar talla ${size}`}
                              aria-label={`Quitar talla ${size}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}

                      {isAddingSize ? (
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="text"
                            value={sizeDraft}
                            onChange={(e) => setSizeDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') void handleInlineAddSize(product);
                              if (e.key === 'Escape') {
                                setAddingSizeId(null);
                                setSizeDraft('');
                              }
                            }}
                            placeholder="Nueva..."
                            maxLength={24}
                            className="w-20 px-2 py-1 rounded-md bg-[#0B0B0B] border border-[#DFB15B] text-xs text-white focus:outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => void handleInlineAddSize(product)}
                            className="p-1 rounded-md bg-[#DFB15B] text-black"
                            aria-label="Confirmar talla"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAddingSizeId(null);
                              setSizeDraft('');
                            }}
                            className="p-1 rounded-md bg-[#242424] text-neutral-300"
                            aria-label="Cancelar"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAddingSizeId(product.id);
                            setSizeDraft('');
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#191919] hover:bg-[#242424] border border-dashed border-[#383838] text-[11px] font-semibold text-[#DFB15B] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Talla</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status Toggle + Edit/Delete Controls */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#222222] shrink-0">
                    <button
                      type="button"
                      onClick={() => void handleToggleAvailability(product)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap shrink-0 ${
                        isAvailable
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                          : 'bg-red-500/15 text-red-300 border-red-500/40 hover:bg-red-500/25'
                      }`}
                      title="Haz clic para cambiar entre Disponible y Agotado"
                    >
                      {isAvailable ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Disponible</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Agotado</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(product);
                        setIsFormOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1D1D1D] hover:bg-[#282828] border border-[#2F2F2F] text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5 text-[#DFB15B]" />
                      <span>Editar</span>
                    </button>

                    {isConfirmingDelete ? (
                      <div className="inline-flex items-center gap-1.5 bg-red-950/40 border border-red-500/40 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => void handleConfirmDelete(product)}
                          className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold"
                        >
                          Sí, quitar
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 rounded-lg bg-[#222222] text-neutral-300 text-[11px] font-semibold"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(product.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1D1D1D] hover:bg-red-950/50 border border-[#2F2F2F] hover:border-red-500/40 text-xs font-semibold text-neutral-300 hover:text-red-300 whitespace-nowrap shrink-0 transition-colors"
                        aria-label={`Eliminar ${product.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Quitar</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add / Edit Modal */}
      {isFormOpen && (
        <ProductFormModal
          initialProduct={editingProduct}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveForm}
        />
      )}
    </div>
  );
};
