# app.py (or main.py, but typically app.py for Flask)
from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS
from langchain_core.messages import HumanMessage
from langchain_groq import ChatGroq
from langchain.tools import tool # You have this, but currently no tools are defined
from langgraph.prebuilt import create_react_agent
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Initialize the model and agent outside the route to avoid re-initializing on every request
model = ChatGroq(
    temperature=0,
    model="llama3-8b-8192",
    groq_api_key=os.getenv("GROQ_API_KEY")
)
# Define your tools here if you have any. For now, it's an empty list.
@tool
def my_tool(query: str) -> str:
    """Greeting"""
    return f"Tool executed with query: {query}"
tools = [] # Add your tools here if you define them, e.g., tools = [my_tool]
agent_executor = create_react_agent(model, tools)

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # Run the agent and capture its output
    try:
        # For simplicity, we'll get the final message content
        # If you need streaming behavior, it's more complex with standard Flask routes
        response_chunks = []
        for chunk in agent_executor.stream({"messages": [HumanMessage(content=user_message)]}):
            if "agent" in chunk and "messages" in chunk["agent"]:
                for message in chunk["agent"]["messages"]:
                    response_chunks.append(message.content)

        full_response = "".join(response_chunks)
        return jsonify({"response": full_response})

    except Exception as e:
        print(f"Error during agent execution: {e}")
        return jsonify({"error": "Failed to get response from AI"}), 500

if __name__ == '__main__':
    # You can specify a port, e.g., port=5000
    app.run(debug=True, port=5000) # Run Flask app on port 5000