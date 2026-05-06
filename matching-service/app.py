from flask import Flask, request, jsonify
from flask_cors import CORS
from matcher import match_talent_to_bounty
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Only allow requests from our own backend
CORS(app, origins=[os.getenv('ALLOWED_ORIGIN', 'http://localhost:3000')])

API_SECRET = os.getenv('MATCHING_SERVICE_SECRET', 'dev-secret')


@app.before_request
def check_auth():
    # Health check is public
    if request.path == '/health' and request.method == 'GET':
        return None

    secret = request.headers.get('X-Internal-Secret')
    if secret != API_SECRET:
        return jsonify({'error': 'Unauthorized'}), 401


@app.get('/health')
def health():
    return jsonify({'status': 'ok', 'model': 'all-MiniLM-L6-v2'})


@app.post('/match')
def match():
    try:
        body = request.get_json(force=True)

        bounty = body.get('bounty')
        talents = body.get('talents')

        if not bounty:
            return jsonify({'error': 'bounty is required'}), 400
        if talents is None or not isinstance(talents, list):
            return jsonify({'error': 'talents must be an array'}), 400
        if len(talents) == 0:
            return jsonify({'results': [], 'count': 0, 'bountyId': bounty.get('id')}), 200

        results = match_talent_to_bounty(bounty, talents)

        bounty_id = bounty.get('id', '')
        top_score = results[0]['matchScore'] if results else 0
        print(f'[/match] bountyId={bounty_id}, talents={len(talents)}, top_score={top_score}')

        return jsonify({
            'results':  results,
            'count':    len(results),
            'bountyId': bounty_id,
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 7860))
    app.run(host='0.0.0.0', port=port)
