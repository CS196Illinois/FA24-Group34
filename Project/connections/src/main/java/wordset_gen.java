import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

public class wordset_gen {

    private static final String API_KEY = "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"; // Replace with your actual API key
    private static final String API_URL = "https://api.openai.com/v1/chat/completions";
    public static  int MAX_ATTEMPTS = 5;

    public static void main(String[] args) {
        try {
            JSONObject gameJson = generateGameJson();
            
            // Print result
            System.out.println("Returned JSON to caller:");
            System.out.println(gameJson.toString(2));
        } catch (IOException e) { // IOException may be thrown by internal OkHttpClient errors
            System.err.println("Failed to generate valid JSON due to network issues.");
        } catch (JSONException e) { // JSONException may be thrown when exceeds MAX_ATTEMPTS
            System.err.println("Failed to generate valid JSON after " + MAX_ATTEMPTS + " attempts.");
        }
    }

    public static JSONObject generateGameJson() throws IOException, JSONException {
        OkHttpClient client = new OkHttpClient(); // Create OkHttpClient instance here

        String systemPrompt = """
                You are a game assistant specialized in creating "Connections" games, where players categorize words into four groups of related terms. Follow these rules to create each game:

                1. **Game Structure**: The game should include exactly 4 groups, each with exactly 4 **single** words. The words in each group should be **remotely and only remotely** related in a meaningful way (e.g., synonyms, types, shared attributes) and belong to a common theme (e.g., animals, technology, sports).

                2. **Theme**: Select a provided theme to guide the game’s word choices. This theme could be a thing, description, or abstract concept (e.g., "FOREMOST," "SPIKY THINGS," "OVERLY SENTIMENTAL WORK," "Olympic sport," "Programming terms," animals, technology, sports).

                3. **Word Choice**:
                    - Ensure the words within each group are related, but select some words that could almost fit into multiple groups to add a challenge.
                    - Avoid repeating any word across groups.
                    - Do not use punctuation in the words (use dashes if necessary).
                    - Do not use overly obvious words.
                    - Each group of words should be a mix of nouns, verbs, adjectives, etc.
                    - Lean towards moderately sophisticated and ambiguous word choices to make the game challenging.
                    - Lean towards adjectives, verbs, and less toward nouns.

                4. **Instructions for Responses**:
                    - Provide the solution as a JSON object.
                    - Include group names as keys (e.g., "Types of Ball Games," "Olympic Sports") and list each group’s words as an array of strings.
                    - Ensure the output is well-formatted JSON.

                Only respond with a well-formatted JSON object. Do not add any commentary, markdown, or explanations before or after the JSON. Here is an example of a valid response:

                ```json
                {
                    "Wordset": {
                        "Group 1 Name": ["word1", "word2", "word3", "word4"],
                        "Group 2 Name": ["word1", "word2", "word3", "word4"],
                        "Group 3 Name": ["word1", "word2", "word3", "word4"],
                        "Group 4 Name": ["word1", "word2", "word3", "word4"]
                    }
                }
                ```

                Make the game hard. Everyone loves a challenge.
                """;

        int attempts = 0; // Initialize attempt counter

        try {
            while (attempts < MAX_ATTEMPTS) { // Loop until we reach MAX_ATTEMPTS
                attempts++; // Increment attempt counter

                // Build the JSON request
                JSONObject json = new JSONObject();
                json.put("model", "gpt-4"); // Choose gpt model

                // Prepare API request
                json.put("messages", new JSONArray()
                    .put(new JSONObject().put("role", "system").put("content", systemPrompt))
                    .put(new JSONObject().put("role", "user").put("content", "Create a connections game about four different themes."))
                );

                // Make the HTTP request
                RequestBody body = RequestBody.create(json.toString(), MediaType.get("application/json"));
                Request request = new Request.Builder()
                    .url(API_URL)
                    .addHeader("Authorization", "Bearer " + API_KEY)
                    .post(body)
                    .build();

                String rawContent = null; // Initialize variable to store raw response content

                try (Response response = client.newCall(request).execute()) {
                    if (response.isSuccessful() && response.body() != null) {
                        // Get the raw response body as a string and store it in rawContent
                        rawContent = response.body().string();
                        
                        // Extract "content" field from first choice
                        JSONObject responseJson = new JSONObject(rawContent);
                        String content = responseJson.getJSONArray("choices")
                                .getJSONObject(0)
                                .getJSONObject("message")
                                .getString("content");

                        // Check for markdown formatting
                        if (content.startsWith("```json")) {
                            content = content.substring(7); 
                        }
                        if (content.endsWith("```")) {
                            content = content.substring(0, content.length() - 3);
                        }
                        content = content.trim(); // Trim any extra whitespace

                        // Try parsing content as JSON to check if it's valid
                        JSONObject gameData = new JSONObject(content);

                        // Return valid JSON to the caller
                        return gameData;
                    } else {
                        System.err.println("Request failed: " + response.message()); // In case of unsuccessful response
                    }
                } catch (IOException e) {
                    System.err.println("Network error, retrying...");
                } catch (JSONException e) {
                    System.err.println("Invalid JSON received, retrying...");
                    // Print failed JSON content for debugging
                    if (rawContent != null) {
                        System.err.println("Raw response content that caused JSON parsing error:");
                        System.err.println(rawContent);
                    }
                }
            }
        } finally {
            // Clean up resources

            /*  This part does not work for some reason, so I commented it out.
             *  Warning message as follows:
             *  [WARNING] thread Thread[#38,OkHttp TaskRunner,5,wordset_gen] was interrupted but is still alive after waiting at least 15000msecs
                [WARNING] thread Thread[#38,OkHttp TaskRunner,5,wordset_gen] will linger despite being asked to die via interruption
                [WARNING] thread Thread[#39,OkHttp TaskRunner,5,wordset_gen] will linger despite being asked to die via interruption
                [WARNING] thread Thread[#40,OkHttp TaskRunner,5,wordset_gen] will linger despite being asked to die via interruption
                [WARNING] thread Thread[#41,OkHttp TaskRunner,5,wordset_gen] will linger despite being asked to die via interruption
                [WARNING] thread Thread[#42,Okio Watchdog,5,wordset_gen] will linger despite being asked to die via interruption
                [WARNING] NOTE: 5 thread(s) did not finish despite being asked to  via interruption. This is not a problem with exec:java, it is a problem with the running code. Although not serious, it should be remedied.
             */
            
             /*
            client.dispatcher().executorService().shutdown();
            client.connectionPool().evictAll();
            client.dispatcher().cancelAll();
            if (client.cache() != null) {
                client.cache().close();
            }
            */
        }

        // After 5 attempts, throw an exception
        throw new JSONException("Failed to generate valid JSON after " + MAX_ATTEMPTS + " attempts.");
    }
}
