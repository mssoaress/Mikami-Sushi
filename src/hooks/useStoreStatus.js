import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const MENSAGEM_PADRAO = 'No momento não estamos fazendo delivery. Assim que voltarmos a atender, você já pode finalizar seu pedido normalmente.';

export function useStoreStatus() {
  const [retryKey, setRetryKey] = useState(0);
  const [status, setStatus] = useState({
    isOpen: false,
    message: MENSAGEM_PADRAO,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const ref = doc(db, 'config', 'loja');
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setStatus({
            isOpen: false,
            message: 'Não foi possível confirmar se a loja está aberta. Tente novamente em instantes.',
            loading: false,
            error: 'Status da loja não configurado.',
          });
          return;
        }
        const data = snap.data();
        setStatus({
          isOpen: data.aberto !== false,
          message: data.motivo || MENSAGEM_PADRAO,
          loading: false,
          error: null,
        });
      },
      (err) => {
        console.error('Não foi possível verificar o status da loja:', err);
        setStatus({
          isOpen: false,
          message: 'Não foi possível confirmar se a loja está aberta. Verifique sua conexão e tente novamente.',
          loading: false,
          error: 'Falha ao consultar o status da loja.',
        });
      }
    );
    return () => unsubscribe();
  }, [retryKey]);

  return {
    ...status,
    retry: () => {
      setStatus((previous) => ({ ...previous, loading: true, error: null }));
      setRetryKey((value) => value + 1);
    },
  };
}
