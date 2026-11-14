import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  User,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  ADMIN_EMAIL,
  OperationType,
  handleFirestoreError,
} from '../firebase';
import { Product, PRODUCTS } from '../data/products';

export interface ProductInput {
  name: string;
  category: 'gorras' | 'camisas' | 'jeans';
  price: number;
  sizes: string[];
  available: boolean;
  image: string;
  description: string;
  tag?: string;
  features?: string[];
}

export type UidRegistrationStatus = 'idle' | 'checking' | 'registered' | 'error';

interface CatalogContextValue {
  products: Product[];
  loadingCatalog: boolean;
  catalogInitialized: boolean;
  authUser: User | null;
  authReady: boolean;
  isAdminUser: boolean;
  uidRegistrationStatus: UidRegistrationStatus;
  uidRegistrationError: string | null;
  authError: string | null;
  authLoading: boolean;
  seeding: boolean;
  clearAuthError: () => void;
  signInAdmin: (emailHint?: string) => Promise<void>;
  signOutAdmin: () => Promise<void>;
  seedInitialCatalog: () => Promise<void>;
  addProduct: (input: ProductInput) => Promise<void>;
  updateProduct: (id: string, updates: Partial<ProductInput>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

const CATEGORY_LABEL_MAP: Record<'gorras' | 'camisas' | 'jeans', 'Gorras' | 'Camisas' | 'Jeans'> = {
  gorras: 'Gorras',
  camisas: 'Camisas',
  jeans: 'Jeans',
};

const CATEGORY_SORT_WEIGHT: Record<'gorras' | 'camisas' | 'jeans', number> = {
  gorras: 0,
  camisas: 1,
  jeans: 2,
};

function sanitizeProductId(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base || 'producto'}-${suffix}`;
}

function sanitizeSizes(sizes: string[]): string[] {
  const cleaned = sizes
    .map((s) => s.trim().slice(0, 24))
    .filter((s) => s.length > 0);
  const unique = Array.from(new Set(cleaned)).slice(0, 15);
  return unique.length > 0 ? unique : ['Única'];
}

function sanitizeFeatures(features?: string[]): string[] {
  if (!features) return [];
  return features
    .map((f) => f.trim().slice(0, 150))
    .filter((f) => f.length > 0)
    .slice(0, 10);
}

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firestoreProducts, setFirestoreProducts] = useState<Product[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogInitialized, setCatalogInitialized] = useState(false);
  const [metaChecked, setMetaChecked] = useState(false);

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdminDoc, setIsAdminDoc] = useState(false);
  const [uidRegistrationStatus, setUidRegistrationStatus] = useState<UidRegistrationStatus>('idle');
  const [uidRegistrationError, setUidRegistrationError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const uidRegistrationPromiseRef = useRef<{ uid: string; promise: Promise<boolean> } | null>(null);

  const ensureAdminUidRegistered = useCallback(async (user: User): Promise<boolean> => {
    const isPrimaryEmail =
      Boolean(user.emailVerified) &&
      user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    if (!isPrimaryEmail) {
      return false;
    }

    if (uidRegistrationPromiseRef.current?.uid === user.uid) {
      return uidRegistrationPromiseRef.current.promise;
    }

    const promise = (async () => {
      setUidRegistrationStatus('checking');
      setUidRegistrationError(null);
      try {
        const adminRef = doc(db, 'admins', user.uid);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists()) {
          await setDoc(adminRef, {
            email: (user.email || ADMIN_EMAIL).slice(0, 160),
            role: 'admin',
            createdAt: serverTimestamp(),
          });
        }

        const verifiedSnap = await getDoc(adminRef);
        if (verifiedSnap.exists()) {
          setIsAdminDoc(true);
          setUidRegistrationStatus('registered');
          return true;
        }

        setUidRegistrationStatus('error');
        setUidRegistrationError('No se pudo confirmar el documento en /admins.');
        return false;
      } catch (error) {
        console.error('Error registrando UID de administrador:', error);
        setUidRegistrationStatus('error');
        setUidRegistrationError(
          error instanceof Error ? error.message : 'No se pudo registrar el UID en /admins.'
        );
        return false;
      } finally {
        if (uidRegistrationPromiseRef.current?.uid === user.uid) {
          uidRegistrationPromiseRef.current = null;
        }
      }
    })();

    uidRegistrationPromiseRef.current = { uid: user.uid, promise };
    return promise;
  }, []);

  const isAdminUser = useMemo(() => {
    if (!authUser || !authUser.emailVerified) return false;
    return (
      authUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
      isAdminDoc
    );
  }, [authUser, isAdminDoc]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user && user.emailVerified && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        await ensureAdminUidRegistered(user);
      } else if (user && user.emailVerified) {
        setUidRegistrationStatus('idle');
        setUidRegistrationError(null);
        try {
          const adminSnap = await getDoc(doc(db, 'admins', user.uid));
          setIsAdminDoc(adminSnap.exists());
        } catch {
          setIsAdminDoc(false);
        }
      } else {
        setIsAdminDoc(false);
        setUidRegistrationStatus('idle');
        setUidRegistrationError(null);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, [ensureAdminUidRegistered]);

  // Listen to catalog initialization flag
  useEffect(() => {
    const metaRef = doc(db, 'store_meta', 'catalog');
    const unsub = onSnapshot(
      metaRef,
      (snap) => {
        setCatalogInitialized(snap.exists() && snap.data()?.initialized === true);
        setMetaChecked(true);
      },
      (error) => {
        console.warn('No se pudo leer store_meta/catalog:', error);
        setMetaChecked(true);
      }
    );
    return () => unsub();
  }, []);

  // Listen to live products collection
  useEffect(() => {
    const q = query(
      collection(db, 'products'),
      where('category', 'in', ['gorras', 'camisas', 'jeans'])
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: Product[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const category: 'gorras' | 'camisas' | 'jeans' =
            data.category === 'camisas'
              ? 'camisas'
              : data.category === 'jeans'
              ? 'jeans'
              : 'gorras';
          return {
            id: docSnap.id,
            name: String(data.name ?? ''),
            category,
            categoryLabel: CATEGORY_LABEL_MAP[category],
            price: typeof data.price === 'number' ? data.price : 0,
            sizes: Array.isArray(data.sizes) ? data.sizes.map(String) : ['Única'],
            available: typeof data.available === 'boolean' ? data.available : true,
            image: String(data.image ?? ''),
            description: String(data.description ?? ''),
            features: Array.isArray(data.features) ? data.features.map(String) : [],
            tag: typeof data.tag === 'string' && data.tag.trim() ? data.tag : undefined,
            isExample: typeof data.isExample === 'boolean' ? data.isExample : false,
            sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 100,
          };
        });
        setFirestoreProducts(list);
        setLoadingCatalog(false);
      },
      (error) => {
        console.error('Error escuchando catálogo:', error);
        setLoadingCatalog(false);
      }
    );

    return () => unsub();
  }, []);

  const seedInitialCatalog = useCallback(async () => {
    if (!isAdminUser) return;
    setSeeding(true);
    try {
      const batch = writeBatch(db);
      PRODUCTS.forEach((product, idx) => {
        const ref = doc(db, 'products', product.id);
        batch.set(ref, {
          name: product.name.slice(0, 120),
          category: product.category,
          categoryLabel: CATEGORY_LABEL_MAP[product.category],
          price: Math.max(0, Math.round(product.price)),
          sizes: sanitizeSizes(product.sizes),
          available: product.available !== false,
          image: product.image.slice(0, 200000),
          description: (product.description || '').slice(0, 500),
          features: sanitizeFeatures(product.features),
          tag: (product.tag || '').slice(0, 40),
          isExample: Boolean(product.isExample),
          sortOrder: product.sortOrder ?? idx + 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      batch.set(doc(db, 'store_meta', 'catalog'), {
        initialized: true,
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    } finally {
      setSeeding(false);
    }
  }, [isAdminUser]);

  // Auto-seed initial catalog once when an admin logs in for the very first time
  useEffect(() => {
    if (
      authReady &&
      isAdminUser &&
      metaChecked &&
      !catalogInitialized &&
      !loadingCatalog &&
      firestoreProducts.length === 0 &&
      !seeding
    ) {
      void seedInitialCatalog();
    }
  }, [
    authReady,
    isAdminUser,
    metaChecked,
    catalogInitialized,
    loadingCatalog,
    firestoreProducts.length,
    seeding,
    seedInitialCatalog,
  ]);

  // Display Firestore products once initialized (or when Firestore already has products),
  // falling back to initial static PRODUCTS before first admin setup.
  const products = useMemo(() => {
    const source =
      catalogInitialized || firestoreProducts.length > 0
        ? firestoreProducts
        : PRODUCTS;

    return [...source].sort((a, b) => {
      const catDiff = CATEGORY_SORT_WEIGHT[a.category] - CATEGORY_SORT_WEIGHT[b.category];
      if (catDiff !== 0) return catDiff;
      const orderA = a.sortOrder ?? 999;
      const orderB = b.sortOrder ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name, 'es');
    });
  }, [catalogInitialized, firestoreProducts]);

  const signInAdmin = useCallback(async (emailHint?: string) => {
    setAuthError(null);
    const typedEmail = (emailHint || '').trim().toLowerCase();

    if (!typedEmail) {
      setAuthError('Por favor escribe tu correo electrónico.');
      return;
    }

    if (typedEmail !== ADMIN_EMAIL.toLowerCase()) {
      setAuthError('Correo no autorizado. Esta cuenta no tiene acceso al panel de administrador.');
      return;
    }

    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        login_hint: typedEmail,
        prompt: 'select_account',
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const isPrimaryAdmin =
        Boolean(user.emailVerified) &&
        user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      if (isPrimaryAdmin) {
        await ensureAdminUidRegistered(user);
      } else {
        let hasAdminRecord = false;
        if (user.emailVerified) {
          try {
            const snap = await getDoc(doc(db, 'admins', user.uid));
            hasAdminRecord = snap.exists();
          } catch {
            hasAdminRecord = false;
          }
        }

        if (!hasAdminRecord) {
          await signOut(auth);
          setAuthError('Correo no autorizado. Esta cuenta no tiene acceso al panel de administrador.');
          return;
        }
      }
    } catch (error) {
      console.error('Admin signInWithPopup error:', error);
      const authErr = error as { code?: string; message?: string };
      const code = authErr?.code || '';
      const message = authErr?.message || String(error);

      if (code === 'auth/popup-closed-by-user' || message.includes('popup-closed-by-user')) {
        setAuthError('Se cerró la ventana de acceso antes de completar el ingreso.');
      } else if (code === 'auth/cancelled-popup-request' || message.includes('cancelled-popup-request')) {
        setAuthError('Ya hay una ventana de Google abierta o se canceló la solicitud anterior. Intenta de nuevo.');
      } else if (code === 'auth/popup-blocked' || message.includes('popup-blocked')) {
        setAuthError('El navegador bloqueó la ventana emergente de Google. Permite ventanas emergentes o abre el panel en una pestaña nueva.');
      } else if (code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain')) {
        const host = typeof window !== 'undefined' ? window.location.hostname : '';
        setAuthError(
          `Este dominio (${host}) aún no está autorizado en Firebase Authentication (auth/unauthorized-domain). Agrégalo en Firebase Console → Authentication → Settings → Authorized domains, o ingresa desde la URL de desarrollo.`
        );
      } else if (code === 'auth/operation-not-allowed' || message.includes('operation-not-allowed')) {
        setAuthError(
          'El inicio de sesión con Google no está activado en Firebase Authentication (auth/operation-not-allowed). Actívalo en Firebase Console → Authentication → Sign-in method.'
        );
      } else if (code === 'auth/network-request-failed' || message.includes('network-request-failed')) {
        setAuthError('Error de red al conectar con Google. Revisa tu conexión e intenta nuevamente.');
      } else {
        setAuthError(
          `No se pudo iniciar sesión (${code || 'error inesperado'}). Si estás dentro de una vista previa, prueba abrir el panel en una pestaña nueva.`
        );
      }
    } finally {
      setAuthLoading(false);
    }
  }, [ensureAdminUidRegistered]);

  const signOutAdmin = useCallback(async () => {
    setAuthError(null);
    await signOut(auth);
  }, []);

  const addProduct = useCallback(
    async (input: ProductInput) => {
      const newId = sanitizeProductId(input.name);
      const docRef = doc(db, 'products', newId);
      const maxOrder = products.reduce((max, p) => Math.max(max, p.sortOrder ?? 0), 0);

      try {
        await setDoc(docRef, {
          name: input.name.trim().slice(0, 120),
          category: input.category,
          categoryLabel: CATEGORY_LABEL_MAP[input.category],
          price: Math.max(0, Math.min(50000000, Math.round(Number(input.price) || 0))),
          sizes: sanitizeSizes(input.sizes),
          available: Boolean(input.available),
          image: input.image.trim().slice(0, 200000),
          description: (input.description || '').trim().slice(0, 500),
          features: sanitizeFeatures(input.features),
          tag: (input.tag || '').trim().slice(0, 40),
          isExample: false,
          sortOrder: maxOrder + 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        if (!catalogInitialized) {
          await setDoc(doc(db, 'store_meta', 'catalog'), {
            initialized: true,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `products/${newId}`);
      }
    },
    [products, catalogInitialized]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<ProductInput>) => {
      const docRef = doc(db, 'products', id);
      const payload: Record<string, unknown> = {
        updatedAt: serverTimestamp(),
      };

      if (updates.name !== undefined) {
        payload.name = updates.name.trim().slice(0, 120);
      }
      if (updates.category !== undefined) {
        payload.category = updates.category;
        payload.categoryLabel = CATEGORY_LABEL_MAP[updates.category];
      }
      if (updates.price !== undefined) {
        payload.price = Math.max(0, Math.min(50000000, Math.round(Number(updates.price) || 0)));
      }
      if (updates.sizes !== undefined) {
        payload.sizes = sanitizeSizes(updates.sizes);
      }
      if (updates.available !== undefined) {
        payload.available = Boolean(updates.available);
      }
      if (updates.image !== undefined) {
        payload.image = updates.image.trim().slice(0, 200000);
      }
      if (updates.description !== undefined) {
        payload.description = updates.description.trim().slice(0, 500);
      }
      if (updates.tag !== undefined) {
        payload.tag = updates.tag.trim().slice(0, 40);
      }
      if (updates.features !== undefined) {
        payload.features = sanitizeFeatures(updates.features);
      }

      try {
        await updateDoc(docRef, payload);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
      }
    },
    []
  );

  const deleteProduct = useCallback(async (id: string) => {
    const docRef = doc(db, 'products', id);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  }, []);

  return (
    <CatalogContext.Provider
      value={{
        products,
        loadingCatalog,
        catalogInitialized,
        authUser,
        authReady,
        isAdminUser,
        uidRegistrationStatus,
        uidRegistrationError,
        authError,
        authLoading,
        seeding,
        clearAuthError: () => setAuthError(null),
        signInAdmin,
        signOutAdmin,
        seedInitialCatalog,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = (): CatalogContextValue => {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error('useCatalog debe usarse dentro de un CatalogProvider');
  }
  return ctx;
};
