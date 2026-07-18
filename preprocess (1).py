import pandas as pd
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
import os

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

# Initialize tools
stop_words = set(stopwords.words('english'))
porter_stemmer = PorterStemmer()


def load_data(fake_csv='fake.csv', true_csv='true.csv'):
    """Load fake and true news datasets"""
    print("Loading datasets...")
    fake_df = pd.read_csv(fake_csv)
    true_df = pd.read_csv(true_csv)
    
    # Add label: 1 for fake, 0 for true
    fake_df['label'] = 1
    true_df['label'] = 0
    
    # Combine datasets
    df = pd.concat([fake_df, true_df], axis=0, ignore_index=True)
    
    print(f"Loaded {len(fake_df)} fake news articles")
    print(f"Loaded {len(true_df)} true news articles")
    print(f"Total articles: {len(df)}")
    
    return df


def clean_text(text):
    """Clean and preprocess text"""
    if not isinstance(text, str):
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove special characters and digits
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text


def preprocess_text(text):
    """Tokenize, remove stopwords, and stem text"""
    text = clean_text(text)
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords and stem
    tokens = [porter_stemmer.stem(word) for word in tokens 
              if word not in stop_words and len(word) > 2]
    
    return ' '.join(tokens)


def prepare_data(df):
    """Prepare data for model training"""
    print("\nPreprocessing text...")
    
    # Combine title and text
    df['content'] = df['title'].fillna('') + ' ' + df['text'].fillna('')
    
    # Clean and preprocess
    df['processed_content'] = df['content'].apply(preprocess_text)
    
    # Remove empty rows
    df = df[df['processed_content'].str.len() > 0]
    
    print(f"Processed {len(df)} articles")
    
    return df


def create_features(X_train, X_test, max_features=3000):
    """Create TF-IDF features"""
    print("\nCreating TF-IDF features...")
    
    vectorizer = TfidfVectorizer(max_features=max_features, 
                                 ngram_range=(1, 2),
                                 min_df=5,  # Increased to reduce noise
                                 max_df=0.7)  # Reduced to remove very common words
    
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    print(f"Feature matrix shape - Train: {X_train_tfidf.shape}, Test: {X_test_tfidf.shape}")
    
    return X_train_tfidf, X_test_tfidf, vectorizer


def preprocess_pipeline():
    """Complete preprocessing pipeline"""
    # Load data
    df = load_data()
    
    # Prepare data
    df = prepare_data(df)
    
    # Split data
    print("\nSplitting data (80% train, 20% test)...")
    X = df['processed_content']
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Train set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")
    
    # Create features
    X_train_tfidf, X_test_tfidf, vectorizer = create_features(X_train, X_test)
    
    # Save vectorizer for later use
    os.makedirs('models', exist_ok=True)
    with open('models/vectorizer.pkl', 'wb') as f:
        pickle.dump(vectorizer, f)
    
    print("\nPreprocessing complete!")
    
    return X_train_tfidf, X_test_tfidf, y_train, y_test, vectorizer


if __name__ == '__main__':
    preprocess_pipeline()
