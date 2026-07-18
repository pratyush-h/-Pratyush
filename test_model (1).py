import pickle
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt_tab')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

stop_words = set(stopwords.words('english'))
porter_stemmer = PorterStemmer()


def load_model_and_vectorizer():
    """Load saved model and vectorizer"""
    with open('models/random_forest_model.pkl', 'rb') as f:
        model = pickle.load(f)
    
    with open('models/vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)
    
    return model, vectorizer


def clean_text(text):
    """Clean and preprocess text"""
    if not isinstance(text, str):
        return ""
    
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text


def preprocess_text(text):
    """Tokenize, remove stopwords, and stem text"""
    text = clean_text(text)
    tokens = word_tokenize(text)
    tokens = [porter_stemmer.stem(word) for word in tokens 
              if word not in stop_words and len(word) > 2]
    return ' '.join(tokens)


def predict_news(title, content):
    """Predict if news article is fake or true"""
    # Load model and vectorizer
    model, vectorizer = load_model_and_vectorizer()
    
    # Combine title and content
    text = title + ' ' + content
    
    # Preprocess
    processed_text = preprocess_text(text)
    
    # Vectorize
    text_tfidf = vectorizer.transform([processed_text])
    
    # Predict
    prediction = model.predict(text_tfidf)[0]
    confidence = model.predict_proba(text_tfidf)[0]
    
    return prediction, confidence


def get_prediction_text(prediction, confidence):
    """Format prediction output"""
    if prediction == 0:
        news_type = "TRUE NEWS ✓"
    else:
        news_type = "FAKE NEWS ✗"
    
    fake_confidence = confidence[1] * 100
    true_confidence = confidence[0] * 100
    
    return news_type, fake_confidence, true_confidence


def test_single_article(title, content):
    """Test a single article"""
    print("\n" + "="*60)
    print("FAKE NEWS DETECTOR - PREDICTION")
    print("="*60)
    
    print(f"\nTitle: {title[:100]}...")
    print(f"Content: {content[:150]}...\n")
    
    try:
        prediction, confidence = predict_news(title, content)
        news_type, fake_conf, true_conf = get_prediction_text(prediction, confidence)
        
        print(f"Prediction: {news_type}")
        print(f"  True News Confidence:  {true_conf:.2f}%")
        print(f"  Fake News Confidence:  {fake_conf:.2f}%")
        print("\n" + "="*60)
        
        return prediction, confidence
    
    except Exception as e:
        print(f"Error during prediction: {e}")
        return None, None


def test_multiple_articles(test_articles):
    """Test multiple articles"""
    print("\n" + "="*60)
    print("TESTING MULTIPLE ARTICLES")
    print("="*60)
    
    for i, (title, content) in enumerate(test_articles, 1):
        print(f"\n[Article {i}/{len(test_articles)}]")
        test_single_article(title, content)


if __name__ == '__main__':
    # Example test articles
    test_articles = [
        (
            "New Climate Study Released",
            "Scientists have released a comprehensive study on climate change effects. The research shows that early action can prevent catastrophic outcomes."
        ),
        (
            "SHOCKING: Celebrity Spotted at Secret Location",
            "An unverified source claims a celebrity was seen at a mysterious location. This is completely fictional and unsubstantiated."
        ),
        (
            "Government Announces New Policy",
            "The government has officially announced a new environmental policy aimed at reducing carbon emissions by 50% over the next decade."
        )
    ]
    
    # Test multiple articles
    test_multiple_articles(test_articles)
