### blurbGallery: jQuery gallery w/ info section that is managed using a JSON file.
====

blurbGallery dynamically generates a image gallery based on a JSON file that categorizes items. The gallery displays the title, category, info, and other items in the category. The plugin includes other options and features such as a pagination system, HTML5 support, etc.


### Release info:

The current release is version 1.0. This is the inital release and more features and updates are planned.


### Examples:
----

Basic blurbGallery usuage on an empty element, the plugin will do the rest.

	$('#element').blurbGallery();

Add a JavaScript object to achieve additional functionality, some options are nested in objects.

	$('#element').blurbGallery({
		html5: false,
		pages: {
			per: 8
		},
		speed: 1000
	});


### Options:
----

Here is a brief rundown of all the different options.

**ajax**: Accepts object, controls Ajax config settings, for more information consult the jQuery API.

	$('#element').blurbGallery({
		ajax: {
			cache: false,
			dataType: 'json',
			dataUrl: 'json/jquery.blurbGallery.json'
		}
	});

**callback**: Accepts a function, runs a function after the gallery has initally load, and additionally when the main image is loaded.

	$('#element').blurbGallery({
		callback: function(){
			alert('blurbGallery has loaded!')
		}
	});

**cssSelectors**: Accepts a object, holds all of the CSS selector names. Allows you to change the name of the classes for the gallery.

	$('#element').blurbGallery({
		cssSelectors: {
			gallery: 'custom-class-gallery'
		}
	});

List of renameable CSS selectors with their default values:

	- activePage: 'bg-active-page'
	- activeThumb: 'bg-active-thumb'
	- category: 'bg-category'
	- description: 'bg-description'
	- enlarge: 'bg-enlarge'
	- gallery: 'bg-gallery'
	- img: 'bg-img'
	- imgCtn: 'bg-img-ctn'
	- info: 'bg-info'
	- loading: 'bg-loading'
	- loadingImg: 'bg-loading-img'
	- nextLink: 'bg-next-link'
	- pageLink: 'bg-page-link'
	- pages: 'bg-page-navigation'
	- previousLink: 'bg-previous-link'
	- selectMenu: 'bg-select-menu'
	- selectNav: 'bg-select-nav'
	- thumbs: 'bg-thumbs'
	- title: 'bg-title'
	- wrapper: 'bg-wrapper'

**html5**: Accepts a boolean value, true creates articles/sections/nav elements, alternatively false creates divs, defaults to true.

	$('#element').blurbGallery({
		html5: true
	});

**loading**: Accepts a string, contains the relative path to the loading image.

	$('#element').blurbGallery({
		loading: 'img/bg-loading.gif'
	});

**pages**: Accepts a object, contains options for the pagination system, show controls if pages are used altogether, per controls how many items per page.

	$('#element').blurbGallery({
		pages: {
			show: true,
			per: 3
		}
	});

**path**: Accepts a object, holds all of the paths for images. If full/thumb is set to false, it falls back to root path.

	$('#element').blurbGallery({
		path: {
			full: false,
			root: 'img/',
			thumbs: 'img/thumbs/'
		}
	});

List of editable paths:

	- full: false,
	- root: 'img/'
	- thumbs: 'img/thumbs/'

**selected**: Accepts a object, contains the starting category and item loaded on the inital load of the gallery. Defaults to false.

	$('#element').blurbGallery({
		selected: {
			cat: false,
			item: false
		}
	});

**speed**: Accepts an object, controls the speed of the fade and load transitions in milliseconds.

	$('#element').blurbGallery({
		load: 300,
		transition: 150
	});

### Build Contents:
----
Initial build contains source code in both uncompressed and minified versions. Additionally, a CSS, image, JavaScript, and JSON folder that contains examples and reccommended default settings.


### Requests and future expansion:
----
All feedback and updates can be found on the blurbGallery GitHub page:

https://github.com/carlthenimrod/blurbGallery