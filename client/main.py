from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_core.messages import HumanMessage
from langchain_groq import ChatGroq
from langchain.tools import tool
from langgraph.prebuilt import create_react_agent
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize AI model
model = ChatGroq(
    temperature=0,
    model="llama3-8b-8192",
    groq_api_key=os.getenv("GROQ_API_KEY")
)

# --- Custom Pricing Tool ---
@tool
def pricing_tool(query: str = "") -> str:
    """
    Provides PaperSprint custom pricing details.
    """
    return (
        "Here is our current pricing:\n"
        "- Black & White Printing: ₹2 per page\n"
        "- Color Printing: ₹4 per page"
    )

tools = [pricing_tool]  # Add our tool here
agent_executor = create_react_agent(model, tools)

# --- Welcome endpoint ---
@app.route('/welcome', methods=['GET'])
def welcome():
    return jsonify({
        "response": "👋 Welcome to PaperSprint! We deliver your documents in just 15 minutes."
    })

# --- Chat endpoint ---
@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
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
    app.run(debug=True, port=5000)