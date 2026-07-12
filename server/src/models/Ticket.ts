import { Schema, model, models } from 'mongoose';

const TicketSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fromStation: {
      type: String,
      required: true,
    },
    toStation: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'used', 'expired'],
      default: 'active',
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    verificationCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Ticket = models.Ticket || model('Ticket', TicketSchema);
export type ITicket = InstanceType<typeof Ticket>;
export default Ticket;
