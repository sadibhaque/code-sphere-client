# Search API Documentation

## Backend Search Endpoint

The frontend search functionality expects a backend API endpoint at:

### GET `/posts/search`

**Query Parameters:**

-   `tags` (string, required): The search term to match against post tags

**Example Request:**

```
GET https://code-sphere-server-nu.vercel.app/posts/search?tags=React
```

**Expected Response:**

```json
[
    {
        "_id": "post_id_1",
        "title": "Getting Started with React",
        "content": "This is a comprehensive guide to React...",
        "authorName": "John Doe",
        "authorEmail": "john@example.com",
        "authorImage": "/path/to/image.jpg",
        "tagList": ["React", "JavaScript", "Frontend"],
        "upvotes": 25,
        "downvotes": 2,
        "createdAt": "2025-01-15T10:30:00Z",
        "time": "2025-01-15T10:30:00Z"
    },
    {
        "_id": "post_id_2",
        "title": "Advanced React Patterns",
        "content": "Learn about advanced React patterns...",
        "authorName": "Jane Smith",
        "authorEmail": "jane@example.com",
        "authorImage": "/path/to/image2.jpg",
        "tagList": ["React", "Advanced", "Patterns"],
        "upvotes": 40,
        "downvotes": 1,
        "createdAt": "2025-01-14T15:45:00Z",
        "time": "2025-01-14T15:45:00Z"
    }
]
```

## Search Logic

The backend should:

1. **Case-insensitive matching**: Search should work regardless of case
2. **Partial matching**: Support partial tag matches (e.g., "Java" matches "JavaScript")
3. **Multiple tags**: Support searching for multiple tags separated by spaces or commas
4. **Tag-based filtering**: Filter posts where any tag contains the search term
5. **Return empty array**: If no matches found, return empty array `[]`

## Example Backend Implementation (Node.js/Express)

```javascript
app.get("/posts/search", async (req, res) => {
    try {
        const { tags } = req.query;

        if (!tags) {
            return res
                .status(400)
                .json({ error: "Tags query parameter is required" });
        }

        // Split search terms and clean them
        const searchTerms = tags
            .split(/[,\s]+/)
            .filter((term) => term.trim().length > 0);

        // Case-insensitive regex search for tags
        const searchRegexes = searchTerms.map((term) => new RegExp(term, "i"));

        // Find posts where any tag matches any search term
        const posts = await Post.find({
            tagList: { $in: searchRegexes },
        }).sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
```

## Frontend Usage

The search functionality is now integrated into the Hero component and will:

1. Show search results below the banner section
2. Hide the normal home page content (Tags, Announcements, Posts) when showing search results
3. Provide a "Clear Search" button to return to normal view
4. Show appropriate messages for no results
5. Display loading state during search
6. Handle search errors gracefully

## Features Implemented

-   ✅ Tag-based search functionality
-   ✅ Real-time search results display
-   ✅ Loading states and error handling
-   ✅ Clear search functionality
-   ✅ Responsive design for search results
-   ✅ Search on Enter key press
-   ✅ Toast notifications for feedback
-   ✅ Empty state with suggested tags
