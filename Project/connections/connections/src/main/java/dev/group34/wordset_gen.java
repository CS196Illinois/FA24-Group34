package dev.group34;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;

public class wordset_gen {

        private static final String API_KEY = "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";
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
                    - Provide the solution as a JSON object.
                    - Include group names as keys (e.g., "Types of Ball Games," "Olympic Sports") and list each group’s words as an array of strings.
                    - Ensure the output is well-formatted JSON.

                Example of desired output format:

                ```json
                {
                    "Connections Game": {
                    "Group 1 Name": ["word1", "word2", "word3", "word4"],
                    "Group 2 Name": ["word1", "word2", "word3", "word4"],
                    "Group 3 Name": ["word1", "word2", "word3", "word4"],
                    "Group 4 Name": ["word1", "word2", "word3", "word4"]
                    }
                }
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
                    // Parse the response as JSON
                    JSONObject responseJson = new JSONObject(response.body().string());
                    
                    // Extract the assistant's reply (the actual game data in JSON format)
                    String content = responseJson.getJSONArray("choices")
                            .getJSONObject(0)
                            .getJSONObject("message")
                            .getString("content");
    
                    // Parse the content as JSON (if the response was in JSON format)
                    JSONObject gameData = new JSONObject(content);
    
                    // Pretty print the JSON response
                    System.out.println("Formatted JSON Response:");
                    System.out.println(gameData.toString(2)); // Indentation of 2 for readability
    
                } else {
                    System.err.println("Request failed: " + response.message());
                }
            }
    }
}
