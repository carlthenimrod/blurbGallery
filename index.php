<!doctype html>
<html>
<head>
	<meta charset="utf-8"/>
	<title></title>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" type="text/javascript"></script>
	<script src="js/jquery.blurbGallery.js" type="text/javascript"></script>
	<script src="js/example.js" type="text/javascript"></script>

	<link href="css/jquery.blurbGallery.css" rel="stylesheet" />
</head>
<body>
	<div id="element"></div> <!-- #elment -->

	<input type="hidden" id="bg-selected-cat" value="<?php if ( isset($_GET['cat']) ) echo $_GET['cat']; ?>" /> <!-- #bg-selected-cat -->
</body>
</html>