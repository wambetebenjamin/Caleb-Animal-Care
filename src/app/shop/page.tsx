import type { Metadata } from "next";
import { Truck, Store, SmartphoneNfc } from "lucide-react";
import { getProducts } from "@/lib/shop";
import { ShopClient } from "@/components/ShopClient";
import { SectionHeading } from "@/components/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { productsJsonLd } from "@/lib/schema";

export const revalidate = 300; // Shop: ISR 300

export const metadata: Metadata = {
  title: "Shop Pet Supplies",
  description: "Vet-approved pet food, flea treatments, supplements, dewormers and accessories — M-Pesa checkout, delivery or clinic pickup in Nairobi.",
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <div className="bg-mist py-14">
      <JsonLd data={productsJsonLd(products)} />
      <div className="mx-auto max-w-shell px-5">
        <SectionHeading
          subheading="The clinic shop"
          title="Food, treatments & gear we trust"
          intro="Curated by our vets from brands that survive Nairobi's climate and Kenyan shelves. Pay by M-Pesa; collect at the clinic or get delivery."
        />
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {[
            { Icon: SmartphoneNfc, title: "M-Pesa checkout", text: "STK push to your phone — no cards needed." },
            { Icon: Truck, title: "Nairobi delivery", text: "Same-week delivery for KES 200." },
            { Icon: Store, title: "Free clinic pickup", text: "Collect with your next appointment." },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3 rounded-brand bg-white p-4 shadow-card">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-fog text-pine"><Icon size={18} aria-hidden /></span>
              <div>
                <h2 className="text-[14px] font-bold">{title}</h2>
                <p className="text-[12px] text-body">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <ShopClient products={products} />
      </div>
    </div>
  );
}
