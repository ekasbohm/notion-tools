import React, { useEffect, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { searchBooks, addBook } from "../book-fetchers";

type GoogleBook = {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    imageLinks: {
      thumbnail: string;
    };
  };
};

type Book = {
  title: string;
  authors: string[];
  thumbnail?: string;
};

export default function BookSearch() {
  const [bookResults, setBookResults] = useState<GoogleBook[]>([]);
  const [bookSearch, setBookSearch] = useState("the fault in our stars");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { data: message } = useSWR(
    [selectedBook?.title, selectedBook?.authors[0], selectedBook?.thumbnail],
    addBook
  );

  useEffect(() => {
    if (message && message !== "") {
      document.querySelector(".toast")?.classList.add("show");
      setTimeout(() => {
        document.querySelector(".toast")?.classList.remove("show");
      }, 2000);
    }
  }, [message]);

  let toastClass;
  if (message === "Error!") {
    toastClass = "error";
  } else if (message === "This book already exists in Notion!") {
    toastClass = "warning";
  } else {
    toastClass = "success";
  }

  return (
    <>
      <h2>Books</h2>
      <input
        placeholder="Search for a book"
        value={bookSearch}
        onChange={async (e) => {
          setBookSearch(e.target.value);
          if (e.target.value.length > 0) {
            const results = await searchBooks(e.target.value);
            setBookResults(results);
          }
        }}
      />
      {bookResults.length > 0 && (
        <div className="search-suggestions">
          {bookResults.map((book) => {
            const {
              id,
              volumeInfo: { title, authors, imageLinks },
            } = book;
            const thumbnail = imageLinks
              ? imageLinks.thumbnail
                  .replace("http://", "https://")
                  .replace("&edge=curl", "")
              : null;
            return (
              <button
                className="book-result"
                type="button"
                key={id}
                onClick={() => {
                  setSelectedBook({
                    title,
                    authors,
                    thumbnail: thumbnail?.replace("&zoom=1", ""),
                  });
                }}
              >
                {thumbnail && (
                  <Image
                    src={thumbnail}
                    alt={`${title} cover`}
                    width={100}
                    height={180}
                  />
                )}
                <div className="title-author">
                  <p className="title">{title}</p>
                  {authors && <p className="author">{authors.join(", ")}</p>}
                </div>
              </button>
            );
          })}
        </div>
      )}
      <p className={`toast ${toastClass}`}>{message}</p>
    </>
  );
}
