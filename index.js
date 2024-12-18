const fs = require('fs');
const nodemailer = require('nodemailer');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify');
require('dotenv').config();

const loadUsers = (filePath) => {
  return new Promise((resolve, reject) => {
    const users = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        data.bouncedCount = parseInt(data.bouncedCount || '0', 10);
        users.push(data);
      })
      .on('end', () => resolve(users))
      .on('error', (err) => reject(err));
  });
};

const saveUsers = (filePath, users) => {
  return new Promise((resolve, reject) => {
    stringify(users, { header: true }, (err, output) => {
      if (err) return reject(err);
      fs.writeFile(filePath, output, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
};

const loadTemplate = (filePath) => {
  return fs.readFileSync(filePath, 'utf-8');
};

let emailSendingDisabledLogged = false;

const sendEmail = async (transporter, email, subject, body) => {

  if (process.env.SEND_EMAILS !== 'true') {
    if (!emailSendingDisabledLogged) {
      console.log('Email sending is disabled on this environment.');
      emailSendingDisabledLogged = true;
    }
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"Lalit" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html: body,
    });
    return true; // Email sent successfully
  } catch (error) {
    if (error.code === 'EENVELOPE') {
      console.log(`Email bounce detected for: ${email}`);
    }
    return false; // Email failed
  }
};

const sendBulkEmails = async () => {
  try {
    const users = await loadUsers('./src/users.csv');
    const emailTemplate = loadTemplate('./src/email-template.html');

    let validUsers = users.filter(user => user.email && user.email.includes('@'));
    const invalidUsers = users.filter(user => !user.email || !user.email.includes('@'));

    validUsers = validUsers.filter(user => user.bouncedCount < 3);

    // Save the valid users back to the CSV file
    await saveUsers('./src/users.csv', validUsers);
    console.log('Updated users.csv with valid emails only.');

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send emails to valid users
    for (const user of validUsers) {

      const userName = user.name ? user.name : 'BulkMailer User';
      const customizedTemplate = emailTemplate.replace('{{name}}', userName);
      const isSuccess = await sendEmail(transporter, user.email, 'Regarding BulkMailer', customizedTemplate);

      if (isSuccess) {
        console.log(`Email sent to ${user.email}`);
      } else {
        if (process.env.SEND_EMAILS === 'true') {
          console.log(`Failed to send email to ${user.email}. Incrementing bounce count.`);
          user.bouncedCount++;
        }
      }
    }

    // Save the updated bounced counts back to the CSV
    await saveUsers('./src/users.csv', validUsers);
    if (invalidUsers.length > 0) {
      console.log('Removed the following users with invalid email addresses:');
      invalidUsers.forEach(user => console.log(`- ${user.name || 'Unknown'}: ${user.email}`));
    }

  } catch (error) {
    console.error('Error sending emails:', error);
  }
};

// Trigger email sending
sendBulkEmails();
