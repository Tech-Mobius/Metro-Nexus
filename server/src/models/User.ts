import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    walletBalance: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete (ret as any).password;
        return ret;
      },
    },
  }
);


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});


UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = models.User || model('User', UserSchema);
export type IUser = InstanceType<typeof User>;
export default User;
