<?php
$outputString = ''; 
foreach ($_POST as $key=>$value){
	$outputString .= $key.'=';
	foreach ($value as $key2=>$value2){
		$outputString .= $value2.'&';
	};
	if($outputString[-1] == '&')
	{
		$outputString = substr($outputString, 0, -1);
	}
	$outputString .= "\n";
};
if($outputString[-1] == "\n")
{
	$outputString = substr($outputString, 0, -1);
}
file_put_contents('filters.txt', $outputString);
?>