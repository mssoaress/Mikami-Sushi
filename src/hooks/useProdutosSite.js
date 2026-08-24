import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// Escuta em tempo real a coleção produtos_site no Firestore — o mesmo
// catálogo que o painel admin (aba "Site") gerencia. Substitui o antigo
// menuItems.js estático: agora o cardápio inteiro (nome, preço, foto,
// categoria, disponibilidade, destaque) é controlado pelo admin.
export function useProdutosSite() {
  const [state, setState] = useState({
    menuItems: {},   // { "Combos": [...], "Individuais": [...], ... }
    categorias: [],  // ordem de exibição das abas
    featured: [],    // produtos marcados como destaque
    destaqueDia: [], // produtos marcados como destaque do dia
    unavailable: new Set(),
    loading: true,
  });

  useEffect(() => {
    const ref = collection(db, 'produtos_site');
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        const produtos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const menuItems = {};
        const categorias = [];
        const unavailable = new Set();

        produtos
          .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
          .forEach((p) => {
            const cat = p.categoria || 'Outros';
            if (!menuItems[cat]) { menuItems[cat] = []; categorias.push(cat); }
            menuItems[cat].push(p);
            const semEstoque = (p.estoque !== null && p.estoque !== undefined) && p.estoque <= 0;
            if (p.disponivel === false || semEstoque) unavailable.add(p.id);
          });

        const featured = produtos
          .filter((p) => p.destaque)
          .sort((a, b) => (a.ordemDestaque ?? 0) - (b.ordemDestaque ?? 0));

        const destaqueDia = produtos
          .filter((p) => p.destaqueDia)
          .sort((a, b) => (a.ordemDestaqueDia ?? 0) - (b.ordemDestaqueDia ?? 0));

        setState({ menuItems, categorias, featured, destaqueDia, unavailable, loading: false });
      },
      (err) => {
        console.error('Não foi possível carregar os produtos do site:', err);
        setState((prev) => ({ ...prev, loading: false }));
      }
    );
    return () => unsubscribe();
  }, []);

  return state;
}
