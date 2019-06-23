<?php
$outputString = ''; 
foreach ($_POST as $key=>$value){
	$outputString .= $value;
};
file_put_contents('choosenFlight.txt', $outputString);
?>