import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  contact: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  email:{
    type: String,
    require: true,
  },
  password:{
    type: String,
    require: true,
  },
  address:{
    type: String,
    require: false,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      require: false,
    },]
});

export default mongoose.models.customers || mongoose.model("customers", userSchema);