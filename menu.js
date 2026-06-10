// ========================================
//   Mikami Sushi — Dados do Cardápio
// ========================================

const menuItems = {
  combos: [
    {
      id: 101,
      name: "Temaki + Hot Roll",
      desc: "Temaki de salmão frito + 10 peças de hot roll de salmão.",
      price: 37.0,
      img: "img/combos/combo1.jpeg",
    },
    {
      id: 102,
      name: "Mini Dog + Croquete + Uramaki",
      desc: "Mini dog de salmão + 3 croquetes de salmão + 3 uramaki.",
      price: 32.0,
      img: "img/combos/combo2.jpeg",
    },
    {
      id: 103,
      name: "Hot Skim + Uramaki + Rosomaki",
      desc: "10 hot skim + 8 uramaki salmão + 8 rosomaki de Kani.",
      price: 43.0,
      img: "img/combos/combo3.jpeg",
    },
    {
      id: 104,
      name: "20 Hot Roll Sortidas",
      desc: "20 peças de hot roll sortidas (salmão skim e Kani).",
      price: 32.0,
      img: "img/combos/combo4.jpeg",
    },
    {
      id: 105,
      name: "Joe + Niguiri + Mix",
      desc: "2 joe, 2 niguiri, 5 uramaki, 5 hosomaki, 6 hot roll.",
      price: 46.0,
      img: "img/combos/combo5.jpeg",
    },
  ],

  individuais: [
    {
      id: 201,
      name: "Uramaki de Salmão",
      desc: "Uramaki de salmão.",
      price: 16.0,
      img: "img/individuais/uramaki.jpg",
    },
    {
      id: 202,
      name: "Hot Roll",
      desc: "Hot roll, sabores: salmão, Kani, skim.",
      price: 16.0,
      img: "img/individuais/hotroll1.jpg",
    },
    {
      id: 203,
      name: "Hosomaki de Salmão",
      desc: "Hosomaki de salmão.",
      price: 16.0,
      img: "img/individuais/hossomaki.jpg",
    },
    {
      id: 204,                              // era 203 — corrigido
      name: "Hot Roll Camarão",
      desc: "Hot Roll com camarão.",
      price: 25.0,
      img: "img/individuais/rotrollacamarão1.jpeg",
    },
    {
      id: 205,
      name: "Croquete de Salmão (6 un.)",
      desc: "Croquete de salmão, 6 unidades.",
      price: 15.0,
      img: "img/individuais/croquetesalm.jpg",
    },
    {
      id: 207,
      name: "Hot Dog Salmão",
      desc: "Hot dog no estilo sushi com salmão.",
      price: 30.0,
      img: "img/individuais/sushidog.jpg",
    },
    {
      id: 208,
      name: "Hot Dog Salmão e Camarão",
      desc: "Hot dog no estilo sushi com salmão e camarão.",
      price: 35.0,
      img: "img/individuais/sushidogcamarão.jpg",
    },
    {
      id: 209,
      name: "Sunomo",
      desc: "Sunomo tradicional.",
      price: 10.0,
      img: "img/individuais/sunomono.jpg",
    },
    {
      id: 210,
      name: "Poke 500ml",
      desc: "Arroz gohan, cream cheese, manga, sunomono, Kani, salmão grelhado, cebola roxa, couve crispy.",
      price: 37.0,
      img: "img/individuais/poke.jpeg",
    },
    {
      id: 211,
      name: "Camarão ao Alho e Óleo 250g",
      desc: "Camarão ao Alho e Óleo, porção de 250g.",
      price: 25.0,
      img: "img/individuais/camaraoaoalhoeoleo.jpeg",
    },
    {
      id: 212,
      name: "Batata Frita P",
      desc: "Porção de Batata Frita tam: P",
      price: 10.0,
      img: "img/individuais/batatafritaP.png",
    },
    {
      id: 213,
      name: "Batata Frita G",
      desc: "Porção de Batata Frita tam: G",
      price: 20.0,
      img: "img/individuais/batatafritaG.png",
    },
  ],

  especiais: [
    {
      id: 301,
      name: "Uramaki de Kani com Camarão",
      desc: "Uramaki de Kani com camarão.",
      price: 27.0,
      img: "img/especiais/uramakikanicamarao.jpeg",
    },
    {
      id: 302,
      name: "Uramaki Especial",
      desc: "Uramaki Especial.",
      price: 27.0,
      img: "img/especiais/uramakiespecial.jpeg",
    },
    {
      id: 303,
      name: "Hot Especial",
      desc: "Hot especial da casa.",
      price: 22.0,
      img: "img/especiais/hotrollespecial.jpg",
    },
    {
      id: 304,
      name: "Nathos de Salmão com Doritos",
      desc: "Nathos de salmão com doritos.",
      price: 15.0,
      img: "img/especiais/natchosdoritos.jpeg",
    },
    {
      id: 305,
      name: "Joe",
      desc: "Joe Sushi.",
      price: 18.0,
      img: "img/especiais/joeespecial.jpeg",
    },
    {
      id: 306,
      name: "Niguiri Salmão",
      desc: "Niguiri Salmão.",
      price: 18.0,
      img: "img/especiais/niguirisalmao.jpeg",
    },
    {
      id: 307,
      name: "Mikami Supremo 500g",
      desc: "Mikami Supremo 500g.",
      price: 55.0,
      img: "img/especiais/mikamisupremo.jpeg",
    },
  ],

  temakis: [
    {
      id: 401,
      name: "Temaki de Copo — Salmão",
      desc: "Temaki de copo com salmão.",
      price: 28.0,
      img: "img/temakis/temakicopo.jpg",
    },
    {
      id: 402,
      name: "Temaki de Salmão",
      desc: "Temaki de salmão.",
      price: 25.0,
      img: "img/temakis/temaki.jpg",
    },
    {
      id: 403,
      name: "Temaki de Kani",
      desc: "Temaki de Kani.",
      price: 22.0,
      img: "img/temakis/temakikani.jpeg",
    },
    {
      id: 404,
      name: "Temaki de Skin",
      desc: "Temaki de skin.",
      price: 21.0,
      img: "img/temakis/temakiskin.jpeg",
    },
    {
      id: 405,
      name: "Temaki de Camarão",
      desc: "Temaki de camarão.",
      price: 30.0,
      img: "img/temakis/temakicamarao.jpeg",
    },
  ],

  yakisoba: [
    {
      id: 501,
      name: "Yakisoba Individual",
      desc: "Yakisoba individual.",
      price: 20.0,
      img: "img/yakisoba/yakisoba.jpg",
    },
    {
      id: 502,
      name: "Yakisoba para 2 Pessoas",
      desc: "Yakisoba para 2 pessoas.",
      price: 30.0,
      img: "img/yakisoba/yakisoba.jpg",
    },
  ],

  doces: [
    {
      id: 601,
      name: "Harumaki de Banana com Nutella",
      desc: "Harumaki doce recheado com banana e Nutella.",
      price: 20.0,
      img: "img/peçasdoces/harumakinutela.jpg",
    },
    {
      id: 602,
      name: "Harumaki Nutella + Doce de Leite + Romeu e Julieta",
      desc: "Harumaki com Nutella, doce de leite e Romeu e Julieta.",
      price: 15.0,
      img: "img/peçasdoces/harumakidocedeleite.jpg",
    },
  ],

  bebidas: [
    {
      id: 701,
      name: "Coca Zero Lata (350ml)",
      desc: "Refrigerante Coca-Cola Zero em lata.",
      price: 6.0,
      img: "img/bebidas/cocazero.jpg",
    },
    {
      id: 702,
      name: "Coca Cola Lata (350ml)",
      desc: "Refrigerante Coca-Cola em lata.",
      price: 6.0,
      img: "img/bebidas/cocalata.jpg",
    },
    {
      id: 703,
      name: "Guaraná Antarctica (350ml)",
      desc: "Refrigerante Guaraná Antarctica em lata.",
      price: 6.0,
      img: "img/bebidas/guarana.png",
    },
    {
      id: 704,                              // era 703 — corrigido
      name: "Guaraná Antarctica Zero (350ml)",
      desc: "Refrigerante Guaraná Antarctica Zero em lata.",
      price: 6.0,
      img: "img/bebidas/guaranazero.png",
    },
    {
      id: 705,                              // era 704
      name: "H2O Limoneto (500ml)",
      desc: "Refrigerante H2O Limoneto em garrafa pet.",
      price: 7.0,
      img: "img/bebidas/h2o.png",
    },
    {
      id: 706,                              // era 711 — corrigido
      name: "Guaraná Antarctica (1L)",
      desc: "Guaraná 1 Litro.",
      price: 10.0,
      img: "img/bebidas/guarana1l.png",
    },
    {
      id: 707,
      name: "Água",
      desc: "Água mineral.",
      price: 3.0,
      img: "img/bebidas/agua.png",
    },
    {
      id: 708,
      name: "Água com Gás",
      desc: "Água mineral com gás.",
      price: 4.0,
      img: "img/bebidas/aguacomgas.png",
    },
    {
      id: 709,
      name: "Suco Copo",
      desc: "Suco natural no copo.",
      price: 8.0,
      img: "img/bebidas/sucocopo.jpg",   // movido pra local — sem Unsplash externo
    },
    {
      id: 710,
      name: "Suco Jarra",
      desc: "Suco natural na jarra.",
      price: 15.0,
      img: "img/bebidas/sucojarra.jpg",
    },
    {
      id: 711,                              // era duplicata de 711 — mantido para Suco Laranja
      name: "Suco Laranja com Morango",
      desc: "Suco da fruta laranja com morango.",
      price: 10.0,
      img: "img/bebidas/sucolaranjamorango.jpeg",
    },
  ],
};

// ========================================
//   Renderização
// ========================================

function formatPrice(price) {
  if (price === 0) return "Consulte";
  return "R$ " + price.toFixed(2).replace(".", ",");
}

function createMenuItemHTML(item) {
  return `
    <article class="menu-item">
      <div class="item-image">
        <img src="${item.img}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="item-content">
        <h3>${item.name}</h3>
        <p class="item-desc">${item.desc}</p>
        <div class="item-footer">
          <span class="item-price">${formatPrice(item.price)}</span>
          <button
            class="btn-add"
            data-id="${item.id}"
            data-name="${item.name}"
            data-price="${item.price}"
            aria-label="Adicionar ${item.name}"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderMenus() {
  Object.entries(menuItems).forEach(([category, items]) => {
    const grid = document.getElementById(`${category}-items`);
    if (!grid) return;
    grid.innerHTML = items.map(createMenuItemHTML).join("");
  });
}

document.addEventListener("DOMContentLoaded", renderMenus);