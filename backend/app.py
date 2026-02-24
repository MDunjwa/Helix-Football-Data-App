from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import pandas as pd
import os

# Creating a flask app instance
app = Flask(__name__)
# Accommodating cross-origin requests globally
CORS(app)

# Database absolute path setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'data', 'processed', 'helix_football_data.db')

print(f"Database path: {DB_PATH}")

# Just testing flask functionality
@app.route('/api/test')
def test():
    return jsonify({"message": "Working!"})

# For accessing players
@app.route('/api/players')
def get_players():
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql_query("SELECT * FROM players LIMIT 10", conn)
    conn.close()
    return jsonify(df.to_dict('records'))

# For accessing top scorers
@app.route('/api/stats/top-scorers')
def top_scorers():

    # Getting query parameters (with defaults)
    limit = request.args.get('limit', 10, type=int)
    position = request.args.get('position', type=str)  # Optional: F, M, D, G
    
    try:
        conn = sqlite3.connect(DB_PATH)
        
        # SQL query for 9 columns I need instead of all of them. Faster
        query = """
            SELECT 
                athleteId,
                fullName, 
                positionAbbreviation, 
                teamName,
                totalGoals_value,
                goalAssists_value,
                appearances_value,
                shot_accuracy,
                conversion_rate
            FROM players 
            WHERE totalGoals_value > 0
        """
        
        # For when position is specified, appending to the query so that I filter to only that position
        if position:
            query += f" AND positionAbbreviation = '{position}'"
        
        # Sorting
        query += f" ORDER BY totalGoals_value DESC LIMIT {limit}"
        
        df = pd.read_sql_query(query, conn)
        conn.close()
        
        return jsonify(df.to_dict('records'))
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)