(function () {
  const photo = (file) => `assets/images/${file}`;
  const pictures = {
    wood: [
      photo('wood-grain.webp'),
      photo('wood-sheets.webp'),
      photo('wood-cross-section.webp')
    ],
    finishes: [
      photo('laminate-swatch.webp'),
      photo('laminate-samples.webp')
    ],
    marble: [
      photo('marble-light.webp'),
      photo('marble-dark.webp')
    ],
    granite: [
      photo('granite-surface.webp'),
      photo('stone-samples.webp')
    ],
    tiles: [
      photo('tile-ceramic.webp'),
      photo('tile-textured.webp')
    ],
    hardware: [
      photo('hardware-hinge.webp'),
      photo('hardware-hinge.webp'),
      photo('hardware-handle.webp'),
      photo('hardware-knob.webp'),
      photo('hardware-hinge.webp'),
      photo('hardware-handle.webp')
    ]
  };

  const chapterDefinitions = [
    {
      id: 'wood',
      title: 'Wood & Plywood',
      description: 'Wood species, sheet materials and decorative panels. Images are illustrative references only.',
      products: ['Teak Wood', 'Oak Wood', 'Walnut Wood', 'Pine Wood', 'Hardwood', 'Plywood', 'MDF Boards', 'Veneer Sheets', 'Decorative Wood Panels', 'Wooden Textures']
    },
    {
      id: 'finishes',
      title: 'Laminates & Finishes',
      description: 'Surface-finish references for cabinets, furniture and interior joinery.',
      products: ['Matte Laminates', 'Glossy Laminates', 'Wooden Finish Laminates', 'Textured Laminates', 'Decorative Laminates', 'Acrylic Finishes', 'PVC Finishes']
    },
    {
      id: 'marble',
      title: 'Marble',
      description: 'Natural-stone colour and veining inspiration. Exact stone and availability are unconfirmed.',
      products: ['White Marble', 'Beige Marble', 'Grey Marble', 'Black Marble', 'Italian Marble Styles', 'Natural Stone Patterns']
    },
    {
      id: 'granite',
      title: 'Granite',
      description: 'Granite-colour and polish references. Confirm the stone, grade and finish in person.',
      products: ['Black Granite', 'White Granite', 'Brown Granite', 'Grey Granite', 'Polished Granite', 'Natural Granite Patterns']
    },
    {
      id: 'tiles',
      title: 'Tiles',
      description: 'Tile-format and surface inspiration for walls, floors, kitchens and bathrooms.',
      products: ['Vitrified Tiles', 'Ceramic Tiles', 'Porcelain Tiles', 'Bathroom Tiles', 'Kitchen Tiles', 'Wall Tiles', 'Floor Tiles', 'Wooden Finish Tiles', 'Decorative Tiles']
    },
    {
      id: 'hardware',
      title: 'Hardware & Fittings',
      description: 'Common fitting types for cabinetry and furniture. Brands and specifications are not listed.',
      products: ['Cabinet Hinges', 'Drawer Channels', 'Handles', 'Kitchen Accessories', 'Furniture Fittings', 'Modular Hardware']
    }
  ];

  const productCounters = Object.create(null);
  window.HARI_OM_CHAPTERS = chapterDefinitions;
  window.HARI_OM_MATERIALS = chapterDefinitions.flatMap((chapter) => chapter.products.map((name, index) => {
    const imageList = pictures[chapter.id];
    const photoIndex = productCounters[chapter.id] || 0;
    productCounters[chapter.id] = photoIndex + 1;
    return {
      id: `${chapter.id}-${index + 1}`,
      name,
      category: chapter.id,
      categoryName: chapter.title,
      description: chapter.description,
      image: imageList[photoIndex % imageList.length],
      alt: `${name} illustrative material reference; exact material and finish are unconfirmed`
    };
  }));
})();
