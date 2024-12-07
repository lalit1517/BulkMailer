# BulkMailer

This project is an open-source backend for sending bulk emails using **Node.js** and **Nodemailer**. It validates user emails, customizes email templates, tracks bounced emails, and filters invalid entries from a CSV file.

---

## **Features**

- Load user data and email templates from files.
- Validate email addresses and filter invalid/bounced emails.
- Send bulk emails using customizable templates.
- Automatically update bounced counts in the CSV file.

---

## **Getting Started**

### **1. Clone the Repository**

```bash
git clone https://github.com/your-username/bulk-emailing-backend.git
cd bulk-emailing-backend
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Set Up Environment Variables**

```bash
# SMTP server details
SMTP_HOST=smtp.example.com       # Replace with your SMTP server
SMTP_PORT=465                    # Commonly used SMTP port (for TLS)
SMTP_USER=your-email@example.com # Your SMTP username or email
SMTP_PASS=your-password          # Your SMTP password

# Email sending configuration
SEND_EMAILS=true                 # Set to 'true' to enable email sending
```

### **4. CSV File Structure**

```csv
name,email,bouncedCount
John Doe,john.doe@example.com,0
Jane Doe,jane.doe@example.com,0
```

### **5. Email Template**

Create an email-template.html file in the src directory. Use {{name}} as a placeholder for user-specific names.

### **6. Run the Project Locally**

To start the bulk email sender:

```bash
node index.js
```

---
