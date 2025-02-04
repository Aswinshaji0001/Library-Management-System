import { Router } from "express";
import * as u from './requestHandler.js'
import Auth from './middleware/Auth.js'
const router=Router();

router.route("/signin").post(u.signIn);
router.route("/signup").post(u.signUp);
router.route("/verify").post(u.verifyMail);
router.route("/home").get(Auth,u.Home);
router.route("/addbook").post(u.addBook);
router.route("/getbooks").get(u.getBooks);
router.route("/edituser").post(Auth,u.editProfile);
router.route("/getuser").get(Auth,u.getUser);
router.route("/getbook/:id").get(u.getBook);
router.route("/editbook/:id").put(u.editBook);
router.route("/deletebook/:id").delete(u.deleteBook);
router.route("/borrowbook/:id").post(Auth,u.borrowBook);
router.route("/borrowedbooks").get(Auth,u.borrowedBooks);
router.route("/returnbook/:bookId").post(Auth,u.returnBook);
export default router;