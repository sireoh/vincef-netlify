/*========================================================================
EXCLUSIVE ON themeforest.net
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Template Name   : Alexio
Author          : PxDraft
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright (c) 2018 - PxDraft
========================================================================*/

const setup = () => {
    const WebLoad = () => {
        $("#loading").css("display", "none");
    }
    
    const MasoNry = () => {
        var portfolioWork = $('.portfolio-content');
            $(portfolioWork).isotope({
                resizable: false,
                itemSelector: '.portfolio-item',
                layoutMode: 'masonry',
                filter: '*'
              });
              //Filtering items on portfolio.html
              var portfolioFilter = $('.filter li');
              // filter items on button click
              $(portfolioFilter).on( 'click', function() {
                var filterValue = $(this).attr('data-filter');
                portfolioWork.isotope({ filter: filterValue });
              });
              //Add/remove class on filter list
              $(portfolioFilter).on( 'click', function() {
                $(this).addClass('active').siblings().removeClass('active');
              });
    }
    
    const PopupVideo = () => {
        $('.popup-video').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
      });
    }
    
    const LightboxGallery = () => {
        $('.portfolio-col').magnificPopup({
            delegate: '.lightbox-gallery',
            type: 'image',
            tLoading: '#%curr%',
            mainClass: 'mfp-fade',
            fixedContentPos: true,
            closeBtnInside: true,
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
            }
        });
    }
    
    const mTypeIt = () => {
        new TypeIt('#type-it', {
            speed: 50,
            loop:true,
            strings: [
              'Computer Science Student at BCIT',
              '2D + Experimental Animation Bachelors at Emily Carr'
            ],
            breakLines: false
        }); 
    }

    // Window on Load
    $(window).on("load", function(){
        MasoNry();
        WebLoad();
      });
  
      $( document ).ready(function() {
          MasoNry();
          PopupVideo();
          LightboxGallery();
          mTypeIt();
      });
}
setup();