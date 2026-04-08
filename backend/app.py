from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import pandas as pd
import os

# Creating a flask app instance
app = Flask(__name__)
# Accommodating cross-origin requests globally
# CORS(app, origins="*")
CORS(app, resources={r"/api/*": {"origins": "*"}})


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
        
        # SQL query for columns I need instead of all of them. Faster
        query = """
            SELECT 
                athleteId,
                fullName, 
                positionAbbreviation, 
                teamName,
                teamLogo,
                teamPrimaryColor,
                teamSecondaryColor,
                totalGoals_value,
                goalAssists_value,
                appearances_value,
                citizenship,
                totalShots_value,
                shot_accuracy,
                conversion_rate
            FROM players 
            WHERE totalGoals_value > 0
        """
        
        # For when position is specified, appending to the query so that I filter to only that position
        if position:
            query += f" AND positionAbbreviation = ?"
            query += f" ORDER BY totalGoals_value DESC LIMIT {limit}"
            df = pd.read_sql_query(query, conn, params=[position])
        
        else:
            query += f" ORDER BY totalGoals_value DESC LIMIT {limit}"
            df = pd.read_sql_query(query, conn)
            print("Scorers columns:", df.columns)
        
        conn.close()
        
        return jsonify(df.to_dict('records'))
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Assisters endpoint
@app.route('/api/stats/top-assisters')
def assisters():
    limit = request.args.get('limit', 10, type=int)
    position = request.args.get('position', type=str)

    try:
        conn = sqlite3.connect(DB_PATH)
        query = """
            SELECT
                athleteId,
                fullName,
                positionAbbreviation,
                teamName,
                teamLogo,
                teamPrimaryColor,
                teamSecondaryColor,
                goalAssists_value,
                totalGoals_value,
                appearances_value,
                citizenship
            FROM players
            WHERE goalAssists_value > 0               
            """
        if position:
            query += f" AND positionAbbreviation = ?"
            query += f" ORDER BY goalAssists_value DESC LIMIT {limit}"
            df = pd.read_sql_query(query, conn, params=[position])
        
        else:
            query += f" ORDER BY goalAssists_value DESC LIMIT {limit}"
            df = pd.read_sql_query(query, conn)
        
        conn.close()
        
        return jsonify(df.to_dict('records'))
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500        

# Goalkeepers endpoint
@app.route('/api/stats/top-goalkeepers')
def goalkeepers():
    limit = request.args.get('limit', 10, type=int)

    try:
        conn = sqlite3.connect(DB_PATH)
        query = """
            SELECT                
                fullName,                
                teamName,
                teamLogo,
                teamPrimaryColor,
                teamSecondaryColor,
                citizenship,
                appearances_value,
                shotsFaced_value,
                saves_value,
                goalsConceded_value,
                save_percentage               
            FROM players
            WHERE positionAbbreviation = "G" AND appearances_value >= 5
            """

        query += f" ORDER BY save_percentage DESC LIMIT {limit}"                
        df = pd.read_sql_query(query, conn)
        conn.close()
        
        return jsonify(df.to_dict('records'))
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500  
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)