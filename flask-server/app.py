from flask import Flask, jsonify, request, render_template
import time
import os
from youtubesearchpython import VideosSearch
import os
import time
from urllib.error import HTTPError
import yt_dlp
from flask_cors import CORS


app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})

OUTPUT_PATH = 'static' 
RETRY_LIMIT = 5 
RETRY_DELAY = 10 
NUMBER_FILE = 'counter.txt' 

def get_next_number():
    if os.path.exists(NUMBER_FILE):
        with open(NUMBER_FILE, 'r') as file:
            number = int(file.read().strip())
    else:
        number = 0
    next_number = number + 1
    with open(NUMBER_FILE, 'w') as file:
        file.write(str(next_number))
    return number

def search_youtube(query, retries=RETRY_LIMIT):
    attempt = 0
    while attempt < retries:
        try:
            videos_search = VideosSearch(query, limit=1)
            result = videos_search.result()
            video_id = result['result'][0]['id']
            video_url = f'https://www.youtube.com/watch?v={video_id}'
            return video_url
        except HTTPError as e:
            print(f"HTTP Error: {e.code} - {e.reason}. Retrying in {RETRY_DELAY} seconds...")
            time.sleep(RETRY_DELAY)
            attempt += 1
    raise Exception("Failed to search YouTube after several retries.")

def download_video(video_url, output_path=OUTPUT_PATH):
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    next_number = get_next_number()
    filename = f"{next_number}.mp4"  # Desired final filename
    full_path = os.path.join(output_path, filename)
    ydl_opts = {
        'outtmpl': full_path,
        'format': 'mp4',  # Ensure MP4 format
        'merge_output_format': 'mp4',  # Merge formats into MP4
        'keepvideo': True,  # Avoid deleting the original files after merging
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        print(f"Downloading from {video_url} as {filename}...")
        try:
            ydl.download([video_url])
            print(f"Downloaded to {full_path}")
            return full_path
        except Exception as e:
            print(f"An error occurred during download: {e}")

def download_youtube_video(searchQuery):
    try:
        video_url = search_youtube(searchQuery)
        print(f"Found video URL: {video_url}")
        return download_video(video_url)
    except Exception as e:
        print(f"An error occurred: {e}")

latest_text = ""
listening = False
last_sound_time = time.time()
timeout_duration = 5 

@app.route('/speech', methods=['GET'])
def get_speech():
    return jsonify({"text": latest_text})

@app.route('/stop', methods=['POST'])
def stop_listening():
    global listening
    listening = False
    return jsonify({"status": "Listening stopped"})

@app.route('/ui', methods=['GET'])
def web_ui():
    return render_template('web-speech-ui.html')

@app.route('/yt/', methods=['POST'])
def downloadYTVideoAndReturnURL():
    data = request.get_json()
    print("downloadYTVideoAndReturnURL", data.get('searchString'))
    return download_youtube_video(data.get('searchString'))      
        
if __name__ == '__main__':
    app.run(debug=True)