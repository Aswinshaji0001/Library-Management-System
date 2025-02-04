import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../Admin/Admin.scss';

const Admin = ({ setUser, setLogin }) => {
    const navigate = useNavigate();
    const value = localStorage.getItem('Auth');
    const [books, setBooks] = useState([]);

    useEffect(() => {
        getUser();
        getBook();
    }, []);

    const getUser = async () => {
        if (value) {
            try {
                const res = await axios.get("http://localhost:3000/api/home", { headers: { "Authorization": `Bearer ${value}` } });
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
            }
        } catch (error) {
            alert("Error fetching books");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                await axios.delete(`http://localhost:3000/api/deletebook/${id}`);
                setBooks(books.filter(book => book._id !== id));
            } catch (error) {
                alert("Error deleting book");
            }
        }
    };

    return (
        <div className="admin-panel">
            <div className="header">
                <h1>Admin Panel - Manage Books</h1>
                <Link to="/addbook"><button className="add-btn">+ Add Book</button></Link>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Cover</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Year</th>
                            <th>Copies</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.length > 0 ? (
                            books.map((book) => (
                                <tr key={book._id}>
                                    <td><img src={book.cover} alt={book.title} className="cover-img" /></td>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.year}</td>
                                    <td>{book.copies}</td>
                                    <td>
                                        <Link to={`/editbook/${book._id}`}><button className="edit-btn">Edit</button></Link>
                                        <button className="delete-btn" onClick={() => handleDelete(book._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-books">No books available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;
