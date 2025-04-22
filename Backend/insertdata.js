const mongoose = require("mongoose");
const medicineModel = require("./Models/Medicine");
require('dotenv').config();
const URL = process.env.URL;
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Generate unique 4-digit codes
function generateUniqueCodes(count) {
  const codes = new Set();
  while (codes.size < count) {
    const code = Math.floor(1000 + Math.random() * 9000);
    codes.add(code);
  }
  return Array.from(codes);
}

const baseMedicines = [
  { name: "Paracetamol", use: "Fever and pain relief", quantity: 30 },
  { name: "Ibuprofen", use: "Anti-inflammatory and pain relief", quantity: 25 },
  { name: "Amoxicillin", use: "Bacterial infections", quantity: 20 },
  {
    name: "Ciprofloxacin",
    use: "Urinary and respiratory infections",
    quantity: 15,
  },
  { name: "Metformin", use: "Type 2 diabetes", quantity: 40 },
  { name: "Omeprazole", use: "Acidity and ulcers", quantity: 35 },
  { name: "Cetirizine", use: "Allergy relief", quantity: 50 },
  { name: "Amlodipine", use: "High blood pressure", quantity: 28 },
  { name: "Losartan", use: "Hypertension", quantity: 18 },
  { name: "ORS Sachets", use: "Dehydration", quantity: 60 },
  { name: "Salbutamol Inhaler", use: "Asthma", quantity: 10 },
  { name: "Ranitidine", use: "Acid reflux", quantity: 32 },
  { name: "Azithromycin", use: "Respiratory infections", quantity: 22 },
  { name: "Vitamin C Tablets", use: "Immunity boost", quantity: 45 },
  { name: "Multivitamins", use: "Nutritional supplement", quantity: 38 },
  { name: "Diclofenac", use: "Muscle and joint pain", quantity: 27 },
  { name: "Hydrocortisone Cream", use: "Skin inflammation", quantity: 12 },
  { name: "Antiseptic Lotion", use: "Wound cleaning", quantity: 20 },
  { name: "Bandages", use: "Wound dressing", quantity: 100 },
  { name: "Thermometer", use: "Measure body temperature", quantity: 5 },
  { name: "Chlorpheniramine", use: "Cold and allergy symptoms", quantity: 36 },
  { name: "Pantoprazole", use: "GERD and acid reflux", quantity: 30 },
  { name: "Dolo 650", use: "Pain and fever", quantity: 55 },
  { name: "Betadine Ointment", use: "Wound antiseptic", quantity: 14 },
  { name: "Erythromycin", use: "Bacterial infections", quantity: 19 },
  { name: "Allegra", use: "Seasonal allergies", quantity: 26 },
  { name: "Loratadine", use: "Allergy symptoms", quantity: 44 },
  { name: "Domperidone", use: "Nausea and vomiting", quantity: 17 },
  { name: "Ondansetron", use: "Anti-nausea", quantity: 23 },
  { name: "Calcium Tablets", use: "Bone strength", quantity: 31 },
  { name: "Iron Tablets", use: "Treats anemia", quantity: 41 },
  { name: "ORS Liquid Bottles", use: "Rehydration", quantity: 29 },
  { name: "Clotrimazole Cream", use: "Fungal infections", quantity: 16 },
  { name: "Miconazole", use: "Yeast infections", quantity: 11 },
  { name: "Neomycin Powder", use: "Wound infection prevention", quantity: 13 },
  { name: "Antacid Tablets", use: "Stomach acidity", quantity: 47 },
  { name: "Glucon-D", use: "Instant energy", quantity: 24 },
  { name: "Zinc Tablets", use: "Boosts immunity", quantity: 33 },
  { name: "B Complex Capsules", use: "Nerve and energy health", quantity: 39 },
  { name: "Levocetirizine", use: "Allergies", quantity: 42 },
  { name: "Naproxen", use: "Pain relief", quantity: 21 },
  { name: "Phenylephrine", use: "Nasal congestion", quantity: 18 },
  { name: "Ivermectin", use: "Parasitic infections", quantity: 34 },
  { name: "Albendazole", use: "Deworming", quantity: 46 },
  { name: "Thyroxine", use: "Thyroid regulation", quantity: 20 },
  { name: "Insulin", use: "Diabetes", quantity: 9 },
  {
    name: "Sodium Chloride IV",
    use: "Hydration and electrolyte balance",
    quantity: 8,
  },
  { name: "Glucose IV", use: "Energy and fluid replenishment", quantity: 10 },
  { name: "Strepsils", use: "Sore throat relief", quantity: 50 },
];

// Assign unique 4-digit codes
const codes = generateUniqueCodes(baseMedicines.length);
const medicines = baseMedicines.map((med, index) => ({
  ...med,
  medicineCode: codes[index],
}));

async function seedMedicines() {
  try {
    await medicineModel.insertMany(medicines);
    console.log("Medicines inserted successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seedMedicines();
