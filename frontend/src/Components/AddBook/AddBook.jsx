import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../AddBook/AddBook.scss';

const AddBook = ({ setUser, setLogin }) => {
    const navigate = useNavigate();
    const value = localStorage.getItem('Auth');
    const [cover, setCover] = useState(null);
    const [data, setData] = useState({
        title: "",
        isbn: "",
        author: "",
        year: "",
        copies: ""
    });

    useEffect(() => {
        getUser();
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

    const handleChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3000/api/addbook", { ...data, cover }, { headers: { "Content-Type": "application/json" } });
            console.log(res);
            if (res.status === 201) {
                alert("Book added successfully!");
                setData({ title: "", isbn: "", author: "", year: "", copies: "" });
                setCover(null);
            } else {
                alert(res.data.msg);
            }
        } catch (error) {
            console.error("Error adding book:", error);
            alert("Failed to add book.");
        }
    };

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const cover = await convertToBase64(file);
            setCover(cover);
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

    return (
        <div className="addbook">
            <div className="card">
                <h2>Add a New Book</h2>
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
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddBook;
