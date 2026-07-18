import os
import pickle
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from preprocess import preprocess_pipeline


def train_models(X_train, y_train):
    models = {
        'Logistic Regression': LogisticRegression(
            C=0.1,
            penalty='l2',
            max_iter=1000,
            random_state=42,
            class_weight='balanced'
        ),
        'Random Forest': RandomForestClassifier(
            n_estimators=50,
            max_depth=10,
            min_samples_split=10,
            min_samples_leaf=5,
            max_features='sqrt',
            random_state=42,
            n_jobs=-1,
            class_weight='balanced'
        ),
        'Naive Bayes': MultinomialNB(alpha=1.0)
    }

    print("Training models...\n")
    trained_models = {}

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    for name, model in models.items():
        print(f"Training {name}...")

        cv_scores = cross_val_score(model, X_train, y_train, cv=cv, scoring='f1_weighted')
        print(f"  CV F1: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")

        model.fit(X_train, y_train)
        trained_models[name] = model

        print(f"[OK] {name} trained\n")

    return trained_models


def save_random_forest_model(trained_models):
    """Save model safely and verify"""
    
    os.makedirs('models', exist_ok=True)

    if 'Random Forest' not in trained_models:
        print("❌ Random Forest model not found!")
        return

    model_path = 'models/random_forest_model.pkl'

    try:
        with open(model_path, 'wb') as f:
            pickle.dump(trained_models['Random Forest'], f)

        # ✅ Verify file
        if os.path.exists(model_path) and os.path.getsize(model_path) > 0:
            print("[OK] Model saved successfully!")
            print(f"Path: {model_path}")
            print(f"Size: {os.path.getsize(model_path)} bytes")
        else:
            print("[ERROR] Model file is empty after saving!")

    except Exception as e:
        print(f"❌ Error saving model: {e}")


def train_pipeline():
    print("Starting training pipeline...\n")

    X_train, X_test, y_train, y_test, vectorizer = preprocess_pipeline()

    trained_models = train_models(X_train, y_train)

    save_random_forest_model(trained_models)

    print("\nTraining complete!")


if __name__ == '__main__':
    train_pipeline()