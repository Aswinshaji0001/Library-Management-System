import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Borrowed/Borrowed.scss';

const Borrowed = ({ setUser, setLogin }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const value = localStorage.getItem("Auth");

  useEffect(() => {
    fetchBorrowedBooks();
    getUser();
  }, []);

  const getUser = async () => {
    if (value) {
      try {
        const res = await axios.get("http://localhost:3000/api/home", {
          headers: { "Authorization": `Bearer ${value}` },
        });
        if (res.status === 200) {
          setUser(res.data.username);
          setLogin(res.data.accounttype);
        } else {
          alert("Login failed");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/borrowedBooks', {
        headers: { Authorization: `Bearer ${value}` },
      });
      if (res.status === 201) {
        setBorrowedBooks(res.data.borrowed); // Assume the backend sends a list of borrowed books
      }
    } catch (error) {
      console.error("Error fetching borrowed books", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      const res = await axios.post(`http://localhost:3000/api/returnBook/${bookId}`, {}, {
        headers: { Authorization: `Bearer ${value}` },
      });
      if (res.status === 200) {
        alert('Book returned successfully');
        fetchBorrowedBooks(); 
      }
    } catch (error) {
      alert('Error returning the book');
    }
  };

  return (
    <div className="borrowed-books">
      <h1>Borrowed Books</h1>
      {loading ? (
        <p>Loading borrowed books...</p>
      ) : (
        <div className="borrowed-books-list">
          {borrowedBooks.length > 0 ? (
            borrowedBooks.map((book) => (
              <div className="borrowed-book" key={book._id}>
                <div className="book-details">
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Date: {book.date} <br></br>Should be returned within 14 days</strong> </p>
                </div>
                <button
                  className="return-btn"
                  onClick={() => handleReturnBook(book._id)}
                >
                  Return
                </button>
              </div>
            ))
          ) : (
            <p>No borrowed books</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Borrowed;
