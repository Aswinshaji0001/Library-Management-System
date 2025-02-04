import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../AddBook/AddBook.scss';

const EditBook = ({ setUser, setLogin }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const value = localStorage.getItem('Auth');
    const [book,setBook] = useState([])
    const [cover, setCover] = useState(null);
    const [data, setData] = useState({
        title: "",
        isbn: "",
        author: "",
        year: "",
        copies: "",
        cover: ""
    });

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
            const res = await axios.get(`http://localhost:3000/api/getbook/${id}`);
            if (res.status === 200) { 
                setData(res.data); // Set the book details in the state
                setCover(res.data.cover); // Set existing cover
            }
        } catch (error) {
            alert("Failed to fetch book details.");
        }
    };

    const handleChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64Cover = await convertToBase64(file);
            setCover(base64Cover);
        }
    };

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `http://localhost:3000/api/editbook/${id}`,
                { ...data, cover },
                { headers: { "Content-Type": "application/json" } }
            );
            if (res.status === 201) {
                alert("Book updated successfully!");
                navigate("/admin"); // Redirect to admin panel
            } else {
                alert(res.data.msg);
            }
        } catch (error) {
            alert("Failed to update book.");
        }
    };
console.log(data);

    return (
        <div className="addbook">
            <div className="card">
                <h2>Edit Book</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" placeholder="Title" value={data.title} onChange={handleChange} required />
                    <input type="text" name="isbn" placeholder="ISBN" value={data.isbn} onChange={handleChange} required />
                    <input type="file" name="cover" accept="image/*" onChange={handleFile} />
                    
                    {cover && (
                        <div className="cover-preview">
                            <img src={cover} alt="Book Cover Preview" />
                        </div>
                    )}

                    <input type="text" name="author" placeholder="Author" value={data.author} onChange={handleChange} required />
                    <input type="number" name="year" placeholder="Published Year" value={data.year} onChange={handleChange} />
                    <input type="number" name="copies" placeholder="Available Copies" value={data.copies} onChange={handleChange} min="1" />
                    <button type="submit">Update Book</button>
                </form>
            </div>
        </div>
    );
};

export default EditBook;
