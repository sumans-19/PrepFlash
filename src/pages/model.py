import cv2
import numpy as np
import time
import sounddevice as sd
import scipy.io.wavfile as wav
import speech_recognition as sr
from deepface import DeepFace
from collections import Counter
from transformers import BertTokenizer, BertForNextSentencePrediction
import torch

# Mapping DeepFace emotions to Interview emotions
emotion_mapping = {
    "happy": "confident",
    "sad": "nervous",
    "angry": "nervous",
    "fear": "nervous",
    "disgust": "nervous",
    "surprise": "confident",
    "neutral": "neutral"
}

# Ideal answer for comparison
ideal_answer = """My name is Harshad Mehta. I come from Raipur, Chhattisgarh. I have completed my graduation in Mechanical Engineering from Reliance Institute of Technology, Durg. I have taken Geology as an optional subject in Forestry, and my hobbies and areas of interest include working out."""

# --------------- Webcam Video + Emotion Capture ---------------
def record_video_and_emotions():
    cap = cv2.VideoCapture(0)

    width = int(cap.get(3))
    height = int(cap.get(4))
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    
    timestamp = int(time.time())
    video_filename = f"interview_{timestamp}.avi"
    audio_filename = f"audio_{timestamp}.wav"
    
    out = cv2.VideoWriter(video_filename, fourcc, 20.0, (width, height))

    # To record emotions
    emotions_detected = []

    # Start audio recording separately
    audio_fs = 44100
    audio_duration = 60  # seconds, 1 minute duration
    print("Recording Audio... Speak Now.")
    audio_recording = sd.rec(int(audio_duration * audio_fs), samplerate=audio_fs, channels=1, dtype='int16')
    
    start_time = time.time()
    print("Webcam recording started. Press 'q' to finish early.")
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        out.write(frame)

        try:
            result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
            dominant_emotion = result[0]['dominant_emotion']
            mapped_emotion = emotion_mapping.get(dominant_emotion, "neutral")
            emotions_detected.append(mapped_emotion)
        except Exception as e:
            pass

        # Show frame (optional, can comment if you want hidden)
        cv2.imshow('Interview Recording', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        # Stop after predefined time
        if time.time() - start_time > audio_duration:
            break

    cap.release()
    out.release()
    cv2.destroyAllWindows()

    # Finish audio recording
    sd.wait()  # Ensure the recording is finished
    wav.write(audio_filename, audio_fs, audio_recording)

    # Find the most frequent emotion
    emotion_counter = Counter(emotions_detected)
    if emotion_counter:
        most_common_emotion = emotion_counter.most_common(1)[0][0]
    else:
        most_common_emotion = "neutral"

    # Save the most common emotion to a file
    with open("emotion_output.txt", "w") as f:
        f.write(most_common_emotion)

    print(f"Video saved as {video_filename}")
    print(f"Audio saved as {audio_filename}")
    print(f"Emotion saved as 'emotion_output.txt'")

    return audio_filename, video_filename, most_common_emotion

# --------------- Audio to Text Extraction ---------------
def audio_to_text(audio_filename):
    recognizer = sr.Recognizer()

    # First preprocess audio
    try:
        # Load WAV file
        sample_rate, audio_data = wav.read(audio_filename)

        # If stereo, convert to mono
        if len(audio_data.shape) == 2:
            audio_data = np.mean(audio_data, axis=1).astype(np.int16)

        # Normalize to 16000 Hz if not already
        if sample_rate != 16000:
            import librosa
            audio_data = librosa.resample(audio_data.astype(float), orig_sr=sample_rate, target_sr=16000)
            audio_data = audio_data.astype(np.int16)
            wav.write(audio_filename, 16000, audio_data)

    except Exception as e:
        print(f"Audio preprocessing failed: {e}")
        with sr.AudioFile(audio_filename) as source:
            audio = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        text = "Could not understand audio."
    except sr.RequestError:
        text = "API unavailable."

    # Save to file
    with open("user_answer.txt", "w") as f:
        f.write(text)

    print(f"Extracted text saved to 'user_answer.txt'.")

    return text

# --------------- BERT Model Comparison ---------------
def compare_with_ideal_answer(user_answer):
    # Initialize the tokenizer and model for BERT (Next Sentence Prediction task)
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    model = BertForNextSentencePrediction.from_pretrained('bert-base-uncased')

    # Tokenize the ideal answer and user answer
    inputs = tokenizer.encode(ideal_answer, user_answer, return_tensors='pt')

    # Get the model's prediction
    with torch.no_grad():
        outputs = model(inputs)[0]

    # The model gives a score for whether the second sentence is a logical continuation of the first sentence.
    # We will use the next_sentence_logits to calculate similarity.
    score = outputs[0][0].item()

    # Set a threshold for a good match (can be adjusted)
    threshold = 0.5  # Adjust the threshold based on your requirements

    # Determine feedback based on the score
    if score > threshold:
        feedback = "Good response! Your answer is similar to the ideal one."
    else:
        feedback = "Your answer could be improved. Consider aligning more closely with the ideal answer."

    return feedback

# --------------- Main Combined Function ---------------
def main():
    audio_file, video_file, final_emotion = record_video_and_emotions()
    extracted_text = audio_to_text(audio_file)
    
    # Compare the extracted text with the ideal answer
    feedback = compare_with_ideal_answer(extracted_text)
    
    # Save feedback to file
    with open("feedback.txt", "w") as f:
        f.write(feedback)
    
    print(f"Feedback: {feedback}")

if name == "main":
    main()