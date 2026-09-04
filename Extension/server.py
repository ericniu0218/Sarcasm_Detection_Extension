from flask import Flask, request, jsonify
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

app = Flask(__name__)

# Load sarcasm model
MODEL_PATH = "sarcasm_model.pt"
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased")
model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
model.eval()

@app.route("/detect_sarcasm", methods=["POST"])
def detect_sarcasm():
    data = request.get_json()
    text = data.get("text", "")
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        pred = torch.argmax(logits, dim=1).item()
    is_sarcastic = bool(pred == 1)  
    return jsonify({"sarcastic": is_sarcastic})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)