import LoginSchema from './models/Login.model.js'
import bookSchema from './models/Book.model.js'
import borrowSchema from './models/Borrow.model.js'
import UserSchema from './models/User.model.js'
import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
import nodemailer from "nodemailer";
const { sign } = pkg;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "aswinshaji0001@gmail.com",
      pass: "qauv folf fqwa lajb",
    },
  });
  
  export async function signUp(req, res) {
    try {
      const { email, username, password, cpassword,accounttype } = req.body;
      console.log(req.body);
      if (!(email && username && password && cpassword && accounttype))
        return res.status(404).send({ msg: "Fields are empty" });
      if (password != cpassword)
        return res.status(404).send({ msg: "Password mismatching" });
      bcrypt.hash(password, 10).then((hashedPassword) => {
        console.log(hashedPassword);
        LoginSchema
          .create({ email, username, password: hashedPassword,accounttype})
          .then(async () => {
            console.log("Success");
            return res.status(201).send({ msg: "Suceess" });
          })
          .catch((error) => {
            console.log(error);
            return res.status(404).send({ msg: "Not registered" });
          });
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  export async function signIn(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ msg: "Fields are empty" });
      }
      const user = await LoginSchema.findOne({ email });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ msg: "Email or Password mismatch" });
      }
      const token = await sign({ userId: user._id }, process.env.JWT_KEY,{expiresIn: "24h"});
      return res.status(200).json({ msg: "Successfully logged in", token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  }
  export async function verifyMail(req, res) {
    try {
      const { email } = req.body;
      console.log(req.body);
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: `${email}`, // list of receivers
        subject: "OTP", // Subject line
        text: "your otp", // plain text body
        html: `<!DOCTYPE html>
              <html lang="en">
              <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Verification</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  text-align: center;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  font-size: 24px;
                  color: #333333;
                }
                p {
                  font-size: 16px;
                  color: #555555;
                }
                .button {
                  display: inline-block;
                  background-color: #4CAF50;
                  color: white;
                  padding: 15px 30px;
                  text-decoration: none;
                  font-size: 18px;
                  border-radius: 4px;
                  margin-top: 20px;
                  text-transform: uppercase;
                }
              </style>verifyMail
              </head>
              <body>
              <div class="container">
                <h1>Email Verification</h1>
                <p>Click the button below to verify your email address:</p>
                
                <a href="http://localhost:5173/signup" class="button">Verify Email</a>
              </div>
              </body>
              </html>
    `, // html body
      });
  
      console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  
      return res
        .status(201)
        .send({ msg: "confirmation mail set success", email });
    } catch (error) {
      return res.status(404).send({ msg: "error" });
    }
  }

  export async function Home(req,res) {
    try{
        const _id = req.user.userId;
        const user = await LoginSchema.findOne({_id})
        if(!(user))
          return res.status(404).send({msg:"Unauthorized user"})
        return res.status(200).send({username:user.username,accounttype:user.accounttype})
    }
    catch(error){
      return res.status(404).send({msg:"error"})
    }
  }
  
  export async function addBook(req,res) {
    try {
        const { title, isbn, author, year, copies,cover } = req.body;
        console.log(cover);
        const data = await bookSchema.create({title,isbn,author,year,copies,cover})
        return res.status(201).send(data)
    } catch (error) {
        return res.status(404).send({msg:"error"})

    } 
  }

  export async function getBooks(req,res) {
    try {
            const books = await bookSchema.find();
            return res.status(201).send(books)
    } catch (error) {
        return res.status(404).send({msg:"error"})

    }
    
  }

  export async function getBook(req,res) {
    try {
            const {id} = req.params;
            const book = await bookSchema.findOne({_id:id})
            return res.status(200).send(book)
    } catch (error) {
        return res.status(404).send({msg:"error"})

    }
    
  }

  export async function editBook(req,res) {
    try {
            const {id} =req.params;
            const { title, isbn, author, year, copies,cover } = req.body;
            const book = await bookSchema.updateOne({_id:id},{$set:{title,isbn,author,year,copies,cover}})
            return res.status(201).send(book)
    } catch (error) {
        return res.status(404).send({msg:"error"})

    }
    
  }

  export async function deleteBook(req,res) {
    try {
        const {id} = req.params;
        const book = await bookSchema.deleteOne({_id:id})
        return res.status(201).send(book)
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }    
  }

  
  export async function borrowBook(req, res) {
      try {
          const { id } = req.params; 
          const uid = req.user.userId;          
          const { ...books } = req.body;
          

          const book = await bookSchema.findById(id);
  
          if (!book) {
              return res.status(404).send({ msg: "Book not found" });
          }
  
          if (book.copies <= 0) {
              return res.status(400).send({ msg: "No copies available" });
          }
  
          book.copies -= 1;
          await book.save();
          const borrowed = await borrowSchema.create({...books,userId:uid,_id:id})
          return res.status(201).send({ msg: "Book borrowed successfully", book });
  
      } catch (error) {
          console.error(error);
          return res.status(500).send({ msg: "Error borrowing book" });
      }
  }

  export async function borrowedBooks(req,res) {
    try {
        const _id =req.user.userId;
        const borrowed = await borrowSchema.find({userId:_id})
        return res.status(201).send({borrowed});
    } catch (error) {
        return res.status(400).send({ msg: "error" });

    }
    

  }
  
  export async function returnBook(req, res) {
    try {
        const { bookId } = req.params;
        const uid = req.user.userId;
        const returnb = await borrowSchema.deleteOne({ _id: bookId, userId: uid });
        if (returnb.deletedCount === 0) {
            return res.status(404).send({ msg: "No borrow record found for this book" });
        }
        const book = await bookSchema.findById(bookId);
        if (!book) {
            return res.status(404).send({ msg: "Book not found" });
        }
        book.copies += 1;
        await book.save();
        res.status(200).send({ msg: "Book returned and copies incremented successfully" });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: "Error returning the book" });
    }
}

export async function getProfile(req,res) {
    try {
        const uid = req.user.userId;
        const data = await LoginSchema.findOne({_id:uid})
        return res.status(201).send(data)
    } catch (error) {
        return res.status(400).send({ msg: "Error returning the book" });
    }
    
}

export async function editProfile(req, res) {
    try {
        const uid = req.user.userId;
        const { ...user } = req.body;

        const existingUser = await UserSchema.findOne({ userId: uid });

        if (existingUser) {

            const updatedUser = await UserSchema.findOneAndUpdate(
                { userId: uid },
                { ...user },
                { new: true }
            );
            return res.status(200).send(updatedUser);
        } else {
            const newUser = await UserSchema.create({ ...user, userId: uid });
            return res.status(201).send(newUser);
        }
    } catch (error) {
        console.error("Error editing profile:", error);
        return res.status(400).send({ msg: "Error editing profile" });
    }
}


export async function getUser(req,res) {
    try {
         const uid = req.user.userId;
         const data = await UserSchema.findOne({userId:uid})
         return res.status(201).send(data)

    } catch (error) {
        return res.status(400).send({ msg: "Error" });

    }
    
}
