import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Home/Home.scss';

const Home = ({ setUser, setLogin }) => {
  const navigate = useNavigate();
  const value = localStorage.getItem('Auth');
  
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredBooks, setFilteredBooks] = useState([]); 

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  useEffect(() => {
    getUser();
    getBook();
  }, []);

  const getUser = async () => {
    if (value) {
      try {
        const res = await axios.get("http://localhost:3000/api/home", { 
          headers: { "Authorization": `Bearer ${value}` } 
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

  const getBook = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/getbooks");
      if (res.status === 201) {
        setBooks(res.data);
        setFilteredBooks(res.data);
      }
    } catch (error) {
      alert("Error fetching books");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterBooks = () => {
    const query = searchQuery.toLowerCase();
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
    setCurrentPage(1); 
  };

  useEffect(() => {
    filterBooks();
  }, [searchQuery]);

  // Pagination Logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  return (
    <div className="home">
      <header className="home__header">
        <h1>Welcome to the Library</h1>
        <p>Explore our collection of books</p>
        <div className="home__search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by title or author..."
          />
        </div>
      </header>
      
      <div className="home__mains">
        {currentBooks.length > 0 ? (
          currentBooks.map((book, index) => (
            <Link key={index} to={`/bookdetails/${book._id}`}>
              <div className="book-card">
                <div className="book-card__cover">
                  <img src={book.cover} alt={book.title} />
                </div>
                <div className="book-card__details">
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Copies:</strong> {book.copies}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="home__no-books">No books available</p>
        )}
      </div>

      {/* Pagination Buttons */}
      <div className="pagination">
        <button 
          className="pagination__btn" 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span className="pagination__info">Page {currentPage} of {Math.ceil(filteredBooks.length / booksPerPage)}</span>
        <button 
          className="pagination__btn" 
          disabled={indexOfLastBook >= filteredBooks.length} 
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
