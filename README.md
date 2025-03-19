# 🏆 Chicken vs Hotdog Discount Game

This is the backend for the Chicken vs Hotdog Discount Game built with Django.

---

## **📌 How to Run the Project**

### **1️⃣ Clone the Repository**
```bash
git clone <your-repo-url>
cd <your-project-folder>
```

### **2️⃣ Create and Activate Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

### **3️⃣ Install Dependencies**
```bash
pip install -r requirements.txt
```

### **4️⃣ Apply Database Migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

### **5️⃣ Create Superuser (For Admin Panel)**
```bash
python manage.py createsuperuser
```

### **6️⃣ Collect Static Files**
```bash
python manage.py collectstatic
```

### **7️⃣ Run the Server**
```bash
python manage.py runserver
```

Now, visit http://127.0.0.1:8000/ to access the game!
