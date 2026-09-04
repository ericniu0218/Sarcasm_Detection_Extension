# Sarcasm Detection Browser Extension

Detecting sarcasm in social media comments and news headlines using NLP and deep learning — packaged as a browser extension that helps non-native English speakers understand the true intent behind online text.

Sarcasm is one of the hardest problems in natural language understanding: the literal words often mean the opposite of what's intended. This project trains and compares several models for sarcasm classification, then deploys the best one as a Chrome extension. Beyond a raw prediction, the extension reports a **confidence probability** and uses **explainable AI** to highlight the words that most influenced the model's decision — so users can see *why* a line was flagged, not just *that* it was.

---

## Highlights

- **End-to-end pipeline** — from raw datasets, through preprocessing and model training, to a deployable browser extension.
- **Model comparison** — classical ML (Random Forest, Decision Tree) and handcrafted linguistic features benchmarked against deep learning models (LSTM, BiLSTM, BERT, RoBERTa).
- **Contextual embeddings** — transformer-based models (BERT/RoBERTa) chosen for their proven edge on sarcasm tasks over static embeddings.
- **Explainable predictions** — the extension surfaces per-word importance so results stay interpretable and trustworthy.
- **Two interaction modes** — type text into the popup, or highlight text anywhere on a page and right-click to detect sarcasm inline.

---

## Repository Structure

```
Sarcasm_Detection_Extension/
├── Data Cleaning (Preprocessing)/   # Notebooks for cleaning & normalizing both datasets
├── Models/                          # Training + evaluation notebooks
│   ├── BERT-BiLSTM/
│   ├── RoBERTa/
│   ├── Ngram Handcrafted Features/
│   └── (Random Forest, LSTM, etc.)
├── Extension/                       # The deployable browser extension
│   ├── Sarcasm-Detector/            # manifest, popup, content script, background
│   └── server.py                   # Local inference server hosting the model
└── README.md
```

---

## Datasets

| Dataset | Source |
|---|---|
| News Headlines Dataset for Sarcasm Detection | [Kaggle](https://www.kaggle.com/datasets/rmisra/news-headlines-dataset-for-sarcasm-detection) |
| Self-Annotated Reddit Corpus (SARC) | [Kaggle](https://www.kaggle.com/datasets/danofer/sarcasm?select=train-balanced-sarcasm.csv) |

Using two datasets from different domains (curated news headlines vs. informal Reddit comments) tests how well a single model generalizes across writing styles.

---

## Data Preprocessing

The pipeline compares **contextual** vs. **static** embeddings, and the cleaning strategy differs by embedding type.

**Shared cleaning & normalization (all models)**
- Lowercase all text for consistent tokenization
- Expand contractions (e.g. `can't` → `cannot`)
- Strip URLs, special characters, emojis, and HTML tags
- Collapse extra whitespace and line breaks
- Expand slang (e.g. `lol` → `laughing out loud`)

**LSTM / BiLSTM (static embeddings)**
- Lemmatization and stop-word removal
- Out-of-vocabulary (OOV) handling
- Tokenize words into integer sequences
- Pad sequences to a uniform length

**BERT / RoBERTa (contextual embeddings)**
- Subword tokenization
- Add special tokens (`[CLS]` … `[SEP]`)
- Generate token IDs, attention masks, and segment embeddings via the `transformers` library

---

## Models

Both classical machine learning and deep learning approaches were evaluated:

- **Classical ML:** Random Forest, Decision Tree — including handcrafted features (PoS-tag encodings, stop-word encodings, negation tokens, and n-gram probability features inspired by [Thaokar et al.](https://doi.org/10.1007/s42979-023-02506-5)).
- **Deep learning:** LSTM, BiLSTM, BERT, RoBERTa.

Contextual word embeddings were the focus, since prior work consistently shows they outperform static embeddings on sarcasm detection. Each model's performance is compared and interpreted in light of its architecture, and the strongest model is exported for use in the extension.

---

## Browser Extension

The best-performing model is exported as a PyTorch `.pt` file and served from a local inference server (`Extension/server.py`). The extension calls this server to score text in real time. Extension source lives in the [`Extension`](Extension) folder.

**Usage**

1. Click the extension icon in the browser toolbar and type text into the box:

   <img width="322" alt="Popup input" src="https://github.com/user-attachments/assets/ee460a08-4965-4f2c-8782-e0da2335f183" />

2. Or highlight any text on a page, right-click, and choose **Detect Sarcasm** for an inline result:

   <img width="496" alt="Right-click detection" src="https://github.com/user-attachments/assets/fe5c442e-7c91-47f7-ad6d-6cb384a1d389" />

Each result shows the predicted label, a confidence probability, and the words that most influenced the decision.

---

## Running Locally

1. Start the inference server:
   ```bash
   cd Extension
   python server.py
   ```
2. Load the extension in Chrome:
   - Go to `chrome://extensions`
   - Enable **Developer mode**
   - Click **Load unpacked** and select `Extension/Sarcasm-Detector`
3. Open the extension and detect sarcasm via the popup or right-click menu.
