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

# --- Initialize AI model ---
model = ChatGroq(
    temperature=0,
    model="llama3-8b-8192",
    groq_api_key=os.getenv("GROQ_API_KEY")
)

# --- Tools ---
@tool
def pricing_tool(query: str = "") -> str:
    """Provides PaperSprint custom pricing details."""
    return (
        "Here is our current pricing:\n"
        "- Black & White Printing: ₹2 per page\n"
        "- Color Printing: ₹5 per page"
    )

@tool
def black_and_white_price_tool(query: str = "") -> str:
    """Returns the price for black and white printing."""
    return "Black & White printing costs ₹2 per page."

@tool
def color_price_tool(query: str = "") -> str:
    """Returns the price for color printing."""
    return "Color printing costs ₹5 per page."

@tool
def login_help_tool(query: str = "") -> str:
    """Provides help with logging into the website."""
    return (
        "To log in, click the 'Login' button in the top-right navigation bar.\n"
        "🔗 Navigate to the [Print Section](https://papersprint.in/print-section) to upload your document and log in."
    )

@tool
def cart_help_tool(query: str = "") -> str:
    """Provides cart-related assistance."""
    return (
        "To view your cart and proceed to checkout:\n"
        "🛒 Click here: [Cart Page](http://localhost:5173/cart)"
    )

@tool
def order_status_tool(query: str = "") -> str:
    """Provides order tracking information help."""
    return "To check your order status, click on 'Order Dashboard' in your menu and select the relevant order."

# --- Register tools ---
tools = [
    pricing_tool,
    black_and_white_price_tool,
    color_price_tool,
    login_help_tool,
    cart_help_tool,
    order_status_tool
]
agent_executor = create_react_agent(model, tools)

# --- Command parser using tools directly ---
def basic_command_parser(message: str) -> str | None:
    msg = message.lower()
    if "black and white" in msg and "price" in msg:
        return black_and_white_price_tool.invoke("")
    elif ("color" in msg or "colour" in msg) and "price" in msg:
        return color_price_tool.invoke("")
    elif "price" in msg or "cost" in msg or "rate" in msg:
        return pricing_tool.invoke("")
    elif "login" in msg or "sign in" in msg:
        return login_help_tool.invoke("")
    elif "cart" in msg or "checkout" in msg:
        return cart_help_tool.invoke("")
    elif "order" in msg and ("status" in msg or "track" in msg):
        return order_status_tool.invoke("")
    return None

# --- Welcome route ---
@app.route('/welcome', methods=['GET'])
def welcome():
    return jsonify({
        "response": "👋 Welcome to PaperSprint! We deliver your documents in just 15 minutes."
    })

# --- Chat route ---
@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Handle basic commands with local tools
        pre_response = basic_command_parser(user_message)
        if pre_response:
            return jsonify({"response": pre_response})

        # Fallback to AI agent
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

# --- Run server ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)