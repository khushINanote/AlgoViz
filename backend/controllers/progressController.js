import Progress from '../models/Progress.js';
import Quiz from '../models/Quiz.js';

export const getDashboardData = async (req, res) => {
    try {
        let progress = await Progress.findOne({ user: req.user._id });

        if (!progress) {
            progress = await Progress.create({ user: req.user._id });
        }

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const { algorithm, timeSpent } = req.body;

        let progress = await Progress.findOne({ user: req.user._id });
        if (!progress) {
            progress = new Progress({ user: req.user._id, completedAlgorithms: [] });
        }

        if (!progress.completedAlgorithms.includes(algorithm)) {
            progress.completedAlgorithms.push(algorithm);
        }

        progress.totalTimeSpent += parseInt(timeSpent) || 0;

        // Log this completion activity
        progress.activityLog.push({
            algorithm,
            type: 'completion',
            date: new Date()
        });

        await progress.save();

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const saveQuizScore = async (req, res) => {
    try {
        const { algorithm, score, totalQuestions } = req.body;

        const quiz = await Quiz.create({
            user: req.user._id,
            algorithm,
            score,
            totalQuestions
        });

        let progress = await Progress.findOne({ user: req.user._id });
        if (progress) {
            progress.quizScore += score;

            // Log quiz activity
            progress.activityLog.push({
                algorithm,
                type: 'quiz',
                date: new Date()
            });

            await progress.save();
        }

        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
