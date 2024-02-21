import mongoose from "mongoose";
const sermonSchema = mongoose.Schema({


    sermonTitle: String,
    typeOfSermon: String,
    dateOfSermon: String,
    mainGuest: String,
    location: String,
    photo: [String],
    videoLink:[String],
    documents:[String],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    hostedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
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
export const Sermon =mongoose.model("Sermon", sermonSchema);

