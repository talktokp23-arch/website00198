<?php
// Contact form handler for Perfect Chess Academy
header('Content-Type: application/json');

// Check if form was submitted via POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Configuration
$to_email = 'vanshchaturvedi713@gmail.com';
$subject_prefix = '[Perfect Chess Academy] Contact Form';

// Sanitize and validate input data
function sanitize_input($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Get form data
$name = sanitize_input($_POST['name'] ?? '');
$email = sanitize_input($_POST['email'] ?? '');
$phone = sanitize_input($_POST['phone'] ?? '');
$age = sanitize_input($_POST['age'] ?? '');
$interest = sanitize_input($_POST['interest'] ?? '');
$experience = sanitize_input($_POST['experience'] ?? '');
$message = sanitize_input($_POST['message'] ?? '');

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!validate_email($email)) {
    $errors[] = 'Invalid email format';
}

if (empty($interest)) {
    $errors[] = 'Interest selection is required';
}

if (empty($message)) {
    $errors[] = 'Message is required';
}

// Basic spam protection
$spam_keywords = ['casino', 'lottery', 'viagra', 'loan', 'bitcoin', 'crypto'];
$message_lower = strtolower($message);
foreach ($spam_keywords as $keyword) {
    if (strpos($message_lower, $keyword) !== false) {
        $errors[] = 'Message contains inappropriate content';
        break;
    }
}

// If there are validation errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Prepare email content
$email_subject = $subject_prefix . ' - New Inquiry from ' . $name;

$email_body = "New contact form submission from Perfect Chess Academy website\n\n";
$email_body .= "Name: " . $name . "\n";
$email_body .= "Email: " . $email . "\n";
$email_body .= "Phone: " . ($phone ?: 'Not provided') . "\n";
$email_body .= "Age: " . ($age ?: 'Not provided') . "\n";
$email_body .= "Interest: " . $interest . "\n";
$email_body .= "Experience Level: " . ($experience ?: 'Not specified') . "\n";
$email_body .= "Message:\n" . $message . "\n\n";
$email_body .= "Submitted on: " . date('Y-m-d H:i:s') . "\n";
$email_body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Email headers
$headers = "From: noreply@perfectchessacademy.com\r\n"; // Updated with your domain
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mail_sent = mail($to_email, $email_subject, $email_body, $headers);

if ($mail_sent) {
    // Log successful submission (optional)
    $log_entry = date('Y-m-d H:i:s') . " - Contact form submitted by: $name ($email)\n";
    // Ensure the log file is writable by the web server
    if (file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX) === false) {
        error_log("Failed to write to contact_log.txt for: $name ($email)");
    }
    
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you for your message! We will get back to you within 24 hours.'
    ]);
} else {
    $error_message = error_get_last()['message'] ?? 'Unknown mail error';
    error_log("Failed to send contact form email for: $name ($email). Error: " . $error_message);
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Sorry, there was an error sending your message. Please try again or contact us directly.'
    ]);
}
?>
