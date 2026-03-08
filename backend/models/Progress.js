import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    completedAlgorithms: [{ type: String }],
    totalTimeSpent: { type: Number, default: 0 }, // in seconds
    quizScore: { type: Number, default: 0 },
    activityLog: [{
        date: { type: Date, default: Date.now },
        algorithm: String,
        type: { type: String, enum: ['completion', 'quiz'], default: 'completion' }
    }]
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
