const fs = require('fs');
const path = require('path');

// Simple Stop Words list to filter out noisy terms
const STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could',
    'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
    'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
    'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt',
    'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
    'ourselves', 'out', 'over', 'own', 'same', 'shant', 'she', 'should', 'shouldnt', 'so', 'some', 'such', 'than',
    'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those',
    'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'were', 'werent', 'what', 'when',
    'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'wont', 'would', 'wouldnt', 'you', 'your', 'yours',
    'yourself', 'yourselves'
]);

class ComplaintClassifier {
    constructor() {
        this.dataset = [];
        this.categories = ['Technical', 'Billing', 'Service', 'Security', 'Other'];
        
        // Model parameters
        this.vocabulary = new Set();
        this.wordCounts = {}; // { category: { word: count } }
        this.totalWords = {}; // { category: count }
        this.docCounts = {};  // { category: count }
        this.totalDocs = 0;

        this.categories.forEach(cat => {
            this.wordCounts[cat] = {};
            this.totalWords[cat] = 0;
            this.docCounts[cat] = 0;
        });

        this.loadDatasetAndTrain();
    }

    // Helper to tokenize and clean text
    tokenize(text) {
        if (!text) return [];
        return text
            .toLowerCase()
            .replace(/[^a-zA-Z\s]/g, '') // Keep letters and spaces
            .split(/\s+/)
            .filter(word => word.length >= 3 && !STOP_WORDS.has(word));
    }

    // Load dataset and train model
    loadDatasetAndTrain() {
        try {
            const datasetPath = path.join(__dirname, '../data/classifierDataset.json');
            if (fs.existsSync(datasetPath)) {
                const rawData = fs.readFileSync(datasetPath, 'utf8');
                this.dataset = JSON.parse(rawData);
                this.train();
                console.log(`[AI CLASSIFIER] Successfully trained on ${this.totalDocs} dataset samples!`);
            } else {
                console.warn('[AI CLASSIFIER WARNING] Dataset file not found. Classifier will use default empty states.');
            }
        } catch (error) {
            console.error('[AI CLASSIFIER ERROR] Training failed:', error);
        }
    }

    // Train the Naive Bayes model
    train() {
        this.dataset.forEach(sample => {
            const tokens = this.tokenize(sample.text);
            const cat = sample.category;

            if (this.categories.includes(cat)) {
                this.docCounts[cat]++;
                this.totalDocs++;

                tokens.forEach(token => {
                    this.vocabulary.add(token);
                    this.wordCounts[cat][token] = (this.wordCounts[cat][token] || 0) + 1;
                    this.totalWords[cat]++;
                });
            }
        });
    }

    // Classify text and return predicted category
    classify(title, description) {
        const text = `${title} ${description}`;
        const tokens = this.tokenize(text);
        
        if (tokens.length === 0) {
            return 'Other'; // Fallback for empty/short inputs
        }

        let bestCategory = 'Other';
        let maxScore = -Infinity;

        const vocabSize = this.vocabulary.size;

        this.categories.forEach(cat => {
            // Prior probability: Log(Docs in Cat / Total Docs)
            const catPrior = this.docCounts[cat] > 0 
                ? Math.log(this.docCounts[cat] / this.totalDocs) 
                : Math.log(1 / (this.totalDocs + this.categories.length));

            let catScore = catPrior;

            // Conditional word probabilities with Laplace smoothing
            tokens.forEach(token => {
                const wordOccurrence = this.wordCounts[cat][token] || 0;
                // P(word | category) = (count(word, cat) + 1) / (totalWords(cat) + uniqueVocabSize)
                const condProb = (wordOccurrence + 1) / (this.totalWords[cat] + vocabSize + 1);
                catScore += Math.log(condProb);
            });

            if (catScore > maxScore) {
                maxScore = catScore;
                bestCategory = cat;
            }
        });

        console.log(`[AI CLASSIFIER DETECT] Text: "${title.substring(0, 40)}..." -> Predicted Category: ${bestCategory} (Score: ${maxScore.toFixed(2)})`);
        return bestCategory;
    }
}

// Instantiate and export singleton service
const classifierService = new ComplaintClassifier();
module.exports = classifierService;
