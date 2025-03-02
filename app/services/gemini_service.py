import re
from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import settings

def _clean_output(text: str) -> str:
    """
    Performs simple post-processing to remove unwanted leading/trailing
    formatting (like numbering or bullet points). You can extend this as needed.
    """
    # Remove leading digits or bullet points (e.g., "1. " or "1) ")
    text = re.sub(r"^\d+[\.\)]\s*", "", text.strip())
    return text.strip()

def extract_output(result) -> str:
    """
    Extracts text from the LLM response. It first checks for a pretty_repr() method,
    then attempts to extract standard dictionary keys.
    """
    if hasattr(result, "pretty_repr"):
        raw_text = str(result.pretty_repr()).strip()
        if raw_text:
            return raw_text
    # Fallback: try to extract from common keys
    if isinstance(result, dict):
        raw_text = (result.get("content") or result.get("answer")
                    or result.get("output") or result.get("result") or "")
        if raw_text:
            return raw_text.strip()
    elif isinstance(result, str):
        return result.strip()
    return ""

def summarize_activities(text: str) -> str:
    """
    Uses ChatGoogleGenerativeAI from LangChain to generate a concise summary
    of the given text using a multi-message prompt. It then extracts and cleans
    the output using extract_output().
    """

    prompt = [
        {
            "role": "system",
            "content": (
                "Summarize the user's activity log in a clear, concise, and helpful manner, using language that reflects the user's perspective without referring to themselves as 'I.' Present the summary as one short paragraph without using bullet points, numbering, or additional labels."
            )
        },
        {
            "role": "user",
            "content": text
        }
    ]

    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.3,
        max_tokens=512,
        timeout=None,
        max_retries=2,
        api_key=settings.GEMINI_FLASH_API_KEY  # Ensure your .env provides this key.
    )

    result = llm.invoke(prompt)
    
    # Debug: Uncomment to print full raw result
    # print("DEBUG: Raw LLM result (summarization):", result)
    raw_summary = extract_output(result.content)
    final_summary = _clean_output(raw_summary)
    
    return final_summary if final_summary else "Error in summarization"

def compare_performance(text1: str, text2: str) -> str:
    """
    Uses ChatGoogleGenerativeAI from LangChain to compare two sets of activities
    and explain which user appears more productive and why. It uses a multi-message prompt
    and extracts the output with extract_output().
    """

    for _ in range(4):
        prompt = [
            {
                "role": "system",
                "content": (
                    "You are a funny AI assistant. Compare two sets of activities and explain which person appears "
                    "to be overall more productive based on a few criteria and why. Provide a clear, concise and friendly answer with no extra numbering or bullet points."
                    "You can refer to the people as 'Person 1' and 'Person 2' in your response."
                    "You must conclude your answer with 'Person 1' or 'Person 2' with no special formatting to indicate the more productive person."
                    "If the comparison is too close to call, conclude your answer with the word 'None'."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Person 1 Activities: {text1}\n\n"
                    f"Person 2 Activities: {text2}\n\n"
                    "Comparison:"
                )
            }
        ]

        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.7,
            max_tokens=150,
            timeout=None,
            max_retries=2,
            api_key=settings.GEMINI_FLASH_API_KEY
        )

        result = llm.invoke(prompt)

        raw_comparison = extract_output(result.content)
        final_comparison = _clean_output(raw_comparison)
        lines = final_comparison.splitlines()
        lines[-1] = lines[-1].strip()
        lastline = lines[-1].lower()
        
        for keyword,idx in (("person 1",1), ("person 2",2), ("none",0)):
            if lastline.endswith(keyword):
                lines[-1] = lines[-1][:-len(keyword)]
                reasoning = "\n".join(lines)
                
                return reasoning, idx
    return "",0