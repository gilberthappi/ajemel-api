import mongoose from "mongoose";
const CommiteSchema = mongoose.Schema({


    name: String,
    position: String,
    photo: [String],
    documents:[String],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      description: {
        type: String,
        maxlength: 2000,
      },
      duration: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
});
export const Commite =mongoose.model("Commite", CommiteSchema);


