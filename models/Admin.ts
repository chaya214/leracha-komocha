// מודל לאדמין
import mongoose, { Schema, model, models } from "mongoose";

const AdminSchema = new Schema({
  username: { type: String, required: true, default: 'admin' },
  password: { type: String, required: true }, // סיסמה מוצפנת (Hash)
});

export const Admin = models.Admin || model("Admin", AdminSchema);