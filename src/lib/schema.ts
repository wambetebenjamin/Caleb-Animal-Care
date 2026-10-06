import { site } from "./site";

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["VeterinaryCare", "LocalBusiness", "MedicalOrganization"],
        "@id": `${site.baseUrl}/#clinic`,
        name: site.name,
        description: site.description,
        url: site.baseUrl,
        telephone: "+254112272061",
        email: site.email,
        priceRange: "KES 800 – KES 45,000",
        image: `${site.baseUrl}/images/hero-vet.jpg`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Kabarnet Gardens, off Ngong Road, Kilimani",
          addressLocality: "Nairobi",
          addressCountry: "KE",
        },
        geo: { "@type": "GeoCoordinates", latitude: -1.2921, longitude: 36.7819 },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "08:00",
            closes: "18:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "09:00",
            closes: "16:00",
          },
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+254112272061",
          contactType: "emergency",
          hoursAvailable: "Mo,Tu,We,Th,Fr,Sa,Su 00:00-23:59",
          availableLanguage: ["en", "sw"],
        },
        areaServed: ["Nairobi", "Kiambu", "Kajiado", "Machakos"],
        sameAs: site.socials.map((s) => s.href),
      },
    ],
  };
}

export function medicalClinicJsonLd(service: {
  name: string;
  description: string;
  slug: string;
  priceFrom: number;
  priceTo: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: `${site.name} — ${service.name}`,
    url: `${site.baseUrl}/services/${service.slug}`,
    medicalSpecialty: "Veterinary",
    availableService: {
      "@type": "MedicalProcedure",
      name: service.name,
      description: service.description,
    },
    priceRange: `KES ${service.priceFrom.toLocaleString("en-KE")} – KES ${service.priceTo.toLocaleString("en-KE")}`,
    telephone: "+254112272061",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
  };
}

export function productsJsonLd(
  items: { id: string; name: string; description: string; image: string; price: number; stock: number }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        "@id": `${site.baseUrl}/shop#${p.id}`,
        name: p.name,
        description: p.description,
        image: `${site.baseUrl}${p.image}`,
        offers: {
          "@type": "Offer",
          priceCurrency: "KES",
          price: p.price,
          availability:
            p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
      },
    })),
  };
}

export function articleJsonLd(a: {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  authorVet: string;
  publishedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    image: `${site.baseUrl}${a.image}`,
    datePublished: a.publishedAt,
    author: { "@type": "Person", name: a.authorVet },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.baseUrl}/library/${a.slug}`,
  };
}
