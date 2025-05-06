import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    brand: { type: String },
    specs: { type: [String], default: [] },
    category: { type: String },
    categoryPath: { type: [String], default: [] },
    ingredients: { type: mongoose.Schema.Types.Mixed, default: {} },
    upc: { type: String },
    ean: { type: String },
    quantity: { type: Number, default: 0 },
    purchaseDate: { type: String },
    manufactureDate: { type: Date },
    productionDate: { type: String },
    boxCount: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    retailPrice: { type: Number, default: 0 },
    location: { type: String }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);

export default Inventory;
