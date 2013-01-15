### blurbGallery: jQuery gallery w/ info section that is managed using a JSON file.
====

blurbGallery dynamically generates a image gallery based on a JSON file that categorizes items. The gallery displays the title, category, info, and other items in the category. The plugin includes other options and features such as a pagination system, HTML5 support, etc.


### Release info:

The current release is version 1.05. This is the inital release and more features and updates are planned.


### Examples:
----

Basic blurbGallery usuage on an empty element, the plugin will do the rest.

	$('#element').blurbGallery();

Add a JavaScript object to achieve additional functionality.

	$('#element').blurbGallery({
		html5: false,
		speed: 1000
	});


### Options:
----

Here is a brief rundown of all the different options.

**ajaxCache**: Accepts a boolean, controls whether to cache the Ajax request, for more information consult the jQuery API.

	$('#element').blurbGallery({
		ajaxCache: false
	});

**ajaxDataType**: Accepts a string, controls the data type to be used by the Ajax request, for more information consult the jQuery API.

	$('#element').blurbGallery({
		ajaxDataType: 'json'
	});

**ajaxDataUrl**: Accepts a string, holds location of file to be used, for more information consult the jQuery API.

	$('#element').blurbGallery({
		ajaxDataUrl: 'json/jquery.single.json'
	});	

**callback**: Accepts a function, runs a function after the gallery has initally load, and additionally when the main image is loaded.

	$('#element').blurbGallery({
		callback: function(){
			alert('blurbGallery has loaded!')
		}
	});

**class Options**: Accepts a string, holds CSS class names. Allows you to change the name of the classes.

	$('#element').blurbGallery({
		classActivePage: 'bg-active-page',
		classActiveThumb: 'bg-active-thumb',
		classCategory: 'bg-category',
		classDescription: 'bg-description',
		classEnlarge: 'bg-enlarge',
		classGallery: 'bg-gallery',
		classImg: 'bg-img',
		classImgCtn: 'bg-img-ctn',
		classInfo: 'bg-info',
		classLoading: 'bg-loading',
		classLoadingImg: 'bg-loading-img',
		classMoreLink: 'bg-more-link',
		classNextLink: 'bg-next-link',
		classPageLink: 'bg-page-link',
		classPages: 'bg-page-navigation',
		classPreviousLink: 'bg-previous-link',
		classSelectMenu: 'bg-select-menu',
		classSelectNav: 'bg-select-nav',
		classThumbs: 'bg-thumbs',
		classTitle: 'bg-title',
		classWrapper: 'bg-wrapper'
	});

List of renameable CSS selectors with their default values:

	- classActivePage: 'bg-active-page'
	- classActiveThumb: 'bg-active-thumb'
	- classCategory: 'bg-category'
	- classDescription: 'bg-description'
	- classEnlarge: 'bg-enlarge'
	- classGallery: 'bg-gallery'
	- classImg: 'bg-img'
	- classImgCtn: 'bg-img-ctn'
	- classInfo: 'bg-info'
	- classLoading: 'bg-loading'
	- classLoadingImg: 'bg-loading-img'
	- classMoreLink: 'bg-more-link'
	- classNextLink: 'bg-next-link'
	- classPageLink: 'bg-page-link'
	- classPages: 'bg-page-navigation'
	- classPreviousLink: 'bg-previous-link'
	- classSelectMenu: 'bg-select-menu'
	- classSelectNav: 'bg-select-nav'
	- classThumbs: 'bg-thumbs'
	- classTitle: 'bg-title'
	- classWrapper: 'bg-wrapper'

**html5**: Accepts a boolean value, true creates articles/sections/nav elements, alternatively false creates divs, defaults to true.

	$('#element').blurbGallery({
		html5: true
	});

**loading**: Accepts a string, contains the relative path to the loading image.

	$('#element').blurbGallery({
		loading: 'img/bg-loading.gif'
	});

**multiJSON**: Accepts a boolean, defaults to false which causes plugin to search for a single JSON file. If set to true, plugin searchs for multiple files that are linked by the inital JSON file. 

	$('#element').blurbGallery({
		multiJSON: false
	});

**Page Options**: Accepts a number, contains options for the pagination system, pageShow controls if pages are used altogether, use a boolean.

	$('#element').blurbGallery({
		pageMax: 3,
		pagePer: 3,
		pageShow: true
	});

List of adjustable options:

	- pageMax: 3
	- pagePer: 3
	- pageShow: true

**Path Options**: Accepts a string, holds all of the paths for images. If full/thumb is set to false, it falls back to root path.

	$('#element').blurbGallery({
		pathFull: false,
		pathRoot: 'img/',
		pathThumbs: 'img/thumbs/'
	});

**Selected Options**: Accepts a boolean, contains the starting category and item loaded on the inital load of the gallery. Defaults to false.

	$('#element').blurbGallery({
		selectedCat: false,
		selectedItem: false
	});

**speed**: Accepts a number, controls the speed of the animations.

	$('#element').blurbGallery({
		speed: 300
	});

### Build Contents:
----
Initial build contains source code in both uncompressed and minified versions. Additionally, a CSS, image, JavaScript, and JSON folder that contains examples and reccommended default settings.


### Requests and future expansion:
----
All feedback and updates can be found on the blurbGallery GitHub page:

https://github.com/carlthenimrod/blurbGallery