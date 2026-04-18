<?php
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$password = $data['password'];

if ($username === 'admin' && $password === 'MIP2026secure!') {
    echo json_encode(['success' => true, 'token' => bin2hex(random_bytes(16))]);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}
?>
