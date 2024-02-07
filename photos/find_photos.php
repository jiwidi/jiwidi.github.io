<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Assuming $directory is correctly defined and accessible
$directory = "images/fullsize/"; // Adjust the path
if (is_dir($directory)) {
    $images = array_diff(scandir($directory), array('..', '.'));
    header('Content-Type: application/json');
    echo json_encode(array_values($images));
} else {
    header('Content-Type: application/json');
    echo json_encode(["error" => "Directory not found"]);
}
?>
