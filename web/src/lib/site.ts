export const site = {
  name: "Norte Propiedades",
  shortName: "Norte",
  tagline: "Inmobiliaria en zona oeste",
  description:
    "Compra, venta y alquiler de propiedades en El Palomar, Haedo, Morón, Castelar y Ramos Mejía. Fotos reales, datos claros y acompañamiento hasta la firma.",
  url: process.env.PUBLIC_SITE_URL ?? "http://localhost:3105",
  phone: "+54 11 5339-3386",
  phoneHref: "tel:+541153393386",
  whatsapp: "5491153393386",
  email: "hola@nortepropiedades.com",
  address: "El Palomar, Buenos Aires",
  hours: "Lunes a viernes de 9 a 18 h · Sábados de 9 a 13 h",
  instagram: "https://instagram.com",
  years: 12,
};

export function whatsappLink(message = "Hola, quiero hacer una consulta sobre una propiedad.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
