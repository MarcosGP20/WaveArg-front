import { Producto } from "@/interfaces/producto";

export const MOCK_PRODUCTS: Producto[] = [
  {
    id: 1,
    nombre: "iPhone 15 Pro",
    modelo: "iPhone 15",
    descripcion: "El iPhone 15 Pro es el primer iPhone con diseño de titanio de calidad aeroespacial, fabricado con la misma aleación que se usa en las maves espaciales para misiones a Marte.",
    stockTotal: 15,
    imagenes: [
      "https://http2.mlstatic.com/D_Q_NP_633784-MLA95495918012_102025-O.webp"
    ],
    variantes: [
      {
        id: 101,
        color: "Blue Titanium",
        memoria: "128GB",
        precio: 1050000,
        stock: 5,
        esUsado: false,
        detalleEstado: "Nuevo en caja sellada",
        fotoEstadoUrl: null,
      },
      {
        id: 102,
        color: "Natural Titanium",
        memoria: "256GB",
        precio: 1150000,
        stock: 10,
        esUsado: false,
        detalleEstado: "Nuevo en caja sellada",
        fotoEstadoUrl: null,
      }
    ]
  },
  {
    id: 2,
    nombre: "iPhone 14",
    modelo: "iPhone 14",
    descripcion: "El iPhone 14 trae una pantalla Super Retina XDR espectacular, batería para todo el día y un sistema de dos cámaras espectacular.",
    stockTotal: 8,
    imagenes: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-midnight-select-202209?wid=940&hei=1112&fmt=png-alpha"
    ],
    variantes: [
      {
        id: 201,
        color: "Midnight",
        memoria: "128GB",
        precio: 850000,
        stock: 3,
        esUsado: true,
        detalleEstado: "Batería 92%, detalles mínimos en los bordes",
        fotoEstadoUrl: null,
      },
      {
        id: 202,
        color: "Starlight",
        memoria: "256GB",
        precio: 950000,
        stock: 5,
        esUsado: false,
        detalleEstado: "Nuevo en caja sellada",
        fotoEstadoUrl: null,
      }
    ]
  },
  {
    id: 3,
    nombre: "iPhone 13",
    modelo: "iPhone 13",
    descripcion: "Un superpoder en tus manos. Chip A15 Bionic rápido, y una batería con gran salto en autonomía.",
    stockTotal: 12,
    imagenes: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pink-select-2021?wid=940&hei=1112&fmt=png-alpha"
    ],
    variantes: [
      {
        id: 301,
        color: "Pink",
        memoria: "128GB",
        precio: 650000,
        stock: 12,
        esUsado: true,
        detalleEstado: "Batería 88%, sin rayaduras en pantalla",
        fotoEstadoUrl: null,
      }
    ]
  },
  {
    id: 4,
    nombre: "iPhone 16 Pro",
    modelo: "iPhone 16",
    descripcion: "El iPhone más avanzado con pantalla más grande, control de cámara de última generación y procesador A18 Pro.",
    stockTotal: 5,
    imagenes: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-desert-titanium-select-202409?wid=940&hei=1112&fmt=png-alpha"
    ],
    variantes: [
      {
        id: 401,
        color: "Titanio Desierto",
        memoria: "256GB",
        precio: 2150000,
        stock: 3,
        esUsado: false,
        detalleEstado: "Nuevo en caja sellada",
        fotoEstadoUrl: null,
      },
      {
        id: 402,
        color: "Titanio Negro",
        memoria: "512GB",
        precio: 2450000,
        stock: 2,
        esUsado: false,
        detalleEstado: "Nuevo",
        fotoEstadoUrl: null,
      }
    ]
  },
  {
    id: 5,
    nombre: "iPhone 12",
    modelo: "iPhone 12",
    descripcion: "Velocidad 5G. Chip A14 Bionic, rapidísimo. Pantalla OLED de borde a borde y protección Ceramic Shield.",
    stockTotal: 4,
    imagenes: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-black-select-2020?wid=940&hei=1112&fmt=png-alpha"
    ],
    variantes: [
      {
        id: 501,
        color: "Negro",
        memoria: "64GB",
        precio: 450000,
        stock: 1,
        esUsado: true,
        detalleEstado: "Batería 85%, pantalla impecable",
        fotoEstadoUrl: null,
      },
      {
        id: 502,
        color: "Blanco",
        memoria: "128GB",
        precio: 520000,
        stock: 3,
        esUsado: false,
        detalleEstado: "Sellado",
        fotoEstadoUrl: null,
      }
    ]
  },
  {
    id: 6,
    nombre: "iPhone 11",
    modelo: "iPhone 11",
    descripcion: "Doble cámara, batería para todo el día y el vidrio más resistente en un smartphone. Es la opción perfecta para empezar.",
    stockTotal: 2,
    imagenes: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone11-black-select-2019?wid=940&hei=1112&fmt=png-alpha"
    ],
    variantes: [
      {
        id: 601,
        color: "Negro",
        memoria: "64GB",
        precio: 350000,
        stock: 2,
        esUsado: true,
        detalleEstado: "Batería 100%, equipo como nuevo",
        fotoEstadoUrl: null,
      }
    ]
  }
];
