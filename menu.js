// ========================================
//   Mikami Sushi — Dados do Cardápio
// ========================================
// Mikami Sushi
const menuItems = {
  combos: [
    {
      id: 101,
      name: "Temaki + Hot Roll",
      desc: "Temaki de salmão frito + 10 peças de hot rol de salmão.",
      price: 37.00,
      img: "img/combos/combo1.jpeg",
    },
    {
      id: 102,
      name: "Mini Dog + Croquete + Uramaki",
      desc: "Mini dog de salmão + 3 croquetes de salmão + 3 uramaki.",
      price: 32.00,
      img: "img/combos/combo2.jpeg",
    },
    {
      id: 103,
      name: "Hot Skim + Uramaki + Rosomaki",
      desc: "10 hot skim + 10 uramaki salmão + 10 rosomaki de Kani.",
      price: 43.00,
      img: "img/combos/combo3.jpeg",
    },
    {
      id: 104,
      name: "20 Hot Holl Sortidas",
      desc: "20 peças de hot holl sortidas (salmão skim e Kani).",
      price: 32.00,
      img: "img/combos/combo4.jpeg",
    },
    {
      id: 105,
      name: "Joe + Niguiri + Mix",
      desc: "2 joe, 2 niguiri, 5 uramaki, 5 hosomaki, 6 hot holl.",
      price: 46.00,
      img: "img/combos/combo5.jpeg",
    },
  ],

  individuais: [
    {
      id: 201,
      name: "Uramaki de Salmão",
      desc: "Uramaki de salmão.",
      price: 16.00,
      img: "img/individuais/uramaki.jpg",
    },
    {
      id: 202,
      name: "Hot Holl",
      desc: "Hot holl, sabores: salmão, Kani, skim.",
      price: 16.00,
      img: "img/individuais/hotroll1.jpg",
    },
    {
      id: 203,
      name: "Hosomaki de Salmão",
      desc: "Hosomaki de salmão.",
      price: 16.00,
      img: "img/individuais/hossomaki.jpg",
    },
    {
      id: 205,
      name: "Croquete de Salmão (6 un.)",
      desc: "Croquete de salmão, 6 unidades.",
      price: 15.00,
      img: "img/individuais/croquetesalm.jpg",
    },
    {
      id: 206,
      name: "Kani Camarão (6 un.)",
      desc: "Kani Camarão, 6 unidades.",
      price: 15.00,
      img: "img/individuais/kanicamarao.jpg",
    },
    {
      id: 207,
      name: "Hot Dog Salmão",
      desc: "Hot dog no estilo sushi com salmão.",
      price: 30.00,
      img: "img/individuais/sushidog.jpg",
    },
    {
      id: 208,
      name: "Hot Dog Salmão e Camarão",
      desc: "Hot dog no estilo sushi com salmão e camarão.",
      price: 35.00,
      img: "img/individuais/sushidogcamarão.jpg",
    },
    {
      id: 209,
      name: "Sunomo",
      desc: "Sunomo tradicional.",
      price: 10.00,
      img: "img/individuais/sunomono.jpg",
    },
    {
      id: 210,
      name: "Poke 500ml",
      desc: "Arroz gohan, cream cheese, manga, sunomono, Kani, salmão grelhado, cebola roxa, couve crispy.",
      price: 37.00,
      img: "img/individuais/poke.jpeg",
    },
  ],

  especiais: [
    {
      id: 301,
      name: "Uramaki de Kani com Camarão",
      desc: "Uramaki de Kani com camarão.",
      price: 27.00,
      img: "img/especiais/uramakikanicamarao.jpeg",
    },
    {
      id: 302,
      name: "Uramaki Especial",
      desc: "Uramaki Especial.",
      price: 27.00,
      img: "img/especiais/uramakiespecial.jpeg",
    },
    {
      id: 303,
      name: "Hot Especial",
      desc: "Hot especial da casa.",
      price: 22.00,
      img: "img/especiais/hotrollespecial.jpg",
    },
    {
      id: 304,
      name: "Nathos de Salmão com Doritos",
      desc: "Nathos de salmão com doritos.",
      price: 15.00,
      img: "img/especiais/natchosdoritos.jpeg",
    },
    {
      id: 305,
      name: "Joe (3 un.)",
      desc: "Joe, 3 unidades.",
      price: 18.00,
      img: "img/especiais/joeespecial.jpeg",
    },
    {
      id: 306,
      name: "Niguiri Salmão",
      desc: "Niguiri Salmão.",
      price: 15.00,
      img: "img/especiais/niguirisalmao.jpeg",
    },
    {
      id: 307,
      name: "Mikami Supremo 500g",
      desc: "Mikami Supremo 500g.",
      price: 55.00,
      img: "img/especiais/mikamisupremo.jpeg",
    },
  ],

  temakis: [
    {
      id: 401,
      name: "Temaki de Copo — Salmão",
      desc: "Temaki de copo com salmão.",
      price: 28.00,
      img: "img/temakis/temakicopo.jpg",
    },
    {
      id: 402,
      name: "Temaki de Salmão",
      desc: "Temaki de salmão.",
      price: 25.00,
      img: "img/temakis/temaki.jpg",
    },
    {
      id: 403,
      name: "Temaki de Kani",
      desc: "Temaki de Kani.",
      price: 22.00,
      img:"img/temakis/temakikani.jpeg",
    },
    {
      id: 404,
      name: "Temaki de Skin",
      desc: "Temaki de skin.",
      price: 21.00,
      img: "img/temakis/temakiskin.jpeg",
    },
    {
      id: 405,
      name: "Temaki de Camarão",
      desc: "Temaki de camarão.",
      price: 30.00,
      img: "img/temakis/temakicamarao.jpeg",
    },
  ],

  yakisoba: [
    {
      id: 501,
      name: "Yakisoba Individual",
      desc: "Yakisoba individual.",
      price: 20.00,
      img: "img/yakisoba/yakisoba.jpg",
    },
    {
      id: 502,
      name: "Yakisoba para 2 Pessoas",
      desc: "Yakisoba para 2 pessoas.",
      price: 30.00,
      img: "img/yakisoba/yakisoba.jpg",
    },
  ],

  doces: [
    {
      id: 601,
      name: "Harumaki de Banana com Nutela",
      desc: "Harumaki doce recheado com banana e Nutela.",
      price: 20.00,
      img: "img/peçasdoces/harumakinutela.jpg",
    },
    {
      id: 602,
      name: "Harumaki Nutela + Doce de Leite + Romeu e Julieta",
      desc: "Harumaki com Nutela, doce de leite e Romeu e Julieta.",
      price: 15.00,
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
      price: 6.00,
      img: "img/bebidas/cocalata.jpg",
    },
    {
      id: 703,
      name: "Guaraná Antartica (350ml)",
      desc: "Refrigerante Guaraná Antartica em lata.",
      price: 6.00,
      img: "img/bebidas/guarana.png",
    },
    {
      id: 703,
      name: "Guaraná Antartica Zero (350ml)",
      desc: "Refrigerante Guaraná Antartica em lata.",
      price: 6.00,
      img: "img/bebidas/guaranazero.png",
    },
    {
      id: 704,
      name: "H2O Limoneto (500ml)",
      desc: "Refrigerante H2O Limoneto em garrafa pet.",
      price: 7.00,
      img: "img/bebidas/h2o.png",
    },
    {
      id: 707,
      name: "Água",
      desc: "Água mineral.",
      price: 3.00,
      img: "img/bebidas/agua.png",
    },
    {
      id: 708,
      name: "Água com Gás",
      desc: "Água mineral com gás.",
      price: 4.00,
      img: "img/bebidas/aguacomgas.png",
    },
    {
      id: 709,
      name: "Suco Copo",
      desc: "Suco natural no copo.",
      price: 8.00,
      img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
    },
    {
      id: 710,
      name: "Suco Jarra",
      desc: "Suco natural na jarra.",
      price: 15.00,
      img: "img/bebidas/sucojarra.jpg",
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