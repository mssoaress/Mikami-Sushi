import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// Escuta em tempo real o documento config/produtos no Firestore (controlado
// pelo painel admin, na tela "Site"). Retorna um Set com os ids dos
// produtos marcados como indisponíveis no momento.
export function useUnavailableProducts() {
  const [unavailable, setUnavailable] = useState(new Set());

  useEffect(() => {
    const ref = doc(db, 'config', 'produtos');
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        const data = snap.exists() ? snap.data() : {};
        setUnavailable(new Set(data.indisponiveis || []));
      },
      (err) => {
        console.error('Não foi possível verificar a disponibilidade dos produtos:', err);
      }
    );
    return () => unsubscribe();
  }, []);

  return unavailable;
}
