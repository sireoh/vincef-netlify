/**
 * main.js
 */
;(function(window) {

	'use strict';

	var support = { transitions: Modernizr.csstransitions },
		// transition end event name
		transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		onEndTransition = function( el, callback ) {
			var onEndCallbackFn = function( ev ) {
				if( support.transitions ) {
					if( ev.target != this ) return;
					this.removeEventListener( transEndEventName, onEndCallbackFn );
				}
				if( callback && typeof callback === 'function' ) { callback.call(this); }
			};
			if( support.transitions ) {
				el.addEventListener( transEndEventName, onEndCallbackFn );
			}
			else {
				onEndCallbackFn();
			}
		},
		// the pages wrapper
		stack = document.querySelector('.pages-stack'),
		// the page elements
		pages = [].slice.call(stack.children),
		// total number of page elements
		pagesTotal = pages.length,
		// index of current page
		current = 0,
		// menu button
		menuCtrl = document.querySelector('button.menu-button'),
		// the navigation wrapper
		nav = document.querySelector('.pages-nav'),
		// the menu nav items
		navItems = [].slice.call(nav.querySelectorAll('.link--page')),
		// check if menu is open
		isMenuOpen = false;

	function init() {
		buildStack();
		initEvents();
	}

	function buildStack() {
		var stackPagesIdxs = getStackPagesIdxs();

		// set z-index, opacity, initial transforms to pages and add class page--inactive to all except the current one
		for(var i = 0; i < pagesTotal; ++i) {
			var page = pages[i],
				posIdx = stackPagesIdxs.indexOf(i);

			if( current !== i ) {
				classie.add(page, 'page--inactive');

				if( posIdx !== -1 ) {
					// visible pages in the stack
					page.style.WebkitTransform = 'translate3d(0,100%,0)';
					page.style.transform = 'translate3d(0,100%,0)';
				}
				else {
					// invisible pages in the stack
					page.style.WebkitTransform = 'translate3d(0,75%,-300px)';
					page.style.transform = 'translate3d(0,75%,-300px)';		
				}
			}
			else {
				classie.remove(page, 'page--inactive');
			}

			page.style.zIndex = i < current ? parseInt(current - i) : parseInt(pagesTotal + current - i);
			
			if( posIdx !== -1 ) {
				page.style.opacity = parseFloat(1 - 0.1 * posIdx);
			}
			else {
				page.style.opacity = 0;
			}
		}
	}

	// event binding
	function initEvents() {
		// menu button click
		menuCtrl.addEventListener('click', toggleMenu);

		// navigation menu clicks
		navItems.forEach(function(item) {
			// which page to open?
			var pageid = item.getAttribute('href').slice(1);
			item.addEventListener('click', function(ev) {
				ev.preventDefault();
				openPage(pageid);
			});
		});

		// clicking on a page when the menu is open triggers the menu to close again and open the clicked page
		pages.forEach(function(page) {
			var pageid = page.getAttribute('id');
			page.addEventListener('click', function(ev) {
				if( isMenuOpen ) {
					ev.preventDefault();
					openPage(pageid);
				}
			});
		});

		// keyboard navigation events
		document.addEventListener( 'keydown', function( ev ) {
			if( !isMenuOpen ) return; 
			var keyCode = ev.keyCode || ev.which;
			if( keyCode === 27 ) {
				closeMenu();
			}
		} );
	}

	// toggle menu fn
	function toggleMenu() {
		if( isMenuOpen ) {
			closeMenu();
		}
		else {
			openMenu();
			isMenuOpen = true;
		}
	}

	// opens the menu
	function openMenu() {
		// toggle the menu button
		classie.add(menuCtrl, 'menu-button--open')
		// stack gets the class "pages-stack--open" to add the transitions
		classie.add(stack, 'pages-stack--open');
		// reveal the menu
		classie.add(nav, 'pages-nav--open');

		// now set the page transforms
		var stackPagesIdxs = getStackPagesIdxs();
		for(var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
			var page = pages[stackPagesIdxs[i]];
			page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)'; // -200px, -230px, -260px
			page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)';
		}
	}

	// closes the menu
	function closeMenu() {
		// same as opening the current page again
		openPage();
	}

	// opens a page
	function openPage(id) {
		var futurePage = id ? document.getElementById(id) : pages[current],
			futureCurrent = pages.indexOf(futurePage),
			stackPagesIdxs = getStackPagesIdxs(futureCurrent);

		// set transforms for the new current page
		futurePage.style.WebkitTransform = 'translate3d(0, 0, 0)';
		futurePage.style.transform = 'translate3d(0, 0, 0)';
		futurePage.style.opacity = 1;

		// set transforms for the other items in the stack
		for(var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
			var page = pages[stackPagesIdxs[i]];
			page.style.WebkitTransform = 'translate3d(0,100%,0)';
			page.style.transform = 'translate3d(0,100%,0)';
		}

		// set current
		if( id ) {
			current = futureCurrent;
		}
		
		// close menu..
		classie.remove(menuCtrl, 'menu-button--open');
		classie.remove(nav, 'pages-nav--open');
		onEndTransition(futurePage, function() {
			classie.remove(stack, 'pages-stack--open');
			// reorganize stack
			buildStack();
			isMenuOpen = false;
		});
	}

	// gets the current stack pages indexes. If any of them is the excludePage then this one is not part of the returned array
	function getStackPagesIdxs(excludePageIdx) {
		var nextStackPageIdx = current + 1 < pagesTotal ? current + 1 : 0,
			nextStackPageIdx_2 = current + 2 < pagesTotal ? current + 2 : 1,
			idxs = [],

			excludeIdx = excludePageIdx || -1;

		if( excludePageIdx != current ) {
			idxs.push(current);
		}
		if( excludePageIdx != nextStackPageIdx ) {
			idxs.push(nextStackPageIdx);
		}
		if( excludePageIdx != nextStackPageIdx_2 ) {
			idxs.push(nextStackPageIdx_2);
		}

		return idxs;
	}

	init();

})(window);

const downloadCV_text = `<a href="public/forms/20240603-VFUNG-RESUME.pdf" class="btn btn-theme" download>Download CV</a>`;

const about_text = `Hello, I'm Vincent! I am a computer science student at British Columbia Institute of Technology (BCIT). I also have a Bachelors in Media Arts at Emily Carr University of Art + Design (ECUAD), where I studied 2D + Experimental Animation. You would find me working on personal coding projects, managing my freelance illustration brand, or just creating something in general. Recently, I have sprouted an interest in music-making.
`;

/* #region about skills */
const about_skills = [
	{
		title: "AT WORK",
		description: "He enjoys listening to his client's inputs; comprehending their goals and the vision they aim to achieve. He strives to assist them in reaching those objectives and developing a refined final product that can be utilized indefinitely. His goal is to absorb as much knowledge as possible, enabling him to create animations and designs that surpass the quality of his previous works.",
	},
	{
		title: "IN LIFE",
		description: "Since a young age, he has harbored a love for making and playing games, as well as crafting short stories. This creative passion remains with him, fueling the production of new works on a daily basis. He maintains an active lifestyle by biking around his neighborhood, exploring maps to discover fresh routes and parks. Weekends are dedicated to gaming with friends, engaging in small personal projects for his Twitch and YouTube channels, or working on commissions under his branding, sireoh.",
	}
];
/* #endregion about skills */
/* #region resume */
const resume = {
	data: [
	  {
		section_title: "PROFESSIONAL EXPERIENCE",
		items: [
		  {
			icon: "cart4",
			title: "T&T Supermarket",
			date: "General Service, February 2021–May 2023",
			description: `
				<i class="bi bi-caret-right-fill"></i>
				Greet customers by providing good customer service with a smile, and friendly enthusiasm. Delivering fast and accurate checkout service, prevent possible fraud<br>
				<i class="bi bi-caret-right-fill"></i>
				Knowledge of basic work safety, Canadian currencies and essential mathematics<br>
				<i class="bi bi-caret-right-fill"></i>
				Monitor checkout stations to ensure that they are well-kept and are working appropriately; maintain checkout area cleanliness`,
		  },
		  {
			icon: "lightbulb",
			title: "Brainchild Education Center",
			date: "English and Math Tutor, February 2015–March 2019",
			description: `
				<i class="bi bi-caret-right-fill"></i>
				Create a safe and nurturing classroom environment for children. Support children's learning and development through engaging the Brainchild Education program<br>
				<i class="bi bi-caret-right-fill"></i>
				Strong skills in Math( Grade 8-12) and Reading (K-12)<br>
				<i class="bi bi-caret-right-fill"></i>
				Excellent communication skills, both verbal and written. Ability to work collaboratively as part of a team`,
		  }
		]
	  },
	  {
		section_title: "EDUCATION",
		items: [
		  {
			icon: "pc-display",
			title: "BRITISH COLUMBIA INSTITUTE OF TECHNOLOGY, Burnaby, BC",
			date: "Diploma of Computing, Computer Systems Technology, Jan 2024 - Present",
			description: "Current Student Leader for Set D, the voice for the Student Association at BCIT",
		  },
		  {
			icon: "brush",
			title: "EMILY CARR UNIVERSITY OF ART AND DESIGN, Vancouver, BC",
			date: "Bachelor of Media Arts, 2D Animation + Experimental, May 2022",
			description: "Animation Club Leader, led member’s club activities and planned events",
		  }
		]
	  }
	]
  };
/* #endregion resume */
/* #region portfolio */
const portfolio = {
	data: [
		{
			filters: `<li class="portfolio-item bcit" style="position: absolute; left: 0px; top: 0px;">`,
			link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			image: "public/img/portfolio-1.jpg",
			title: "Flailfish",
			description: "pogpog"
		},
		{
			filters: `<li class="portfolio-item apps" style="position: absolute; left: 373.283px; top: 0px;">`,
			link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			image: "public/img/portfolio-2.jpg",
			title: "Eoh",
			description: "pogpog2"
		},
		{
			filters: `<li class="portfolio-item ecuad personal" style="position: absolute; left: 746.566px; top: 0px;">`,
			link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			image: "public/img/portfolio-3.jpg",
			title: "Bob",
			description: "pogpog3"
		},
		{
			filters: `<li class="portfolio-item ecuad bcit" style="position: absolute; left: 0px; top: 372.367px;">`,
			link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			image: "public/img/portfolio-4.jpg",
			title: "Flailfish",
			description: "pogpog4"
		},
		{
			filters: `<li class="portfolio-item ecuad personal" style="position: absolute; left: 373.283px; top: 372.367px;">`,
			link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			image: "public/img/portfolio-5.jpg",
			title: "Flailfish",
			description: "pogpog5"
		},
		{
			filters: `<li class="portfolio-item personal bcit" style="position: absolute; left: 746.566px; top: 372.367px;">`,
			link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			image: "public/img/portfolio-6.jpg",
			title: "Flailfish",
			description: "pogpog6"
		}
	]
};
/* #endregion portfolio */

const loadAboutSkills = () => {
	let str = "";
	about_skills.forEach(item => {
		str += `
		<div class="col-md-6 col-sm-6 m-30px-b">
		<div class="feature-box">
			<i class="icon dark-color theme-after ti-ruler-pencil"></i>
			<div class="feature-content">
			<h5 class="dark-color">${item.title}</h5>
			<p>${item.description}</p>
			</div>
		</div>
		</div> <!-- col -->`;
	});
	$("#aboutSkills").html(str);
}

const loadResume = () => {
	let str = "";
	for (let i = 0; i < resume.data.length; i++) {
	  str += `
	  <div class="col-md-6">
		<div class="resume-row">
		  <h2 class="theme-after dark-color">${resume.data[i].section_title}</h2>
		  <ul>`;
	  for (let j = 0; j < resume.data[i].items.length; j++) {
		str += `
			<li>
			  <div class="r-name">
				<i class="bi bi-${resume.data[i].items[j].icon} theme-bg text-white"></i>
				<span class="dark-color">${resume.data[i].items[j].title}</span>
				<label>${resume.data[i].items[j].date}</label>
			  </div>
			  <div class="r-info">
				<p>${resume.data[i].items[j].description}</p>
			  </div>
			</li>`;
	  }
	  str += `</ul>
		</div>
	  </div> <!-- col -->`;
	}
	$("#resumeBox").html(str);
};

const loadPortfolio = () => {
	let str = `<ul class="portfolio-cols portfolio-cols-3">`;
	for (let i = 0; i < 6; i++) {
		str += `
		${portfolio.data[i].filters}
			<div class="portfolio-col portfolio-hover-01">
				<div class="portfolio-img">
				<a href="#">
					<img src="${portfolio.data[0].image}" title="" alt="">
				</a>
				<div class="hover">
					<div class="action-btn">
						<a href="http://www.youtube.com/watch?v=0O2aH4XLbto" class="popup-video theme-color"><i class="fa fa-play"></i></a>
						<a class="lightbox-gallery theme-color" href="${portfolio.data[0].image}" title="Lightbox gallery image title...">
						<i class="fas fa-expand"></i>
						</a>
						<a href="#" class="theme-color">
						<i class="fa fa-link"></i>
						</a>
						</div> <!-- Video Btn -->
					</div> <!-- Hover -->
				</div>

				<div class="portfolio-info">
				<h5>${portfolio.data[i].title}</h5>
				<span>${portfolio.data[i].title}</span>
				</div>
			</div> <!-- Portfolio -->
		</li> <!-- col -->`;
	};
	str += `</ul> <!-- row -->`;
	// $("#portfolioContent").html(str);
}

$(document).ready(() => {
	$(".downloadCV").html(downloadCV_text);
	$("#aboutDescription").html(about_text);
	loadAboutSkills();
	loadResume();
});