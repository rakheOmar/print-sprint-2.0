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

# --- Base URL for frontend ---
BASE_URL = "http://localhost:5173"

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
        f'To log in, click the "Login" button in the top-right navigation bar.\n'
        f'Navigate to {BASE_URL}/print-section to upload your document and log in.'
    )

@tool
def cart_help_tool(query: str = "") -> str:
    """Provides cart-related assistance."""
    return f'To view your cart and proceed to checkout:\n{BASE_URL}/cart'

@tool
def order_status_tool(query: str = "") -> str:
    """Provides order tracking information help."""
    return f'To check your order status:\n{BASE_URL}/order-dashboard'

@tool
def routes_tool(query: str = "") -> str:
    """Lists all available PaperSprint website routes (frontend & backend)."""
    return (
        "Here are the available routes:\n\n"
        f"{BASE_URL}/\n"
        f"{BASE_URL}/privacy-policy\n"
        f"{BASE_URL}/blog\n"
        f"{BASE_URL}/careers\n"
        f"{BASE_URL}/terms-of-service\n"
        f"{BASE_URL}/contact-us\n"
        f"{BASE_URL}/about-us\n"
        f"{BASE_URL}/registerPartner\n"
        f"{BASE_URL}/print-section\n"
        f"{BASE_URL}/cart\n"
        f"{BASE_URL}/partner-with-us\n"
        f"{BASE_URL}/order-dashboard\n"
        f"{BASE_URL}/profile\n"
        f"{BASE_URL}/payment\n"
        f"{BASE_URL}/courier-dashboard\n"
        f"{BASE_URL}/admin-panel\n"
        f"{BASE_URL}/partner/dashboard"
    )

# --- Register tools ---
tools = [
    pricing_tool,
    black_and_white_price_tool,
    color_price_tool,
    login_help_tool,
    cart_help_tool,
    order_status_tool,
    routes_tool
]
agent_executor = create_react_agent(model, tools)

# --- Route dictionary for link generation ---
ROUTE_PATHS = {
    "home": "/",
    "main": "/",
    "homepage": "/",
    "cart": "/cart",
    "partner dashboard": "/partner/dashboard",
    "order dashboard": "/order-dashboard",
    "courier dashboard": "/courier-dashboard",
    "admin panel": "/admin-panel",
    "profile": "/profile",
    "print": "/print-section",
    "payment": "/payment",
    "privacy": "/privacy-policy",
    "terms": "/terms-of-service",
    "blog": "/blog",
    "career": "/careers",
    "contact": "/contact-us",
    "about": "/about-us",
    "register": "/registerPartner",
    "partner with us": "/partner-with-us"
}

# --- Generate dynamic raw link ---
def generate_dynamic_link(message: str) -> str | None:
    msg = message.lower()
    for keyword, path in ROUTE_PATHS.items():
        if keyword in msg:
            return f"{BASE_URL}{path}"  # return actual URL only
    return None

# --- Command parser ---
def basic_command_parser(message: str) -> str | None:
    link = generate_dynamic_link(message)
    if link:
        return link

    # General routes list
    if "routes" in message.lower() or "pages" in message.lower() or "urls" in message.lower():
        return routes_tool.invoke("")

    # Pricing and support
    if "black and white" in message.lower() and "price" in message.lower():
        return black_and_white_price_tool.invoke("")
    elif ("color" in message.lower() or "colour" in message.lower()) and "price" in message.lower():
        return color_price_tool.invoke("")
    elif "price" in message.lower() or "cost" in message.lower() or "rate" in message.lower():
        return pricing_tool.invoke("")
    elif "login" in message.lower() or "sign in" in message.lower():
        return login_help_tool.invoke("")
    elif "checkout" in message.lower():
        return cart_help_tool.invoke("")
    elif "order" in message.lower() and ("status" in message.lower() or "track" in message.lower()):
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