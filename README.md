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
git clone https://github.com/lalit1517/BulkMailer.git
cd BulkMailer
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

The CSV file should have the following structure, where you can include additional fields for each user. These fields can be used dynamically in the email template:

```csv
name,email,bouncedCount,customField1,customField2
John Doe,john.doe@example.com,0,Welcome to our platform,Special discount just for you
Jane Doe,jane.doe@example.com,0,Thank you for joining,Your first order is free
```

### **5. Email Template**

In email-template.html file in the src directory, you can include placeholders like {{name}}, {{customField1}}, and {{customField2}} to dynamically insert user-specific data:

### **6. Run the Project Locally**

To start the bulk email sender:

```bash
node index.js
```

---