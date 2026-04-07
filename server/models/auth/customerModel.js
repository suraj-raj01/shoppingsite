import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  contact: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    // require: true,
  },
  googleId: {
    type: String,
  },
  profile: {
    type: String,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    require: false,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      require: false,
    },],
  notification:{
    type:Boolean,
    default: true
  },
  theme:{
    type:Boolean,
    default: false
  }
});

export default mongoose.models.customers || mongoose.model("customers", userSchema);