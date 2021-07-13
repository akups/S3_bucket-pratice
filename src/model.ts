import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  name: "string",
  id: "string",
  iban: "string",
  vatNumber: "string",
  vatRate:"number",
  createdAt: { type: Date, default: Date.now },
});
const Invoice = mongoose.model("Invoice", invoiceSchema);

export { Invoice };
