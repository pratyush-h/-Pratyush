import pickle
import os
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, classification_report,
    roc_auc_score, roc_curve
)
import matplotlib.pyplot as plt
from preprocess import preprocess_pipeline

try:
    import seaborn as sns
except ImportError:
    sns = None


def load_model(model_path='models/random_forest_model.pkl'):
    """Load saved model with safety checks"""
    
    print(f"Loading model from: {model_path}")
    
    # Check if file exists
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"❌ Model file not found at: {model_path}\n➡️ Train and save the model first.")
    
    # Check if file is empty
    if os.path.getsize(model_path) == 0:
        raise ValueError(f"❌ Model file is empty!\n➡️ Your model was not saved correctly.")
    
    # Try loading
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
    except Exception as e:
        raise ValueError(f"❌ Failed to load model: {e}\n➡️ File may be corrupted. Retrain the model.")
    
    print("✅ Model loaded successfully!")
    return model


def detailed_evaluation(model, X_test, y_test):
    """Perform detailed evaluation"""
    print("\n" + "="*60)
    print("DETAILED MODEL EVALUATION")
    print("="*60 + "\n")
    
    y_pred = model.predict(X_test)
    
    # Probability scores
    if hasattr(model, 'predict_proba'):
        y_pred_proba = model.predict_proba(X_test)[:, 1]
    else:
        y_pred_proba = model.decision_function(X_test)
        y_pred_proba = (y_pred_proba - y_pred_proba.min()) / (y_pred_proba.max() - y_pred_proba.min())
    
    print("Basic Metrics:")
    print(f"  Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
    print(f"  Precision: {precision_score(y_test, y_pred, average='weighted'):.4f}")
    print(f"  Recall:    {recall_score(y_test, y_pred, average='weighted'):.4f}")
    print(f"  F1-Score:  {f1_score(y_test, y_pred, average='weighted'):.4f}")
    
    try:
        roc_auc = roc_auc_score(y_test, y_pred_proba)
        print(f"  ROC-AUC:   {roc_auc:.4f}")
    except:
        print("  ROC-AUC:   N/A")
    
    cm = confusion_matrix(y_test, y_pred)
    
    print("\nConfusion Matrix:")
    print(f"  True Negatives:  {cm[0, 0]}")
    print(f"  False Positives: {cm[0, 1]}")
    print(f"  False Negatives: {cm[1, 0]}")
    print(f"  True Positives:  {cm[1, 1]}")
    
    print("\nClassification Report:")
    print(classification_report(
        y_test, y_pred,
        target_names=['True News (0)', 'Fake News (1)']
    ))
    
    return y_pred, cm


def plot_confusion_matrix(cm, save_path='models/confusion_matrix.png'):
    """Plot confusion matrix"""
    
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    plt.figure(figsize=(8, 6))
    if sns is not None:
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                    xticklabels=['True News', 'Fake News'],
                    yticklabels=['True News', 'Fake News'])
    else:
        plt.imshow(cm, cmap='Blues')
        plt.xticks([0, 1], ['True News', 'Fake News'])
        plt.yticks([0, 1], ['True News', 'Fake News'])
        for i in range(cm.shape[0]):
            for j in range(cm.shape[1]):
                plt.text(j, i, cm[i, j], ha='center', va='center', color='black')
    
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    
    plt.savefig(save_path, dpi=100)
    print(f"✅ Confusion matrix saved to {save_path}")
    plt.close()


def plot_roc_curve(model, X_test, y_test, save_path='models/roc_curve.png'):
    """Plot ROC curve"""
    
    try:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        if hasattr(model, 'predict_proba'):
            y_pred_proba = model.predict_proba(X_test)[:, 1]
        else:
            y_pred_proba = model.decision_function(X_test)
            y_pred_proba = (y_pred_proba - y_pred_proba.min()) / (y_pred_proba.max() - y_pred_proba.min())
        
        fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
        roc_auc = roc_auc_score(y_test, y_pred_proba)
        
        plt.figure(figsize=(8, 6))
        plt.plot(fpr, tpr, lw=2, label=f'AUC = {roc_auc:.2f}')
        plt.plot([0, 1], [0, 1], linestyle='--')
        
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.title('ROC Curve')
        plt.legend()
        plt.grid(alpha=0.3)
        
        plt.savefig(save_path, dpi=100)
        print(f"✅ ROC curve saved to {save_path}")
        plt.close()
        
    except Exception as e:
        print(f"❌ Could not plot ROC curve: {e}")


def evaluation_pipeline():
    """Complete pipeline"""
    
    # Preprocess
    X_train, X_test, y_train, y_test, vectorizer = preprocess_pipeline()
    
    print("\nLoading best model...")
    
    try:
        model = load_model()
    except Exception as e:
        print(e)
        print("\n⚠️ Fix this by running your training script first.")
        return
    
    # Evaluate
    y_pred, cm = detailed_evaluation(model, X_test, y_test)
    
    plot_confusion_matrix(cm)
    plot_roc_curve(model, X_test, y_test)
    
    print("\n✅ Evaluation complete!")


if __name__ == '__main__':
    evaluation_pipeline()
