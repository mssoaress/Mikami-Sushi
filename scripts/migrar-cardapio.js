// ============================================================
// scripts/migrar-cardapio.js
// ============================================================
// Roda UMA VEZ, localmente, no seu computador (nunca no navegador):
//   1. Envia cada imagem que já existe em public/img pro Cloudinary,
//      convertendo para .webp.
//   2. Cria um produto em produtos_site no Firestore pra cada item,
//      já apontando pra URL do Cloudinary.
//
// Como rodar:
//   1. npm install   (instala o pacote "cloudinary" que adicionei)
//   2. Defina as variáveis de ambiente com sua chave (NÃO cole a
//      chave direto no código — assim ela nunca vai parar no Git):
//
//      No Mac/Linux:
//        export CLOUDINARY_CLOUD_NAME=dnxnmjihb
//        export CLOUDINARY_API_KEY=152739294555486
//        export CLOUDINARY_API_SECRET=ws6L1KNZMXB_kV9j-3_CdV_1qV0
//
//      No Windows (PowerShell):
//        $env:CLOUDINARY_CLOUD_NAME="dnxnmjihb"
//        $env:CLOUDINARY_API_KEY="152739294555486"
//        $env:CLOUDINARY_API_SECRET="ws6L1KNZMXB_kV9j-3_CdV_1qV0"
//
//   3. npm run migrar-cardapio
//
// É seguro rodar mais de uma vez: produtos que já existem no Firestore
// (mesmo id) são pulados, não duplica nada.
// ============================================================

import { v2 as cloudinary } from 'cloudinary';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---- Config Cloudinary (vem das variáveis de ambiente) ----
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('\n❌ Faltam as variáveis de ambiente do Cloudinary. Veja o comentário no topo deste arquivo.\n');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

// ---- Config Firebase (mesmo projeto usado pelo site e pelo admin) ----
const firebaseConfig = {
  apiKey: "AIzaSyA2NZjr6ACdBhTE8yqy2LJpqituUnHChb4",
  authDomain: "mikami-sushi.firebaseapp.com",
  projectId: "mikami-sushi",
  storageBucket: "mikami-sushi.firebasestorage.app",
  messagingSenderId: "1008214343375",
  appId: "1:1008214343375:web:bbb7cdd7cbc7aa393641ba"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---- Catálogo atual (o mesmo que estava em src/data/menuItems.js) ----
const CATALOGO = [
  // Combos
  { id: 101, nome: "Temaki + Hot Roll", descricao: "Temaki de salmão frito + 10 peças de hot roll de salmão.", preco: 37.0, categoria: "Combos", arquivo: "combos/combo1.jpeg" },
  { id: 102, nome: "Mini Dog + Croquete + Uramaki", descricao: "Mini dog de salmão + 3 croquetes de salmão + 3 uramaki.", preco: 32.0, categoria: "Combos", arquivo: "combos/combo2.jpeg" },
  { id: 103, nome: "Hot Skim + Uramaki + Rosomaki", descricao: "10 hot skim + 8 uramaki salmão + 8 rosomaki de Kani.", preco: 43.0, categoria: "Combos", arquivo: "combos/combo3.jpeg" },
  { id: 104, nome: "20 Hot Roll Sortidas", descricao: "20 peças de hot roll sortidas (salmão skim e Kani).", preco: 30.0, categoria: "Combos", arquivo: "combos/combo4.jpeg" },
  { id: 105, nome: "Joe + Niguiri + Mix", descricao: "2 joe, 2 niguiri, 5 uramaki, 5 hosomaki, 6 hot roll.", preco: 46.0, categoria: "Combos", arquivo: "combos/combo5.jpeg" },
  // Individuais
  { id: 201, nome: "Uramaki de Salmão", descricao: "Uramaki de salmão.", preco: 16.0, categoria: "Individuais", arquivo: "individuais/uramaki.jpg" },
  { id: 202, nome: "Hot Roll", descricao: "Hot roll, sabores: salmão, Kani, skim.", preco: 16.0, categoria: "Individuais", arquivo: "individuais/hotroll1.jpg" },
  { id: 203, nome: "Hosomaki de Salmão", descricao: "Hosomaki de salmão.", preco: 16.0, categoria: "Individuais", arquivo: "individuais/hossomaki.jpg" },
  { id: 204, nome: "Hot Roll Camarão", descricao: "Hot Roll com camarão.", preco: 25.0, categoria: "Individuais", arquivo: "individuais/rotrollacamarão1.jpeg" },
  { id: 205, nome: "Croquete de Salmão (6 un.)", descricao: "Croquete de salmão, 6 unidades.", preco: 15.0, categoria: "Individuais", arquivo: "individuais/croquetesalm.jpg" },
  { id: 207, nome: "Hot Dog Salmão", descricao: "Hot dog no estilo sushi com salmão.", preco: 30.0, categoria: "Individuais", arquivo: "individuais/sushidog.jpg" },
  { id: 208, nome: "Hot Dog Salmão e Camarão", descricao: "Hot dog no estilo sushi com salmão e camarão.", preco: 35.0, categoria: "Individuais", arquivo: "individuais/sushidogcamarão.jpg" },
  { id: 209, nome: "Sunomo", descricao: "Sunomo tradicional.", preco: 10.0, categoria: "Individuais", arquivo: "individuais/sunomono.jpg" },
  { id: 214, nome: "Kani de Queijo", descricao: "Kani sabor queijo (6 un.)", preco: 15.0, categoria: "Individuais", arquivo: "individuais/kani-queijo.jpeg" },
  { id: 210, nome: "Poke 500ml", descricao: "Arroz gohan, cream cheese, manga, sunomono, Kani, salmão grelhado, cebola roxa, couve crispy.", preco: 35.0, categoria: "Individuais", arquivo: "individuais/poke.jpeg" },
  { id: 211, nome: "Camarão ao Alho e Óleo 250g", descricao: "Camarão ao Alho e Óleo, porção de 250g.", preco: 25.0, categoria: "Individuais", arquivo: "individuais/camaraoaoalhoeoleo.jpeg" },
  { id: 212, nome: "Batata Frita P", descricao: "Porção de Batata Frita tam: P", preco: 10.0, categoria: "Individuais", arquivo: "individuais/batatafritaP.png" },
  { id: 213, nome: "Batata Frita G", descricao: "Porção de Batata Frita tam: G", preco: 20.0, categoria: "Individuais", arquivo: "individuais/batatafritaG.png" },
  // Especiais
  { id: 301, nome: "Uramaki de Kani com Camarão", descricao: "Uramaki de Kani com camarão.", preco: 27.0, categoria: "Especiais", arquivo: "especiais/uramakikanicamarao.jpeg" },
  { id: 302, nome: "Uramaki Especial", descricao: "Uramaki Especial.", preco: 27.0, categoria: "Especiais", arquivo: "especiais/uramakiespecial.jpeg" },
  { id: 303, nome: "Hot Especial", descricao: "Hot especial da casa.", preco: 22.0, categoria: "Especiais", arquivo: "especiais/hotrollespecial.jpg" },
  { id: 304, nome: "Nathos de Salmão com Doritos", descricao: "Nathos de salmão com doritos.", preco: 15.0, categoria: "Especiais", arquivo: "especiais/natchosdoritos.jpeg" },
  { id: 305, nome: "Joe", descricao: "Joe Sushi.", preco: 18.0, categoria: "Especiais", arquivo: "especiais/joeespecial.jpeg" },
  { id: 306, nome: "Niguiri Salmão", descricao: "Niguiri Salmão.", preco: 18.0, categoria: "Especiais", arquivo: "especiais/niguirisalmao.jpeg" },
  { id: 307, nome: "Mikami Supremo 500g", descricao: "Mikami Supremo 500g.", preco: 55.0, categoria: "Especiais", arquivo: "especiais/mikamisupremo.jpeg" },
  { id: 308, nome: "Hossomaki Especial", descricao: "Hossomaki especial (8 un.)", preco: 22.0, categoria: "Especiais", arquivo: "especiais/hossomaki-especial.jpeg" },
  { id: 309, nome: "Joe Ebi Crocante", descricao: "Joe Ebi Crocante (6 Un.)", preco: 48.0, categoria: "Especiais", arquivo: "especiais/joeebicrocante.jpeg" },
  { id: 310, nome: "Uramaki Philadelphia + Lâminas de Sashimi", descricao: "10 Uramakis Philadelphia + 8 Lâminas de Sashimi", preco: 35.0, categoria: "Especiais", arquivo: "especiais/uramakiphiladelphiasashimi.jpeg" },
  { id: 311, nome: "Camarão Empanado", descricao: "Camarão Empanado (10 Un.)", preco: 25.0, categoria: "Especiais", arquivo: "especiais/camaraoempanado.jpeg" },
  // Temakis
  { id: 401, nome: "Temaki de Copo — Salmão", descricao: "Temaki de copo com salmão.", preco: 28.0, categoria: "Temakis", arquivo: "temakis/temakicopo.jpg" },
  { id: 402, nome: "Temaki de Salmão", descricao: "Temaki de salmão.", preco: 25.0, categoria: "Temakis", arquivo: "temakis/temaki.jpg" },
  { id: 403, nome: "Temaki de Kani", descricao: "Temaki de Kani.", preco: 22.0, categoria: "Temakis", arquivo: "temakis/temakikani.jpeg" },
  { id: 404, nome: "Temaki de Skin", descricao: "Temaki de skin.", preco: 21.0, categoria: "Temakis", arquivo: "temakis/temakiskin.jpeg" },
  { id: 405, nome: "Temaki de Camarão", descricao: "Temaki de camarão.", preco: 30.0, categoria: "Temakis", arquivo: "temakis/temakicamarao.jpeg" },
  // Yakisoba
  { id: 501, nome: "Yakisoba Individual", descricao: "Yakisoba individual.", preco: 20.0, categoria: "Yakisoba", arquivo: "yakisoba/yakisoba.jpg" },
  { id: 502, nome: "Yakisoba para 2 Pessoas", descricao: "Yakisoba para 2 pessoas.", preco: 30.0, categoria: "Yakisoba", arquivo: "yakisoba/yakisobap2.png" },
  // Peças Doces
  { id: 601, nome: "Harumaki de Banana com Nutella", descricao: "Harumaki doce recheado com banana e Nutella.", preco: 20.0, categoria: "Peças Doces", arquivo: "peçasdoces/harumakinutela.jpg" },
  { id: 602, nome: "Harumaki Nutella + Doce de Leite + Romeu e Julieta", descricao: "Harumaki com Nutella, doce de leite e Romeu e Julieta.", preco: 15.0, categoria: "Peças Doces", arquivo: "peçasdoces/harumakidocedeleite.jpg" },
  { id: 603, nome: "Brownie com Sorvete", descricao: "Brownie com Sorvete e cobertura de chocolate.", preco: 15.0, categoria: "Peças Doces", arquivo: "peçasdoces/browniecomsorvete.png" },
  // Bebidas
  { id: 701, nome: "Coca Zero Lata (350ml)", descricao: "Refrigerante Coca-Cola Zero em lata.", preco: 6.0, categoria: "Bebidas", arquivo: "bebidas/cocazero.jpg" },
  { id: 702, nome: "Coca Cola Lata (350ml)", descricao: "Refrigerante Coca-Cola em lata.", preco: 6.0, categoria: "Bebidas", arquivo: "bebidas/cocalata.jpg" },
  { id: 703, nome: "Guaraná Antarctica (350ml)", descricao: "Refrigerante Guaraná Antarctica em lata.", preco: 6.0, categoria: "Bebidas", arquivo: "bebidas/guarana.png" },
  { id: 704, nome: "Guaraná Antarctica Zero (350ml)", descricao: "Refrigerante Guaraná Antarctica Zero em lata.", preco: 6.0, categoria: "Bebidas", arquivo: "bebidas/guaranazero.png" },
  { id: 705, nome: "H2O Limoneto (500ml)", descricao: "Refrigerante H2O Limoneto em garrafa pet.", preco: 7.0, categoria: "Bebidas", arquivo: "bebidas/h2o.png" },
  { id: 706, nome: "Guaraná Antarctica (1L)", descricao: "Guaraná 1 Litro.", preco: 10.0, categoria: "Bebidas", arquivo: "bebidas/guarana1l.png" },
  { id: 707, nome: "Água", descricao: "Água mineral.", preco: 3.0, categoria: "Bebidas", arquivo: "bebidas/agua.png" },
  { id: 708, nome: "Água com Gás", descricao: "Água mineral com gás.", preco: 4.0, categoria: "Bebidas", arquivo: "bebidas/aguacomgas.png" },
  { id: 709, nome: "Suco Copo", descricao: "Suco natural no copo.", preco: 8.0, categoria: "Bebidas", arquivo: "bebidas/sucocopo.png" },
  { id: 710, nome: "Suco Jarra", descricao: "Suco natural na jarra.", preco: 15.0, categoria: "Bebidas", arquivo: "bebidas/sucojarra.jpg" },
  { id: 711, nome: "Suco Laranja com Morango", descricao: "Suco da fruta laranja com morango.", preco: 10.0, categoria: "Bebidas", arquivo: "bebidas/sucolaranjamorango.jpeg" },
];

// Produtos que aparecem na seção "Destaques da Mikami" da home
const DESTAQUE_IDS = {
  307: "Especial", 305: "Especial",
  101: "Combo", 105: "Combo",
  210: "Individual", 207: "Individual",
  401: "Temaki", 405: "Temaki",
  501: "Yakisoba", 502: "Yakisoba",
  603: "Doce", 601: "Doce",
};

async function main() {
  console.log(`\n🍣 Migrando ${CATALOGO.length} produtos para Cloudinary + Firestore...\n`);

  let enviados = 0, pulados = 0, erros = 0;

  for (let i = 0; i < CATALOGO.length; i++) {
    const item = CATALOGO[i];
    const docId = String(item.id);
    const ref = doc(db, "produtos_site", docId);

    try {
      const existente = await getDoc(ref);
      if (existente.exists() && existente.data().img?.includes("res.cloudinary.com")) {
        console.log(`⏭️  [${item.id}] ${item.nome} — já migrado, pulando.`);
        pulados++;
        continue;
      }

      const caminhoLocal = path.join(__dirname, "..", "public", "img", item.arquivo);
      console.log(`⬆️  [${item.id}] ${item.nome} — enviando imagem...`);

      const upload = await cloudinary.uploader.upload(caminhoLocal, {
        folder: `mikami-sushi/${item.categoria.toLowerCase().replace(/\s+/g, "-")}`,
        public_id: docId,
        format: "webp",
        overwrite: true,
      });

      await setDoc(ref, {
        nome: item.nome,
        descricao: item.descricao,
        preco: item.preco,
        categoria: item.categoria,
        img: upload.secure_url,
        disponivel: true,
        destaque: !!DESTAQUE_IDS[item.id],
        tag: DESTAQUE_IDS[item.id] || "",
        ordem: i,
      });

      console.log(`   ✅ ${upload.secure_url}`);
      enviados++;
    } catch (err) {
      console.error(`   ❌ Erro no item ${item.id} (${item.nome}):`, err.message);
      erros++;
    }
  }

  console.log(`\n──────────────────────────────`);
  console.log(`✅ Enviados: ${enviados}`);
  console.log(`⏭️  Já existiam: ${pulados}`);
  console.log(`❌ Erros: ${erros}`);
  console.log(`──────────────────────────────\n`);
  process.exit(erros > 0 ? 1 : 0);
}

main();
