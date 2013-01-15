/*!
 * jQuery blurbGallery Plugin
 * Author: Carl Dawson
 * Version: 1.05
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

		ajaxCache: false,
		ajaxDataType: 'json',
		ajaxDataUrl: 'json/jquery.single.json',
		callback: function(){},
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
		classWrapper: 'bg-wrapper',
		html5: true,
		loading: 'img/bg-loading.gif',
		multiJSON: false,
		pageMax: 3,
		pagePer: 3,
		pageShow: true,
		pathFull: false,
		pathRoot: 'img/',
		pathThumbs: 'img/thumbs/',
		selectedCat: false,
		selectedImg: false,
		speed: 300
	},

	load: function(){

		var that = this,
			dfd = $.Deferred();

		//perform ajax, load config
		$.ajax({

			//ajax config
			cache: that.config.ajaxCache,
			dataType: that.config.ajaxDataType,
			url: that.config.ajaxDataUrl
		})
		.then(function(data){

			//set data variable
			that.data = data;

			//find selected
			$.when(that.findSelected()).then(function(){

				that.selected = {

					cat: that.selectedCat,
					item: that.selectedItem
				}

				//resolve deferred
				dfd.resolve();
			});

		}, function(){

			//reject deferred
			dfd.reject();
		});

		//return promise
		return dfd.promise();
	},

	events: function(){

		var that = this;

		//on thumb click
		that.$elem.on('click', '.' + that.config.classThumbs + ' a', function(e){

			//change cat
			that.changeItem.call(that, $(this));

			//prevent default
			e.preventDefault();
		});

		//on previous click
		that.$elem.on('click', '.' + that.config.classPreviousLink, function(e){

			//change page
			that.changePage.call(that, $(this), 'previous');			

			//prevent default
			e.preventDefault();
		});	

		//on page click
		that.$elem.on('click', '.' + that.config.classPageLink, function(e){

			//change cat
			that.changePage.call(that, $(this));			

			//prevent default
			e.preventDefault();
		});	

		//on next click
		that.$elem.on('click', '.' + that.config.classNextLink, function(e){

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
		$('.' + that.config.classImgCtn).hide();
		$('.' + that.config.classInfo).hide();

		//if loading image is set, show loading
		if(that.config.loading) $('.' + that.config.classLoading).show();

		//set selected cat in config
		that.config.selectedCat = id;

		//find selected
		that.selected = that.findSelected();

		//render title
		that.renderTitle( $('.' + that.config.classTitle) );

		//render cat
		that.renderCategory( $('.' + that.config.classCategory) );

		//render description
		that.renderDescription( $('.' + that.config.classDescription) );

		//render image
		src = that.renderImage( $('.' + that.config.classImg) );

		//render thumbs
		srcs = that.renderThumbs( $('.' + that.config.classThumbs) );

		$.when(that.utils.preload(src), that.utils.preload(src)).then(function(){

			//if loading image is set, hide loading
			if(that.config.loading) $('.' + that.config.classLoading).hide();
			
			//fade in gallery
			$('.' + that.config.classImgCtn).fadeIn(that.config.speed);
			$('.' + that.config.classInfo).fadeIn(that.config.speed);

			//callback function
			that.config.callback();
		});

		//set pages
		that.pages = {
			ctn: $('.' + that.config.classPages),
			current: 0,
			items: 0,
			total: 0,
			per: that.config.pagePer						
		}

		//render pages
		that.renderPages( $('.' + that.config.classPages) );
	},

	changeItem: function(el){

		var that = this,
			loading = $('.' + that.config.classLoadingImg),
			href,
			src,
			thumbs;

		//hide image and enlarge
		$('.' + that.config.classImg).css('opacity', 0);
		$('.' + that.config.classEnlarge).css('opacity', 0);

		//store thumbs
		thumbs = $('.' + that.config.classThumbs).find('a');

		//remove active thumb class
		thumbs.removeClass(that.config.classActiveThumb);

		//add active thumb class to selected thumb
		el.addClass(that.config.classActiveThumb);

		//store href
		href = el.attr('href');

		//find item using href
		that.findItem(href);

		//render title
		that.renderTitle( $('.' + that.config.classTitle) );

		//render description
		that.renderDescription( $('.' + that.config.classDescription) );

		//render image
		src = that.renderImage($('.' + that.config.classImg));

		//if loading image is set, show loading
		if(that.config.loading) loading.show();

		$.when(that.utils.preload(src)).then(function(){

			//if loading image is set, hide loading
			if(that.config.loading) loading.hide();

			//fade in gallery
			$('.' + that.config.classImg).animate({'opacity': 1}, that.config.speed);
			$('.' + that.config.classEnlarge).animate({'opacity': 1}, that.config.speed);

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

				//render pages
				that.renderPages($('.' + that.config.classPages));
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

				//render pages
				that.renderPages($('.' + that.config.classPages));					
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

			//render pages
			that.renderPages($('.' + that.config.classPages));			
		}

		//sort
		that.sortThumbs(start, end);
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

			'class': that.config.classWrapper
		});

		//append wrapper to elem
		that.$elem.append(wrapper);

		var selectMenu = function(){

			var selectMenu,
				selectNav,
				cats = that.categories,
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

				'class': that.config.classSelectMenu
			});

			selectNav.attr({

				'class': that.config.classSelectNav
			});

			//for each cat
			for(i = 0, l = cats.length; i < l; ++i){

				//create anchor element
				a = $('<a/>', {

					'alt': cats[i],
					'href': '?cat=' + that.utils.formatText(cats[i]),
					'html': cats[i],
					'title': cats[i]
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
						'class': that.config.classLoadingImg,
						'title': 'Loading...'
					}).html('<img src="' + that.config.loading +'" />');

					imgCtn.append(loadingImg);
				}	

				img.attr({

					'class': that.config.classImg
				});

				imgCtn.attr({

					'class': that.config.classImgCtn
				});

				enlarge.attr({

					'class': that.config.classEnlarge
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

						'class': that.config.classThumbs
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

						'class': that.config.classPages
					});

					//set pages
					that.pages = {
						ctn: pages,
						current: 0,
						items: 0,
						pages: 0,
						per: that.config.pagePer						
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

					'class': that.config.classInfo
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
				if(that.config.pageShow) pages();

				return dfd.promise();
			};

			if(that.config.html5){

				gallery = $('<section/>');
			}
			else{

				gallery = $('<div/>');
			}

			gallery.attr({

				'class': that.config.classGallery
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
					'class': that.config.classLoading,
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
			'class': that.config.classTitle,
			'title': that.selected.item.title
		})
		.html(that.selected.item.title);
	},

	renderCategory: function(category){

		var that = this;

		//render category
		category.attr({

			'alt': that.selected.cat.id,
			'class': that.config.classCategory,
			'title': that.selected.cat.id
		})
		.html(that.selected.cat.id);
	},

	renderDescription: function(description){

		var that = this;

		description.attr({

			'alt': that.selected.item.info,
			'class': that.config.classDescription,
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
		if(that.config.pathFull){

			href = that.config.pathFull + that.selected.item.img;
		}
		else{

			href = that.config.pathRoot + that.selected.item.img;
		}

		//create anchor
		a = $('<a/>', {

			'href': href
		}).appendTo(image);

		//create img source
		src = that.config.pathRoot + that.selected.item.img;

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
				a.addClass(that.config.classActiveThumb);
			}

			//if thumbs path exists
			if(that.config.pathThumbs){

				src = that.config.pathThumbs + that.selected.cat.item[i].img;
			}
			else{

				src = that.config.pathRoot + that.selected.cat.item[i].img;
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
				moreLink,
				count,
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
				'class': that.config.classPreviousLink,
				'title': 'Previous'
			})
			.html('<< Previous');

			nextLink.attr({
				'alt': 'next',
				'class': that.config.classNextLink,
				'title': 'next'
			})
			.html('Next >>');

			//append previous link
			that.pages.ctn.append(previousLink);

			if(that.pages.total > that.config.pageMax){

				count = that.pages.current;
			}
			else{

				count = 0;
			}

			//create page links, append
			for (i = count; that.pages.total > i; ++i){

				//create page link
				if(that.config.html5){

					pageLink = $('<section/>', {

						'alt': 'Page ' + (i + 1),
						'class': that.config.classPageLink,
						'html': i + 1,
						'id': i,
						'title': 'Page ' + (i + 1)
					});
				}
				else{

					pageLink = $('<div/>', {

						'alt': 'Page ' + (i + 1),
						'class': that.config.classPageLink,
						'html': i + 1,
						'id': i,
						'title': 'Page ' + (i + 1)
					});
				}
			
				//make first page active
				if(i === that.pages.current) pageLink.addClass(that.config.classActivePage);

				//append page
				that.pages.ctn.append(pageLink);

				if(i + 1 === (that.config.pageMax + that.pages.current)){

					//if more pages exist, create more link
					if(i + 1 < that.pages.total){

						//create more link
						if(that.config.html5){

							moreLink = $('<section/>', {

								'html': '...',
								'class': that.config.classMoreLink
							});
						}
						else{

							moreLink = $('<div/>', {
								'html': '...',
								'class': that.config.classMoreLink
							});
						}

						//append moreLink
						that.pages.ctn.append(moreLink);
					}		

					break;
				}
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

	findSelected: function(){

		var that = this,
			dfd = $.Deferred(),
			cat = $('#bg-selected-cat').attr('value'),
			img = $('#bg-selected-img').attr('value'),
			categories,
			item;

		//create empty cat array
		that.categories = [];

		if(that.config.multiJSON){

			categories = that.data.categories;

			//find cat
			if(cat){

				(function(){

					var i,
						l;

					for(i = 0, l = categories.length; i < l ; ++i){

						if(cat === that.utils.formatText(categories[i].id)){

							that.selectedCat = categories[i].id;
						}

						that.categories.push(categories[i].id);
					}

				})();
			}
			else{

				for(i = 0, l = categories.length; i < l ; ++i){

					that.categories.push(categories[i].id);
				}				

				that.selectedCat = categories[0].id;
			}

			$.ajax({

				//ajax config
				cache: that.config.ajaxCache,
				dataType: that.config.ajaxDataType,
				url: 'json/' + that.utils.formatText(that.selectedCat) + '.json'

			}).then(function(data){

				var items = data.items.item,
					i,
					l;

				//reset data var
				that.selectedCat = data.items;

				//find img
				if(img){

					for(i = 0, l = items.length; i < l; ++i){

						if(img === that.utils.formatText(items[i].title)){

							that.selectedItem = items[i];
						}
					}
				}
				else{

					that.selectedItem = items[0];
				}

				//resolve deferred
				dfd.resolve();
			});
		}
		else{

			(function(){

				var blurbGallery = that.data.items,
					id,
					i,
					l;

				//if nothing is selected, select first element by default
				if(cat){

					//for each cat
					for(i = 0, l = blurbGallery.length; i < l; ++i){

						//add to cat array
						that.categories.push(blurbGallery[i].id);

						var currentCat = blurbGallery[i];

						if(cat === that.utils.formatText(blurbGallery[i].id)){

							that.selectedCat = currentCat;
						}
					}

				}
				else{

					that.selectedCat = blurbGallery[0];

					//for each cat
					for(i = 0, l = blurbGallery.length; i < l; ++i){

						//add to cat array
						that.categories.push(blurbGallery[i].id);
					}
				}

				if(img){

					//for each cat
					for(i = 0, l = blurbGallery.length; i < l; ++i){

						var currentCat = blurbGallery[i];

						(function(){

							var i,
								l,
								currentImg;

							for(i = 0, l = currentCat.item.length; i < l; ++i){

								currentImg = that.utils.formatText(currentCat.item[i].title);
								
								if(img === currentImg){

									that.selectedItem = currentCat.item[i];
								}
							}

						})();
					}
				}
				else{

					that.selectedItem = blurbGallery[0].item[0];
				}

				//resolve
				dfd.resolve();
			})();
		}

		return dfd.promise();
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