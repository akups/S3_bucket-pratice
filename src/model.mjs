import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  name: "string",
  id: "string",
  iban: "string",
  vatNumber: "string",
});
const Invoice = mongoose.model("Invoice", invoiceSchema);

export { Invoice };
