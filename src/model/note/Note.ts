import mongoose, { Schema } from 'mongoose';

// Noteスキーマの定義
const NoteSchema: Schema = new Schema({
  projectId: {
    type: String,
    required: true
  },
  uuid: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  body: {
    type: String
  }
});

const Note = mongoose.model('Note', NoteSchema);

export default Note;
