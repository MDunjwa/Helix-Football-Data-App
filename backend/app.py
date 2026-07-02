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
    df = df.where(pd.notnull(df), None)
    df = df.where(pd.notnull(df), None)
    return jsonify(df.to_dict('records'))

# For accessing top scorers
@app.route('/api/stats/top-scorers')
def top_scorers():

    # Getting query parameters (with defaults)
    limit = request.args.get('limit', 10, type=int)
    position = request.args.get('position', type=str)  # Optional: F, M, D, G
    league = request.args.get('league', type=str)
    
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
        
        # League differentiation
        params = []

        if league:
            query += " AND league = ?"
            params.append(league)

        if not league:
            league = "ENG.1"

        if position:
            query += " AND positionAbbreviation = ?"
            params.append(position)

        query += " ORDER BY totalGoals_value DESC LIMIT ?"

        params.append(limit)  
        df = pd.read_sql_query(query, conn, params=params)      
        
        conn.close()
        
        df = df.where(pd.notnull(df), None)
        return jsonify(df.to_dict('records'))
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Assisters endpoint
@app.route('/api/stats/top-assisters')
def assisters():
    limit = request.args.get('limit', 10, type=int)
    position = request.args.get('position', type=str)
    league = request.args.get('league', type=str)

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
                chances_created,
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
        
        df = df.where(pd.notnull(df), None)
        return jsonify(df.to_dict('records'))
    
    except Exception as e:
        print(f"ASSISTERS ERROR: {e}")
        return jsonify({"error": str(e)}), 500        

# Goalkeepers endpoint
@app.route('/api/stats/top-goalkeepers')
def goalkeepers():
    limit = request.args.get('limit', 10, type=int)
    league = request.args.get('league', type=str)

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
            WHERE positionAbbreviation = "G" AND appearances_value >= 15
            """

        query += f" ORDER BY save_percentage DESC LIMIT {limit}"                
        df = pd.read_sql_query(query, conn)
        conn.close()
        
        df = df.where(pd.notnull(df), None)
        return jsonify(df.to_dict('records'))
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500  
    
# Analytics endpoints
# Goalkeepers endpoint
@app.route('/api/stats/scatter')
def scatter():

    allowed_columns = [
        "totalGoals_value", "goalAssists_value", "totalShots_value",
        "shot_accuracy", "shotsOnTarget_value", "conversion_rate", "on_target_conversion_rate",
        "chances_created", "foulsCommitted_value", "foulsSuffered_value",
        "yellowCards_value", "saves_value", "goalsConceded_value",
        "save_percentage", "shotsFaced_value", "appearances_value" , "discipline_score"
    ]

    # Getting query parameters with defaults 
    x_axis = request.args.get("x","totalShots_value")
    y_axis = request.args.get("y","totalGoals_value")
    position = request.args.get("position",type=str)

    # Validation
    if x_axis not in allowed_columns or y_axis not in allowed_columns:
            return jsonify({"error": "Invalid column name"}), 400
    
    try:
        conn = sqlite3.connect(DB_PATH)
        query = f"""
            SELECT
                fullName,
                positionAbbreviation,
                teamName,
                teamPrimaryColor,
                {x_axis},
                {y_axis}
            FROM players
            WHERE appearances_value >= 10
            AND {x_axis} IS NOT NULL
            AND {y_axis} IS NOT NULL
        """    
            
        # Filtering out low values that skew data
        accuracy_stats = {"shot_accuracy", "conversion_rate", "on_target_conversion_rate"}
        
        if x_axis in accuracy_stats or y_axis in accuracy_stats:
            query += " AND totalShots_value >= 20"

        if x_axis == "chances_created" or y_axis == "chances_created":
            query += " AND chances_created >= 10"

        if x_axis == "save_percentage" or y_axis == "save_percentage":
            query += " AND shotsFaced_value >= 30"
        
        if position:
            query += " AND positionAbbreviation = ?"
            df = pd.read_sql_query(query, conn, params=[position])
        else:
            df = pd.read_sql_query(query, conn)

        conn.close()
        df = df.where(pd.notnull(df), None)
        import json
        return app.response_class(
            response=df.to_json(orient='records'),
            mimetype='application/json'
        )
    
    except Exception as e:
        print(f"SCATTER ERROR: {e}")
        import json
        return app.response_class(
            response=df.to_json(orient='records'),
            mimetype='application/json'
        )

# Compare endpoints

# Player search
@app.route('/api/players/search')
def search_players():
    print(f"DB_PATH: {DB_PATH}")
    print(f"DB exists: {os.path.exists(DB_PATH)}")
    q = request.args.get('q', type=str)
    position = request.args.get('position', type=str)
    
    # Guard against empty searches or too many results
    if not q or len(q) < 2:
        return jsonify([])
    
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
                age
            FROM players
            WHERE fullName LIKE ?
        """
        params = [f"%{q}%"]

        if position:
            query += " AND positionAbbreviation = ?"
            params.append(position)

        query += " LIMIT 8"      

        df = pd.read_sql_query(query, conn, params=params)  
        conn.close()
        df = df.where(pd.notnull(df), None)
        return jsonify(df.to_dict('records'))
    
    except Exception as e:
        print(f"SEARCH ERROR: {e}")
        return jsonify({"error": str(e)}), 500

# Player detail endpoint
@app.route('/api/players/<athlete_id>')
def get_player(athlete_id):
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
                age,
                citizenship,
                appearances_value,
                totalGoals_value,
                goalAssists_value,
                shot_accuracy,
                conversion_rate,
                on_target_conversion_rate,
                fouls_suff_pct_pos,
                chances_created,
                goals_pct_pos,
                chances_created_pct_pos,
                assists_pct_pos,
                shot_accuracy_pct_pos,
                conversion_pct_pos,
                on_target_conv_pct_pos,
                fouls_suff_pct_pos,
                fouls_comm_pct_pos
            FROM players
            WHERE athleteId = ?
        """
        df = pd.read_sql_query(query, conn, params=[athlete_id])
        conn.close()
        
        if df.empty:
            return jsonify({"error": "Player not found"}), 404
            
        df = df.where(pd.notnull(df), None)
        return jsonify(df.to_dict('records')[0])
    
    except Exception as e:
        print(f"PLAYER ERROR: {e}")
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)