from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import pandas as pd

# Creating a flask app instance
app = Flask(__name__)
# Accommodating cross-origin requests globally
CORS(app)

# Just testing flask functionality
@app.route('/api/test')
def test():
    return jsonify({"message": "Working!"})git

# For accessing players
@app.route('/api/players')
def get_players():
    conn = sqlite3.connect('../data/processed/helix_football_data.db')
    df = pd.read_sql_query("SELECT * FROM players LIMIT 10", conn)
    conn.close()
    return jsonify(df.to_dict('records'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)