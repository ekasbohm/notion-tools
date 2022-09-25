export async function searchBooks(searchTerm: string) {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&fields=items(id,volumeInfo/title,volumeInfo/authors,volumeInfo/imageLinks)&maxResults=7&orderBy=relevance&printType=books`
  );
  const { items } = await res.json();
  return items || [];
}

export async function addBook(title: string, author: string, cover?: string) {
  const searchRes = await fetch("/api/notion", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      variables: { title },
      query: `query SearchGoogleBooks($title: String!) {
        searchBooks(title: $title) {
          title
        }
      }`,
    }),
  });
  const {
    data: { searchBooks: searchResults },
  } = await searchRes.json();
  if (searchResults.length > 0) {
    return "This book already exists in Notion!";
  }
  try {
    const createBookRes = await fetch("/api/notion", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        variables: { title, author, cover },
        query: `mutation CreateBook($title: String!, $author: String, $cover: String) {
        addBook(title: $title, author: $author, cover: $cover) {
          title
        }
      }`,
      }),
    });
    if (createBookRes.status === 200) {
      return `${title} added to Notion!`;
    }
    return "";
  } catch (e) {
    return "Error!";
  }
}
