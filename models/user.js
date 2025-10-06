module.exports = (mongoose) => {
  const UserSchema = new mongoose.Schema(
    {
      provider: { type: String, required: true },
      providerId: { type: String, required: true, index: true, unique: true },
      email: { type: String, required: true, lowercase: true, index: true },
      displayName: { type: String },
      photo: { type: String },
      role: { type: String, enum: ['user', 'admin'], default: 'user' }
    },
    { timestamps: true }
  );

  return mongoose.model('user', UserSchema);
};

