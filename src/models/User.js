const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// PostSchema.pre("remove", function () {
//   if (process.env.STORAGE_TYPE === "s3") {
//     return s3
//       .deleteObject({
//         Bucket: process.env.BUCKET_NAME || "databasefilesnextrocket",
//         Key: this.key,
//       })
//       .promise()
//       .then((response) => {
//         console.log(response.status);
//       })
//       .catch((response) => {
//         console.log(response.status);
//       });
//   } else {
//     return promisify(fs.unlink)(
//       path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
//     );
//   }
// });

module.exports = mongoose.model("User", PostSchema);
