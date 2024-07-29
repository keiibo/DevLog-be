import mongoose from "mongoose";

export const getNextSequence = async (projectId: string) => {
  const result = await Counter.findOneAndUpdate(
    { projectId: projectId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
};

const counterSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter = mongoose.model("Counter", counterSchema);

export const CounterType = {
  TICKET: "ticketId",
};
