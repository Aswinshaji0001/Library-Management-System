### **How to Run the Code**  

1. **Clone the Project**  
   - Use the command:  
     ```sh
     git clone <repository-url>
     ```  

2. **Project Structure**  
   - The project is divided into two main directories:  
     - **Frontend** (User Interface)  
     - **Backend** (Server & Database Logic)  

3. **Running the Application**  
   - Open **VS Code** and split the terminal into two sections:  

   **Frontend:**  
   - Run the following command:  
     ```sh
     npm run dev
     ```  
   - If you encounter an error stating that **Vite is not recognized**, install the necessary dependencies using:  
     ```sh
     npm i
     ```  

   **Backend:**  
   - Start the server with:  
     ```sh
     nodemon app
     ```  
   - If you encounter a **bcrypt-related error**, resolve it by running:  
     ```sh
     npm uninstall bcrypt  
     npm i bcrypt  
     ```  

4. **Using the Application**  
   - Once the setup is complete, the application should be running successfully.  
   - On the homepage, users can **sign up** and choose between two roles:  
     - **Admin:** Has permissions to **add, delete, and edit books**.  
     - **User:** Can **borrow and return books**.  

This guide ensures a smooth setup and usage experience. 🚀
