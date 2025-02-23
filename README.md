

# **TaskBoard-API**  
**API for managing company tasks with workspaces, boards, and cards, allowing admins to assign and track employee tasks efficiently.**  

## **Features** 
 - Create and manage workspaces   
 -  Organize tasks into boards   
 - Assign and track task progress using cards   
 -  User authentication & role-based access   
 -  RESTful API with JWT authentication   

## **Tech Stack**  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Authentication:** JWT  
- **Other:** Mongoose, bcrypt, dotenv  

## **Installation** 
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/TaskBoard-API.git

# Navigate into the project folder
cd TaskBoard-API

# Install dependencies
npm install

# Create a .env file and add necessary environment variables (see below)

# Start the server
npm start   # (Using node)
 # OR
npm run dev   # (Using nodemon "preferred")
```

## **Environment Variables**
### Create an `.env` file and add the following values:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET=your_secret_key
```

## **API Endpoints**
### **Auth**  
- `POST /api/auth/signup` → Register a new user  
- `POST /api/auth/login` → Login and get a token

### **User**
- `PATCH /api/user/update` → Update the username

### **Workspaces**  
- `POST /api/workspaces` → Create a new workspace (Only admin)  
- `GET /api/workspaces` → Get all workspaces  
- `GET /api/workspaces/:title` → Get a single workspace by title (Only admin)  
- `DELETE /api/workspaces/:id` → Delete a workspace using id (Only admin)  
- `PATCH /api/workspaces` → Update a workspace (Only admin)
- `PATCH /api/workspaces/assign-user` → Assign a user to a workspace (Only admin)

### **Boards**  
- `POST /api/workspace/:workspace_id/boards` → Create & add a board to a workspace (Only admin)  
- `GET /api/workspace` → Get all boards in a workspace   
- `DELETE /api/workspace/:title` → Delete a board using title (Only admin)
- `PATCH /api/workspace/:title` → update a board using using title (Only admin)

### **Cards (Tasks)**  
- `POST /api/boards` → Add a task card to a board (Only admin)  
- `GET /api/boards` → Get all task cards in a board  
- `Delete /api/boards/:_id` → Delete a task card in a board using id (Only admin)  
- `PATCH /api/boards/:_id` → Update a task card in a board using id (Only admin)  

## **License**
Copyright (c) 2025 [Mahdi Manoun]

This software is provided for evaluation purposes only.  
Commercial use, redistribution, modification, or reproduction without explicit permission is strictly prohibited.  
