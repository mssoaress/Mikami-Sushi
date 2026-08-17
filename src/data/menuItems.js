// O cardápio (produtos, categorias, destaques) agora vive no Firestore
// (coleção produtos_site), gerenciado pelo painel admin — veja
// src/hooks/useProdutosSite.js. Este arquivo guarda só o que ainda é
// fixo no código: opções de entrega e dados de contato/pagamento.

export const SHIPPING_OPTIONS = [
  { value: 'retirada',          price: 0,  icon: '🏠', label: 'Retirada',          display: 'Grátis',    free: true },
  { value: 'cidade',            price: 3,  icon: '📍', label: 'Cidade',            display: 'R$ 3,00' },
  { value: 'embebedado',        price: 5,  icon: '📍', label: 'Embebedado',        display: 'R$ 5,00' },
  { value: 'pedra_branca',      price: 6,  icon: '📍', label: 'Pedra Branca',      display: 'R$ 6,00' },
  { value: 'cumati',            price: 5,  icon: '📍', label: 'Cumati',            display: 'R$ 5,00' },
  { value: 'cecilia_de_cima',   price: 6,  icon: '📍', label: 'Cecília de Cima',   display: 'R$ 6,00' },
  { value: 'vilinha',           price: 6,  icon: '📍', label: 'Vilinha',           display: 'R$ 6,00' },
  { value: 'boi_seco',          price: 15, icon: '📍', label: 'Boi Seco',          display: 'R$ 15,00' },
  { value: 'vertente_do_lerio', price: 15, icon: '📍', label: 'Vertente do Lério', display: 'R$ 15,00' },
];

export const WHATSAPP_NUMBER = '558197781945';
export const PIX_KEY = '81997781945';
