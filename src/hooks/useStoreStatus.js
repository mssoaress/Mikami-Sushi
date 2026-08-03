import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const MENSAGEM_PADRAO = 'No momento não estamos fazendo delivery. Assim que voltarmos a atender, você já pode finalizar seu pedido normalmente.';

// Escuta em tempo real o documento config/loja no Firestore (o mesmo que
// o painel admin controla na tela "Site"). Se o documento ainda não
// existir, ou se houver qualquer erro de leitura, assume loja aberta —
// assim um problema de conexão nunca bloqueia pedidos por engano.
export function useStoreStatus() {
  const [status, setStatus] = useState({
    isOpen: true,
    message: MENSAGEM_PADRAO,
    loading: true,
  });

  useEffect(() => {
    const ref = doc(db, 'config', 'loja');
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        const data = snap.exists() ? snap.data() : {};
        setStatus({
          isOpen: data.aberto !== false,
          message: data.motivo || MENSAGEM_PADRAO,
          loading: false,
        });
      },
      (err) => {
        console.error('Não foi possível verificar o status da loja:', err);
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    );
    return () => unsubscribe();
  }, []);

  return status;
}
