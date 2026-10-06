import type { Product, Service, Testimonial, Vet } from "./types";

export const services: Service[] = [
  {
    slug: "general-consultation",
    name: "General Consultation",
    short: "Full nose-to-tail check-up with diagnosis and a clear treatment plan.",
    description:
      "Our core clinical service. A veterinarian takes a full history, performs a complete physical examination — heart, lungs, eyes, ears, skin, teeth, abdomen and joints — and walks you through findings in plain language (English or Kiswahili). You leave with a written plan, any prescriptions, and honest guidance on what can wait and what cannot.",
    whatToExpect: [
      "30-minute unhurried consultation with a registered veterinarian",
      "Full physical examination and body-condition scoring",
      "Diagnostic recommendations (bloods, imaging) only when they add value",
      "Written treatment plan and transparent itemised estimate",
    ],
    preparation: [
      "Bring any previous vaccination cards or vet records",
      "Withhold food for 4 hours if blood tests are likely (water is fine)",
      "Write down the symptoms you have noticed and when they started",
    ],
    priceFrom: 1500,
    priceTo: 3500,
    image: "/images/svc-consult.jpg",
    category: "Clinic",
  },
  {
    slug: "vaccination-programme",
    name: "Vaccination Programme",
    short: "Core and Kenya-specific vaccines for pets and livestock, with reminders.",
    description:
      "Rabies is a legal requirement in Kenya — and parvovirus, distemper, feline panleukopenia and lumpy skin disease are seasonal realities. We run structured vaccination programmes for dogs, cats, rabbits, poultry, cattle, goats and sheep, then log every dose in your pet portal so the next due date never sneaks up on you.",
    whatToExpect: [
      "Species-appropriate vaccine schedule per Kenyan and WOAH guidance",
      "Official vaccination card and digital record in your portal",
      "WhatsApp reminder before every next due date",
      "Herd and flock programmes with on-farm administration",
    ],
    preparation: [
      "Puppies and kittens start at 6–8 weeks — bring their birth date",
      "Do not vaccinate a sick animal; book a consult first if unwell",
      "For herds, have a rough count of animals ready when you call",
    ],
    priceFrom: 800,
    priceTo: 4500,
    image: "/images/svc-vaccination.jpg",
    category: "Clinic & Farm",
  },
  {
    slug: "dental-care",
    name: "Dental Care",
    short: "Scaling, polishing, extractions and home-care coaching for pets.",
    description:
      "By age three, most dogs and cats have some degree of dental disease — it is the most common finding in our clinic. We offer ultrasonic scaling and polishing under safe sedation, extractions where needed, and practical coaching on chews, brushes and diets that actually work in Kenyan homes.",
    whatToExpect: [
      "Graded dental examination and honest staging (1–4)",
      "Ultrasonic scaling and polishing under monitored sedation",
      "Extractions and pain management when teeth are beyond saving",
      "A home-care plan: chews, brushes and diet tweaks",
    ],
    preparation: [
      "No food from 10 PM the night before a sedation procedure",
      "Tell us about any heart conditions or previous anaesthetic reactions",
      "Bring the chews or paste you currently use for tailored advice",
    ],
    priceFrom: 2500,
    priceTo: 12000,
    image: "/images/svc-dental.jpg",
    category: "Clinic",
  },
  {
    slug: "surgery",
    name: "Surgery",
    short: "Spay/neuter, soft-tissue surgery and fracture stabilisation.",
    description:
      "From routine spays and castrations to lump removals, wound repair, caesareans and fracture stabilisation, our theatre runs on modern anaesthetic monitoring and strict sterile protocol. Every surgical case gets pre-anaesthetic screening, dedicated recovery nursing and a follow-up call.",
    whatToExpect: [
      "Pre-anaesthetic health screen and blood work for higher-risk patients",
      "Modern gas anaesthesia with continuous monitoring",
      "Same-day discharge for routine cases with written aftercare",
      "Suture check and review included in the surgical fee",
    ],
    preparation: [
      "Fast the patient from 10 PM the night before surgery",
      "Arrive by 8:30 AM on the booked day",
      "Prepare a quiet, clean recovery space at home",
    ],
    priceFrom: 5000,
    priceTo: 45000,
    image: "/images/svc-surgery.jpg",
    category: "Clinic",
  },
  {
    slug: "grooming",
    name: "Grooming",
    short: "Baths, medicated dips, nail trims and coat care by gentle handlers.",
    description:
      "More than a bath: our groomers check skin, ears, nails and anal glands at every session. We offer routine wash-and-dry, medicated dips for mites and fungal conditions, tick removal, de-matting and breed-appropriate trims — always with patience for anxious animals.",
    whatToExpect: [
      "Skin, coat and ear check included in every groom",
      "Medicated dips formulated for the condition being treated",
      "Nail trim, ear cleaning and anal gland expression on request",
      "Fear-free handling — no force, ever",
    ],
    preparation: [
      "Tell us about any skin allergies or shampoos that have reacted before",
      "Do not feed a heavy meal right before the visit",
      "Matted coats may need clipping — we will confirm before we cut",
    ],
    priceFrom: 1200,
    priceTo: 5000,
    image: "/images/svc-grooming.jpg",
    category: "Clinic",
  },
  {
    slug: "livestock-health",
    name: "Livestock Health",
    short: "Herd health, vaccination, dipping and production advice for farmers.",
    description:
      "We work with smallholder and commercial farmers across Nairobi's peri-urban belt and beyond: dairy cows, beef herds, goats, sheep, pigs and poultry. Services include herd vaccination, East Coast Fever and foot-and-mouth control planning, pregnancy diagnosis, mastitis work-ups, deworming strategy and feed counselling.",
    whatToExpect: [
      "Scheduled herd-health visits with written herd records",
      "Vaccination and parasite-control calendars for your county's disease risks",
      "Pregnancy scanning and calving support planning",
      "Feed and mineral-supplement review for better yields",
    ],
    preparation: [
      "Have animals gathered in a crush or boma before the vet arrives",
      "Keep previous treatment and vaccination records at hand",
      "For sick animals, isolate them from the herd before our visit",
    ],
    priceFrom: 3000,
    priceTo: 25000,
    image: "/images/svc-livestock.jpg",
    category: "Farm",
  },
  {
    slug: "mobile-vet-home-visits",
    name: "Mobile Vet Home Visits",
    short: "Our fully-equipped mobile unit treats pets at your home, 7 days a week.",
    description:
      "Some animals are too old, too anxious or too big to travel. Our mobile clinic carries examination kit, vaccines, wound-care supplies, a field pharmacy and humane euthanasia supplies — bringing calm, unhurried veterinary care to your doorstep across Nairobi and surrounding counties.",
    whatToExpect: [
      "Same clinical standards as the practice, at your home or farm",
      "Vaccinations, microchipping, wound care and chronic-disease reviews",
      "Dignified home euthanasia when the time comes",
      "Coverage: Nairobi, Kiambu, Kajiado and Machakos on scheduled routes",
    ],
    preparation: [
      "Share an accurate pin or landmark directions when booking",
      "Secure other pets so the patient is easy to reach",
      "Have previous records and current medication available",
    ],
    priceFrom: 3000,
    priceTo: 8000,
    image: "/images/svc-mobile.jpg",
    category: "Mobile",
  },
  {
    slug: "wildlife-and-exotic-animals",
    name: "Wildlife & Exotic Animals",
    short: "Parrots, reptiles, rabbits — and field support for conservancies.",
    description:
      "Exotics are not small dogs. We provide species-specific care for parrots and other birds, tortoises, terrapins, bearded dragons, rabbits, guinea pigs and primates in licensed care. We also support wildlife conservancies with field immobilisation assistance, health surveillance and post-mortem services under KWS regulation.",
    whatToExpect: [
      "Husbandry-first approach: enclosure, heat, UVB and diet reviewed",
      "Wing, beak and nail care for birds",
      "Faecal screening and parasite protocols for reptiles",
      "Conservancy support: immobilisation assistance, sampling, reporting",
    ],
    preparation: [
      "Bring photos of the animal's enclosure and a list of what it eats",
      "Transport birds covered, reptiles warm (not hot)",
      "Conservancies: have KWS permits and movement documents ready",
    ],
    priceFrom: 2000,
    priceTo: 15000,
    image: "/images/svc-wildlife.jpg",
    category: "Specialist",
  },
];

export const vets: Vet[] = [
  {
    slug: "dr-caleb-mwangi",
    name: "Dr. Caleb Mwangi",
    qualification: "BVM, MSc (Veterinary Medicine), UoN",
    specialisation: "Founder — Small Animals & Soft-Tissue Surgery",
    years: 15,
    languages: ["English", "Kiswahili", "Kikuyu"],
    image: "/images/vet-caleb.jpg",
  },
  {
    slug: "dr-amina-odhiambo",
    name: "Dr. Amina Odhiambo",
    qualification: "BVM, Dip. Companion Animal Practice",
    specialisation: "Internal Medicine & Feline Practice",
    years: 11,
    languages: ["English", "Kiswahili", "Luo"],
    image: "/images/vet-amina.jpg",
  },
  {
    slug: "dr-brian-kiprop",
    name: "Dr. Brian Kiprop",
    qualification: "BVM, MVSc (Epidemiology)",
    specialisation: "Livestock, Herd Health & Mobile Unit Lead",
    years: 9,
    languages: ["English", "Kiswahili", "Kalenjin"],
    image: "/images/vet-brian.webp",
  },
  {
    slug: "dr-wanjiru-njoroge",
    name: "Dr. Wanjiru Njoroge",
    qualification: "BVM, Cert. Avian & Exotic Medicine",
    specialisation: "Wildlife, Birds & Exotic Species",
    years: 7,
    languages: ["English", "Kiswahili", "Kikuyu"],
    image: "/images/vet-wanjiru.jpg",
  },
];

export const testimonials: Testimonial[] = [
  {
    owner: "Wambui Kamau",
    pet: "Simba (Akita)",
    service: "Vaccination Programme",
    review:
      "Dr. Mwangi's team keeps Simba's shots on schedule and the WhatsApp reminders mean I never miss a due date. Best vet decision we made.",
    rating: 5,
    image: "/images/testi-1.jpg",
  },
  {
    owner: "Ochieng Onyango",
    pet: "Baraka (Mixed breed)",
    service: "Mobile Vet Home Visit",
    review:
      "Baraka hates car rides. The mobile unit came to our home in Karen, treated him calmly on our veranda, and he wagged the whole time.",
    rating: 5,
    image: "/images/testi-2.jpg",
  },
  {
    owner: "Nyambura Githinji",
    pet: "Chai (Corgi)",
    service: "Dental Care",
    review:
      "Chai's breath was unbearable. After scaling and the home-care plan Dr. Odhiambo wrote for us, her teeth look brand new.",
    rating: 5,
    image: "/images/testi-3.jpg",
  },
  {
    owner: "Kipchoge Bett",
    pet: "Zawadi (Rescue)",
    service: "Surgery",
    review:
      "Zawadi needed a lump removed. Clear costs up front, gentle recovery, and a vet who called the next morning to check on her.",
    rating: 5,
    image: "/images/testi-4.jpg",
  },
];

export const products: Product[] = [
  {
    id: "adult-dog-food-10",
    name: "Savanna Prime Adult Dog Food",
    description: "Complete beef-and-sorghum kibble formulated for active Kenyan dogs.",
    image: "/images/prod-food-dog.jpg",
    sizes: ["2 kg", "5 kg", "10 kg"],
    price: 3400,
    category: "food",
    stock: 42,
  },
  {
    id: "puppy-food-3",
    name: "Savanna Prime Puppy Starter",
    description: "DHA-enriched small-kibble starter for pups from 4 weeks.",
    image: "/images/prod-food-puppy.jpg",
    sizes: ["1.5 kg", "3 kg"],
    price: 2100,
    category: "food",
    stock: 35,
  },
  {
    id: "small-breed-food-2",
    name: "Little Paws Small-Breed Recipe",
    description: "Tiny kibble, big nutrition — for toy and small breeds.",
    image: "/images/prod-food-small.jpg",
    sizes: ["1 kg", "2 kg"],
    price: 1800,
    category: "food",
    stock: 28,
  },
  {
    id: "flea-shampoo-500",
    name: "TickOff Medicated Flea & Tick Shampoo",
    description: "Vet-strength neem-and-permethrin wash, gentle on skin.",
    image: "/images/prod-flea.jpg",
    sizes: ["250 ml", "500 ml"],
    price: 950,
    category: "flea",
    stock: 60,
  },
  {
    id: "joint-supplement-60",
    name: "FlexiJoint Hip & Joint Supplement",
    description: "Glucosamine, chondroitin and MSM chews for senior dogs.",
    image: "/images/prod-supplements.jpg",
    sizes: ["60 chews", "120 chews"],
    price: 2400,
    category: "supplement",
    stock: 21,
  },
  {
    id: "dewormer-dog-4",
    name: "WormClear Broad-Spectrum Dewormer",
    description: "Quarterly deworming tablets for dogs up to 35 kg.",
    image: "/images/prod-dewormer.jpg",
    sizes: ["2 tablets", "4 tablets"],
    price: 650,
    category: "dewormer",
    stock: 80,
  },
  {
    id: "leash-collar-set",
    name: "Nairobi Leather Leash & Collar Set",
    description: "Hand-stitched Kenyan leather, brass fittings, built to last.",
    image: "/images/prod-leash.jpg",
    sizes: ["S", "M", "L"],
    price: 2800,
    category: "accessory",
    stock: 15,
  },
  {
    id: "walk-harness",
    name: "Uhuru Padded Walking Harness",
    description: "No-pull padded harness for city walks and trail days.",
    image: "/images/prod-harness.jpg",
    sizes: ["S", "M", "L", "XL"],
    price: 1900,
    category: "accessory",
    stock: 24,
  },
];

export const articleCategories = [
  "Dogs",
  "Cats",
  "Birds",
  "Livestock",
  "Reptiles",
  "Nutrition",
  "Vaccines",
  "First Aid",
] as const;

export type ArticleCategory = (typeof articleCategories)[number];
