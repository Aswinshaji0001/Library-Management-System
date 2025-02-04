import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookDetails.scss";

const BookDetails = ({ setUser, setLogin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const value = localStorage.getItem("Auth");

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
    fetchBookDetails();
  }, []);

  const getUser = async () => {
    if (!value) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get("http://localhost:3000/api/home", {
        headers: { Authorization: `Bearer ${value}` },
      });
      if (res.status === 200) {
        setUser(res.data.username);
        setLogin(res.data.accounttype);
      } else {
        alert("Login failed");
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
    }
  };

  const fetchBookDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/getbook/${id}`);
      if (res.status === 200) {
        setBook(res.data);
      } else {
        alert("Failed to fetch book details.");
        navigate("/");
      }
    } catch (error) {
      alert("Error fetching book details.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (book.copies <= 0) return;
    const currentDate = new Date();
    const [date, time] = currentDate.toLocaleString().split(", ");

    try {
      const res = await axios.post(
        `http://localhost:3000/api/borrowbook/${id}`,
        { title: book.title, author: book.author, date: date },
        {
          headers: { Authorization: `Bearer ${value}` },
        }
      );
      if (res.status === 201) {
        alert("Book borrowed successfully!");
        fetchBookDetails();
      } else {
        alert(res.data.msg);
      }
    } catch (error) {
      alert("Error borrowing book.");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="book-detailsdd">
      {book ? (
        <div className="book-cardsdd">
          <img src={book.cover} alt={book.title} className="book-coverdd" />
          <div className="book-infodd">
            <h2>{book.title}</h2>
            <p>
              <strong>Author:</strong> {book.author}
            </p>
            <p>
              <strong>ISBN:</strong> {book.isbn}
            </p>
            <p>
              <strong>Published Year:</strong> {book.year}
            </p>
            <p>
              <strong>Available Copies:</strong> {book.copies}
            </p>
            <button
              className="borrow-btn"
              onClick={handleBorrow}
              disabled={book.copies <= 0}
            >
              {book.copies > 0 ? "Borrow" : "Out of Stock"}
            </button>
          </div>
        </div>
      ) : (
        <p>Book not found.</p>
      )}
    </div>
  );
};

export default BookDetails;
