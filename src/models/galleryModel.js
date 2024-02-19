import mongoose from "mongoose";
const gallerySchema = mongoose.Schema({
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
export const Gallery =mongoose.model("Gallery", gallerySchema);


