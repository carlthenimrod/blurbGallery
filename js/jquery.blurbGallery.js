/*!
 * jQuery blurbGallery Plugin
 * Author: Carl Dawson
 * Version: 1.02
 */

var blurbGallery = {

	init: function(options, elem){

		var that = this;

		//mix in the passed-in options with the default options
		that.config = $.extend({}, that.defaults, options);

		//save the element reference, both as a jQuery
		//reference and a normal reference
		that.elem  = elem;
		that.$elem = $(elem);

		//when data loads, render elements
		$.when(that.load()).then(function(){

			that.render.call(that);

			//create events
			that.events();
		},
		function(){

			alert('Error: Gallery load failed!');
		});

		//return that so that we can chain and use the bridge with less code.
		return that;
	},

	defaults: {

		ajax: {
			cache: false,
			dataType: 'json',
			dataUrl: 'json/jquery.items.json'
		},

		callback: function(){},

		cssSelectors: {
			activePage: 'bg-active-page',
			activeThumb: 'bg-active-thumb',
			category: 'bg-category',
			description: 'bg-description',
			enlarge: 'bg-enlarge',
			gallery: 'bg-gallery',
			img: 'bg-img',
			imgCtn: 'bg-img-ctn',
			info: 'bg-info',
			loading: 'bg-loading',
			loadingImg: 'bg-loading-img',
			nextLink: 'bg-next-link',
			pageLink: 'bg-page-link',
			pages: 'bg-page-navigation',
			previousLink: 'bg-previous-link',
			selectMenu: 'bg-select-menu',
			selectNav: 'bg-select-nav',
			thumbs: 'bg-thumbs',
			title: 'bg-title',
			wrapper: 'bg-wrapper'
		},

		html5: true,

		loading: 'img/bg-loading.gif',

		pages: {
			per: 3,
			show: true
		},

		path: {
			full: false,
			root: 'img/',
			thumbs: 'img/thumbs/'
		},

		selected: {
			cat: false,
			img: false
		},

		speed: 300
	},

	load: function(){

		var that = this,
			dfd = $.Deferred();

		//perform ajax, load config
		$.ajax({

			//ajax config
			cache: that.config.ajax.cache,
			dataType: that.config.ajax.dataType,
			url: that.config.ajax.dataUrl
		})
		.then(function(data){

			//set data variable
			that.data = data;

			//find selected, try to get var
			that.selected = that.findSelected(true);

			//resolve deferred
			dfd.resolve();

		}, function(){

			//reject deferred
			dfd.reject();
		});

		//return promise
		return dfd.promise();
	},

	events: function(){

		var that = this;

		//on nav click
		that.$elem.on('click', '.' + that.config.cssSelectors.selectNav + ' a', function(e){

			//change cat
			that.changeCategory.call(that, $(this).html());

			//prevent default
			e.preventDefault();
		});

		//on thumb click
		that.$elem.on('click', '.' + that.config.cssSelectors.thumbs + ' a', function(e){

			//change cat
			that.changeItem.call(that, $(this));

			//prevent default
			e.preventDefault();
		});

		//on previous click
		that.$elem.on('click', '.' + that.config.cssSelectors.previousLink, function(e){

			//change page
			that.changePage.call(that, $(this), 'previous');			

			//prevent default
			e.preventDefault();
		});	

		//on page click
		that.$elem.on('click', '.' + that.config.cssSelectors.pageLink, function(e){

			//change cat
			that.changePage.call(that, $(this));			

			//prevent default
			e.preventDefault();
		});	

		//on next click
		that.$elem.on('click', '.' + that.config.cssSelectors.nextLink, function(e){

			//change cat
			that.changePage.call(that, $(this), 'next');			

			//prevent default
			e.preventDefault();
		});							
	},

	changeCategory: function(id){

		var that = this,
			id = that.utils.formatText(id),
			srcs,
			src;

		//hide gallery
		$('.' + that.config.cssSelectors.imgCtn).hide();
		$('.' + that.config.cssSelectors.info).hide();

		//if loading image is set, show loading
		if(that.config.loading) $('.' + that.config.cssSelectors.loading).show();

		//set selected cat in config
		that.config.selected.cat = id;

		//find selected
		that.selected = that.findSelected();

		//render title
		that.renderTitle( $('.' + that.config.cssSelectors.title) );

		//render cat
		that.renderCategory( $('.' + that.config.cssSelectors.category) );

		//render description
		that.renderDescription( $('.' + that.config.cssSelectors.description) );

		//render image
		src = that.renderImage( $('.' + that.config.cssSelectors.img) );

		//render thumbs
		srcs = that.renderThumbs( $('.' + that.config.cssSelectors.thumbs) );

		$.when(that.utils.preload(src), that.utils.preload(src)).then(function(){

			//if loading image is set, hide loading
			if(that.config.loading) $('.' + that.config.cssSelectors.loading).hide();
			
			//fade in gallery
			$('.' + that.config.cssSelectors.imgCtn).fadeIn(that.config.speed);
			$('.' + that.config.cssSelectors.info).fadeIn(that.config.speed);

			//callback function
			that.config.callback();
		});

		//set pages
		that.pages = {
			ctn: $('.' + that.config.cssSelectors.pages),
			current: 0,
			items: 0,
			total: 0,
			per: that.config.pages.per						
		}

		//render pages
		that.renderPages( $('.' + that.config.cssSelectors.pages) );
	},

	changeItem: function(el){

		var that = this,
			loading = $('.' + that.config.cssSelectors.loadingImg),
			href,
			thumbs;

		//store thumbs
		thumbs = $('.' + that.config.cssSelectors.thumbs).find('a');

		//remove active thumb class
		thumbs.removeClass(that.config.cssSelectors.activeThumb);

		//add active thumb class to selected thumb
		el.addClass(that.config.cssSelectors.activeThumb);

		//store href
		href = el.attr('href');

		//find item using href
		that.findItem(href);

		//render title
		that.renderTitle( $('.' + that.config.cssSelectors.title) );

		//render description
		that.renderDescription( $('.' + that.config.cssSelectors.description) );

		//render image
		src = that.renderImage($('.' + that.config.cssSelectors.img));

		//if loading image is set, show loading
		if(that.config.loading) loading.show();

		$.when(that.utils.preload(src)).then(function(){

			//if loading image is set, hide loading
			if(that.config.loading) loading.hide();

			//callback function
			that.config.callback();			
		});
	},

	changePage: function(el, type){

		var that = this,
			start,
			end,
			pageId,
			previousLink,
			nextLink;

		//if previous
		if(type === 'previous'){

			//only if current is greater than 0
			if( that.pages.current > 0 ){
					
				//create start/end
				start = ((that.pages.current - 1) * that.pages.per);
				end = (start + that.pages.per);

				//assign current
				that.pages.current = parseInt((that.pages.current - 1));
				
				//assign current
				pageId = that.pages.current;

				//clear active and reassign
				$('.' + that.config.cssSelectors.pages).children().removeClass(that.config.cssSelectors.activePage);
				$('.' + that.config.cssSelectors.pageLink).eq(pageId).addClass(that.config.cssSelectors.activePage);
			}
		}
		//if next
		else if(type ==='next'){

			//only if current is less than total
			if((that.pages.current + 1) < that.pages.total){

				//create start/end
				start = ((that.pages.current + 1) * that.pages.per);
				end = (start + that.pages.per);

				//assign current
				that.pages.current = parseInt((that.pages.current + 1));

				//assign current
				pageId = that.pages.current;

				//clear active page and reassign
				$('.' + that.config.cssSelectors.pages).children().removeClass(that.config.cssSelectors.activePage);
				$('.' + that.config.cssSelectors.pageLink).eq(pageId).addClass(that.config.cssSelectors.activePage);	
			}
		}
		//else page
		else{
			
			//store id
			pageId = el.attr('id');

			//assign id to current
			that.pages.current = parseInt(pageId);

			start  = (that.pages.current * that.pages.per);
			end    = (start + that.pages.per);

			//clear active page and reassign
			$('.' + that.config.cssSelectors.pages).children().removeClass(that.config.cssSelectors.activePage);
			$('.' + that.config.cssSelectors.pageLink).eq(pageId).addClass(that.config.cssSelectors.activePage);
		}

		//sort
		that.sortThumbs(start, end);			

		//cache selectors
		previousLink = $('.' + that.config.cssSelectors.previousLink);
		nextLink = $('.' + that.config.cssSelectors.nextLink);

		//adjust showing links
		(that.pages.current === 0) ? previousLink.hide() : previousLink.show();
		(that.pages.current === (that.pages.total - 1)) ? nextLink.hide() : nextLink.css('display', 'inline-block');
	},

	render: function(){

		var that = this,
			wrapper;

		if(that.config.html5){

			wrapper = $('<section/>');
		}
		else{

			wrapper = $('<div/>');
		}

		wrapper.attr({

			'class': that.config.cssSelectors.wrapper
		});

		//append wrapper to elem
		that.$elem.append(wrapper);

		var selectMenu = function(){

			var selectMenu,
				selectNav,
				cats = that.data.items,
				a,
				i,
				l;

			if(that.config.html5){

				selectMenu = $('<section/>');
				selectNav = $('<nav/>');
			}
			else{

				selectMenu = $('<div/>');
				selectNav = $('<div/>');
			}

			selectMenu.attr({

				'class': that.config.cssSelectors.selectMenu
			});

			selectNav.attr({

				'class': that.config.cssSelectors.selectNav
			});

			//for each cat
			for(i = 0, l = cats.length; i < l; ++i){

				//create anchor element
				a = $('<a/>', {

					'alt': cats[i].id,
					'href': '#',
					'html': cats[i].id,
					'title': cats[i].id,
				});

				//append anchor to nav
				selectNav.append(a);
			}

			//append nav to menu
			selectMenu.append(selectNav);

			//append selectMenu to element
			wrapper.append(selectMenu);
		};

		var gallery = function(){

			var gallery,
				loading,
				dfd = $.Deferred();

			var img = function(){

				var img,
					imgCtn,
					enlarge,
					loadingImg,
					el,
					src,
					a,
					dfd = $.Deferred();

				if(that.config.html5){

					img = $('<article/>');
					imgCtn = $('<section/>');
					enlarge = $('<section/>');
				}
				else{

					img = $('<div/>');
					imgCtn = $('<div/>');	
					enlarge = $('<div/>');			
				}

				//if loading image is set, create and append element to imgCtn
				if(that.config.loading){

					if(that.config.html5){

						loadingImg = $('<section/>');
					}
					else{

						loadingImg = $('<div/>');		
					}

					loadingImg.attr({

						'alt': 'Loading...',
						'class': that.config.cssSelectors.loadingImg,
						'title': 'Loading...'
					}).html('<img src="' + that.config.loading +'" />');

					imgCtn.append(loadingImg);
				}	

				img.attr({

					'class': that.config.cssSelectors.img
				});

				imgCtn.attr({

					'class': that.config.cssSelectors.imgCtn
				});

				enlarge.attr({

					'class': that.config.cssSelectors.enlarge
				})
				.html('Click image to enlarge');

				//render image
				src = that.renderImage(img);

				//preload
				$.when(that.utils.preload(src)).done(function(){

					dfd.resolve();
				});

				//append img to imgCtn
				imgCtn.append(img, enlarge);

				//append imgCtn to gallery
				gallery.append(imgCtn);

				return dfd.promise();
			};

			var info = function(){

				var info,
					title,
					category,
					description,
					dfd = $.Deferred();

				var thumbs = function(){

					var thumbs,
						srcs;

					if(that.config.html5){

						thumbs = $('<article/>');
					}
					else{

						thumbs = $('<div/>');
					}

					thumbs.attr({

						'class': that.config.cssSelectors.thumbs
					});

					//render thumbs
					srcs = that.renderThumbs(thumbs);

					//preload all thumbs, upon completion resolve
					$.when(that.utils.preload(srcs)).done(function(){

						dfd.resolve();
					});

					//append thumbs to info
					info.append(thumbs);
				};

				var pages = function(){

					var pages;

					if(that.config.html5){

						pages = $('<section/>');
					}
					else{

						pages = $('<div/>');				
					}

					pages.attr({

						'class': that.config.cssSelectors.pages
					});

					//set pages
					that.pages = {
						ctn: pages,
						current: 0,
						items: 0,
						pages: 0,
						per: that.config.pages.per						
					}

					//render pages
					that.renderPages(pages);

					//append pages to info
					info.append(pages);								
				};

				if(that.config.html5){

					info = $('<section/>');
					title = $('<section/>');
					category = $('<section/>');
					description = $('<section/>');
				}
				else{

					info = $('<div/>');
					title = $('<div/>');
					category = $('<div/>');
					description = $('<div/>');
				}

				info.attr({

					'class': that.config.cssSelectors.info
				});

				//render title
				that.renderTitle(title);

				//render category
				that.renderCategory(category);

				//render description
				that.renderDescription(description);

				//append info to gallery
				gallery.append(info);

				//append elements to info
				info.append(title);
				info.append(category);
				info.append(description);

				//create other components
				thumbs();

				//if pages show is set to true, create pages
				if(that.config.pages.show) pages();

				return dfd.promise();
			};

			if(that.config.html5){

				gallery = $('<section/>');
			}
			else{

				gallery = $('<div/>');
			}

			gallery.attr({

				'class': that.config.cssSelectors.gallery
			});

			//append gallery to wrapper
			wrapper.append(gallery);

			//if loading image is set, create and append element to gallery
			if(that.config.loading){

				if(that.config.html5){

					loading = $('<section/>');
				}
				else{

					loading = $('<div/>');		
				}

				loading.attr({

					'alt': 'Loading...',
					'class': that.config.cssSelectors.loading,
					'title': 'Loading...'
				}).html('<img src="' + that.config.loading +'" />');

				gallery.append(loading);
			}			

			//create other components, load gallery upon completion			
			$.when(img(), info()).then(function(){

				//resolve
				dfd.resolve();

			}, function(){

				//alert error
				alert('Error: Gallery load failed!');
			});
				
			return dfd.promise();
		};

		$.when(selectMenu(), gallery()).then(function(){

			//fade in wrapper
			wrapper.fadeIn(that.config.speed);

			//callback function
			that.config.callback();			

		}, function(){

			//alert error
			alert('Error: Failed to load gallery!')
		});
	},

	renderTitle: function(title){

		var that = this;

		//render title
		title.attr({

			'alt': that.selected.item.title,
			'class': that.config.cssSelectors.title,
			'title': that.selected.item.title
		})
		.html(that.selected.item.title);
	},

	renderCategory: function(category){

		var that = this;

		//render category
		category.attr({

			'alt': that.selected.cat.id,
			'class': that.config.cssSelectors.category,
			'title': that.selected.cat.id
		})
		.html(that.selected.cat.id);
	},

	renderDescription: function(description){

		var that = this;

		description.attr({

			'alt': that.selected.item.info,
			'class': that.config.cssSelectors.description,
			'title': that.selected.item.info
		})
		.html(that.selected.item.info);
	},

	renderImage: function(image){

		var that = this,
			a,
			el,
			src,
			href;

		//empty container
		image.empty();

		//if full image path exists
		if(that.config.path.full){

			href = that.config.path.full + that.selected.item.img;
		}
		else{

			href = that.config.path.root + that.selected.item.img;
		}

		//create anchor
		a = $('<a/>', {

			'href': href
		}).appendTo(image);

		//create img source
		src = that.config.path.root + that.selected.item.img;

		//create img and append to a
		el = $('<img/>',{

			'src': src
		}).appendTo(a);

		return src;
	},

	renderThumbs: function(thumbs){

		var that = this,
			srcs = [],
			src,
			a,
			img,
			i;

		//empty container
		thumbs.empty();

		//for each item
		for(i in that.selected.cat.item){

			//create link
			a = $('<a/>').attr({

				'href': that.selected.cat.item[i].img
			});

			//if img matches, thumb is active
			if(that.selected.item.img === that.selected.cat.item[i].img){

				//add active class
				a.addClass(that.config.cssSelectors.activeThumb);
			}

			//if thumbs path exists
			if(that.config.path.thumbs){

				src = that.config.path.thumbs + that.selected.cat.item[i].img;
			}
			else{

				src = that.config.path.root + that.selected.cat.item[i].img;
			}

			//create img
			img = $('<img/>').attr({

				'src': src
			});

			//append img to a, append a to thumbs
			a.append(img).appendTo(thumbs);

			//push srcs array
			srcs.push(src);
		}

		return srcs;
	},

	renderPages: function(pages){

		var that = this;

		//empty container
		pages.empty();

		//set number of items
		that.pages.items = that.selected.cat.item.length;

		//find number of pages
		that.pages.total = Math.ceil(that.pages.items/that.pages.per);

		//if there are gallery
		if(that.pages.items > that.pages.per){
			var previousLink,
				nextLink,
				pageLink,
				i;

			if(that.config.html5){

				previousLink = $('<section/>');
				nextLink = $('<section/>');
			}
			else{
				previousLink = $('<div/>');
				nextLink = $('<div/>');
			}

			previousLink.attr({
				'alt': 'Previous',
				'class': that.config.cssSelectors.previousLink,
				'title': 'Previous'
			})
			.html('<< Previous');

			nextLink.attr({
				'alt': 'next',
				'class': that.config.cssSelectors.nextLink,
				'title': 'next'
			})
			.html('Next >>');

			//append previous link
			that.pages.ctn.append(previousLink);

			//create page links, append
			for (i = 0; that.pages.total > i; ++i){

				//create page link
				if(that.config.html5){

					pageLink = $('<section/>', {

						'alt': 'Page ' + (i + 1),
						'class': that.config.cssSelectors.pageLink,
						'html': i + 1,
						'id': i,
						'title': 'Page ' + (i + 1)
					});
				}
				else{

					pageLink = $('<div/>', {

						'alt': 'Page ' + (i + 1),
						'class': that.config.cssSelectors.pageLink,
						'html': i + 1,
						'id': i,
						'title': 'Page ' + (i + 1)
					});
				}
			
				//make first page active
				if(i === 0) pageLink.addClass(that.config.cssSelectors.activePage);

				//append page
				that.pages.ctn.append(pageLink);
			};

			//append next link
			that.pages.ctn.append(nextLink);

			//adjust showing links
			(that.pages.current === 0) ? previousLink.hide() : previousLink.show();
			(that.pages.current === (that.pages.total - 1)) ? nextLink.hide() : nextLink.css('display', 'inline-block');

			//sort thumbs
			that.sortThumbs();
		}
	},

	findSelected: function(get){

		var that = this,
			cat,
			item;

		(function(){

			var blurbGallery = that.data.items,
				id,
				i,
				l,
				selectedImg = $('#bg-selected-img').attr('value'),
				selectedCat = $('#bg-selected-cat').attr('value');

			if(selectedImg && get){

				//for each cat
				for(i = 0, l = blurbGallery.length; i < l; ++i){

					var currentCat = blurbGallery[i];

					(function(){

						var i,
							l,
							img;

						for(i = 0, l = currentCat.item.length; i < l; ++i){

							img = that.utils.formatText(currentCat.item[i].title);

							if(selectedImg === img){

								item = currentCat.item[i];

								cat = currentCat;
							}
						}

					})();
				}
			}
			//if selected cat, and get is set
			else if(selectedCat && get){

				//for each cat
				for(i = 0, l = blurbGallery.length; i < l; ++i){

					//format id
					id = that.utils.formatText(blurbGallery[i].id);

					//if id equals cat in config
					if(id === selectedCat){

						//set cat to cat
						cat = blurbGallery[i];
					}
				}
			}
			//elseif, look to config
			else if(that.config.selected.cat){

				//for each cat
				for(i = 0, l = blurbGallery.length; i < l; ++i){

					//if id equals cat in config
					if(that.utils.formatText(blurbGallery[i].id) === that.utils.formatText(that.config.selected.cat)){

						//set cat to cat
						cat = blurbGallery[i];
					}
				}
			}

			//if nothing is selected, select first element by default
			if(!cat) cat = blurbGallery[0];
		})();

		(function(){

			var i;

			if(that.config.selected.item && !item){

				//for each item
				for(i in cat.item){

					//if id equals cat in config
					if(that.utils.formatText(cat.item[i].id) === that.utils.formatText(that.config.selected.item)){

						//set cat to cat
						cat = cat.item[i];
					}
				}
			}

			//if nothing is selected, select first element by default
			if(!item) item = cat.item[0];
		})();	

		return{
			cat: cat,
			item: item
		}
	},

	findItem: function(img){

		var that = this,
			cat = that.selected.cat,
			i;

		//for each item
		for(i in cat.item){

			//if id equals cat in config
			if(cat.item[i].img === img){

				that.selected.item = cat.item[i];
			}
		}
	},

	sortThumbs: function(start, end){

		var that = this,
			thumbs,
			start,
			end,
			i;

		//find start and end
		if(!start) start = (that.pages.current * that.pages.per);
		if(!end) end = (start + that.pages.per);

		//cache thumbs
		thumbs = $('.bg-thumbs a');

		//hide thumbs
		thumbs.hide();

		//slice/show thumbs
		thumbs.slice(start, end).show();
	},

	utils: {

		formatText: function(str){

			//create string for id, make lowercase
			str = str.toLowerCase();

			//replace spaces with underscore, remove other misc characters
			str = str.replace(/ /g, '_');
			str = str.replace(/&/g, 'and');
			str = str.replace(/[^a-z0-9_]/g, '');

			return str;
		},

		preload: function(srcs) {

			var dfd = $.Deferred(),
				promises = [],
				img,
				l,
				p;

			if (!$.isArray(srcs)) {
				srcs = [srcs];
			}

			l = srcs.length;

			for (var i = 0; i < l; i++) {
				p = $.Deferred();
				img = $("<img />");

				img.load(p.resolve);
				img.error(p.resolve);

				promises.push(p);

				img.get(0).src = srcs[i];
			}

			$.when.apply(this, promises).done(dfd.resolve);

			return dfd.promise();
		}
	}
};

//Object.create support test, and fallback for browsers without it
if (typeof Object.create !== 'function'){

	Object.create = function (o){

		function F() {}

		F.prototype = o;

		return new F();
	};
}

//create a plugin based on a defined object
$.plugin = function(name, object){

	$.fn[name] = function(options){

		return this.each(function(){

			if (!$.data(this, name)){

				$.data( this, name, Object.create(object).init(options, this));
			}
		});
	};
};

//create plugin
$.plugin('blurbGallery', blurbGallery);