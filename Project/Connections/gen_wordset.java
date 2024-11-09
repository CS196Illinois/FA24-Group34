import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;


public class gen_wordset {
    private static final String API_KEY = "YOUR_API_KEY"; // Replace with your API key
    private static final String API_URL = "https://api.openai.com/v1/chat/completions";

    public static void main(String[] args) throws IOException {
        OkHttpClient client = new OkHttpClient();

        // System Prompt for Connections Game Creation
        String systemPrompt = """
                You are a game assistant specialized in creating "Connections" games, where players categorize words into four groups of related terms. Follow these rules to create each game:
                
                1. **Game Structure**: The game should include exactly 4 groups, each with 4 words. The words in each group should be related in a meaningful way (e.g., synonyms, types, shared attributes) and belong to a common theme (e.g., animals, technology, sports).
                
                2. **Theme**: Select or use a provided theme, such as sports, animals, technology, etc., to guide the game’s word choices.
                
                3. **Word Choice**:
                   - Ensure the words within each group are closely related, but select some words that could almost fit into multiple groups to add a challenge.
                   - Avoid repeating any word across groups.
                   - Do not use punctuation in the words (use dashes if necessary).
                
                4. **Instructions for Responses**:
                   - If the user requests, give the solution by listing the words sorted into their four categories.
                   - Otherwise, respond to the user’s initial request without showing the groups or words directly.
                
                5. **Game Output Example**:
                   To ensure clarity, structure the game internally with a title, author (if provided), and category descriptions, but do not reveal these directly to the user unless specifically requested.

                [BLANK SPACE FOR OUTPUT FORMAT SPECIFICATION]
                """;

        // Request data
        JSONObject json = new JSONObject();
        json.put("model", "gpt-4");
        
        // Message structure with system prompt and blank user prompt
        JSONArray messages = new JSONArray()
            .put(new JSONObject().put("role", "system").put("content", systemPrompt))
            .put(new JSONObject().put("role", "user").put("content", "Create a connections game about sports."));
        
        json.put("messages", messages);

        // Make HTTP request
        RequestBody body = RequestBody.create(json.toString(), MediaType.get("application/json"));
        Request request = new Request.Builder()
            .url(API_URL)
            .addHeader("Authorization", "Bearer " + API_KEY)
            .post(body)
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                System.out.println("Response from API:");
                System.out.println(response.body().string());
            } else {
                System.err.println("Request failed: " + response.message());
            }
        }
    }

}
