$(document).ready(function () {
	
	$("header").load("/includes/header.html");
	$("footer").load("/includes/footer.html");
    
    /* Gestion du CSS avec le navigateur android */
    if ($('.progress').length !== 0) {
        try {
            if (navigator.userAgent.match(/Android/i)) {
                $('.progress .bar-width').each(function () {
                    $(this).addClass('bar-width-mobile');
                });
            }
        } catch (err) {
        }
    }

    /* Affichage responsive des images dans la lightbox */
    $('[data-target="#lightbox"]').click(function () {
        var imgWidth = 0;
        var imgHeight = 0;
        var ratio = 0;
        var lightbox = $('#lightbox');
        var imglightbox = lightbox.find('img');
        var img = $(this).find('img');
        var width = $(window).width() - 100 >= 100 ? $(window).width() - 100 : 100;
        var height = $(window).height() - 100 >= 100 ? $(window).height() - 100 : 100;
        var image = new Image(); // Cree une nouvelle image afin de recuperer sa taille reelle et non celle definie
        image.onload = function () { // Mis avant la source afin d'etre sur d'executer la fonction
            imgWidth = this.width;
            imgHeight = this.height;
            ratio = imgWidth / imgHeight;
            if (imgWidth <= width && imgHeight <= height) {
                lightbox.find('.modal-dialog').css({'width': imgWidth}); // Image taille reelle
            } else if (ratio > width / height) {
                lightbox.find('.modal-dialog').css({'width': width}); // Image prennant tout la largeur
            } else {
                lightbox.find('.modal-dialog').css({'width': height * ratio}); // Image prennant toute la hauteur
            }
        };
        image.src = img.attr('src');
        imglightbox.attr('src', img.attr('src'));
        imglightbox.attr('alt', img.attr('alt'));
        $(window).resize(function () {
            if (lightbox.hasClass('in')) {
                width = $(window).width() - 100 >= 100 ? $(window).width() - 100 : 100;
                height = $(window).height() - 100 >= 100 ? $(window).height() - 100 : 100;
                if (imgWidth <= width && imgHeight <= height) {
                    lightbox.find('.modal-dialog').css({'width': imgWidth});
                } else if (ratio > width / height) {
                    lightbox.find('.modal-dialog').css({'width': width});
                } else {
                    lightbox.find('.modal-dialog').css({'width': height * ratio});
                }
            }
        });
    });

    /* Appel a la fontion permettant d'afficher les elements un fois le niveau atteint */
    if ($('.scroll').length !== 0) {
        scroll();
        $(window).scroll(function () {
            scroll();
        });
        $(window).resize(function () {
            scroll();
        });
    }

    /* Permet de gerer le carrousel vertical */
    $('.vertical-carousel > .chevron > span[data-slide]').click(function () {
        if (!$(this).hasClass('disabled')) {
            var direction = $(this).attr("data-slide");
            var currentSlide = $(this).parents('.vertical-carousel').children('.items').children('.item.active');
            var newSlide = $(); // $() ou jQuery() permet de creer un objet jQuery
            var enable = true;
            var chevron = null;
            if (direction === "next") {
                newSlide = currentSlide.next('.item');
                enable = newSlide.next('.item').length;
                chevron = $('.vertical-carousel > .chevron:first > span[data-slide]');
            } else if (direction === "prev") {
                newSlide = currentSlide.prev('.item');
                enable = newSlide.prev('.item').length;
                chevron = $('.vertical-carousel > .chevron:last > span[data-slide]');
            }
            if (newSlide.length !== 0) {
                if (chevron.hasClass('disabled')) {
                    chevron.removeClass('disabled');
                }
                if (!enable) {
                    $(this).addClass('disabled');
                }
                currentSlide.removeClass('active');
                newSlide.addClass('active');
                var progress = newSlide.find('.progress .progress-bar');
                if (progress.length !== 0) {
                    progress.css({'width': '0'});
                    progress.css("width", function () {
                        var percent = $(this).attr("data-value") + "%";
                        $(this).children().text(percent);
                        return percent;
                    });
                }
                newSlide.stop(true, false); // Stop les annimations en cours avant le changement de slide
                newSlide.css({'opacity': '0'});
                newSlide.animate({'opacity': '1'}, 3000);
            }
        }
    });
    
    /* Affiche la note sous forme d'un barre d'etoiles */
    $('[data-score]').each(function () {
        var score = $(this).attr("data-score");
        var text = " ";
        for (var i = 0; i < 5; i++) {
            if(score > 1){
                text += '<span class="glyphicon glyphicon-star text-right"></span>';
                score -= 2;
            } else if(score === 1){
               text += '<span class="glyphicon glyphicon-star-half text-right"></span>';
               score -=1;
            } else {
                text += '<span class="glyphicon glyphicon-star-empty text-right"></span>';
            }
        }
        $(this).append(text);
    });

    /* Affiche l'annee actuelle */
    $('.currentYear').each(function () {
        $(this).text(new Date().getFullYear());
    });

    /* Calcul l'age */
    $('[data-age]').each(function () {
        var intervalle = getInterval($(this).attr("data-age"));
        var annee = intervalle.annee;
        $(this).text(annee + " ans");
    });

    /* Precise de quand date l'article */
    $('[data-article]').each(function () {
        var intervalle = getInterval($(this).attr("data-article"));
        var jour = intervalle.jour;
        var mois = intervalle.mois;
        var annee = intervalle.annee;
        var texte = " Il y a ";
        if (annee > 0) {
            if (annee > 1) {
                texte += annee + " ans";
            } else {
                texte += "1 an";
            }
        } else if (mois > 0) {
            texte += mois + " mois";
        } else {
            if (jour === 0) {
                texte = " Aujourd'hui";
            } else if (jour === 1) {
                texte += "1 jour";
            } else {
                texte += jour + " jours";
            }
        }
        $(this).text(texte);
    });

    /* Appel a la fonction permettant d'activer le bon onglet du menu au fur et a mesure que l'on se deplace dans la page */
    if ($('.nav-sidebar li>a').length !== 0) {
        menuScroll();
        $(window).scroll(function () {
            menuScroll();
        });
        $(window).resize(function () {
            menuScroll();
        });
    }

    /* Scroll jusqu'a l'element voulu depuis le menu */
    $('.nav-sidebar li>a').click(function () {
        var pos = $($(this).attr('href')).offset().top - 65;
        $(this).blur(); // Pour certain navigateur, il est necessaire de desactiver le focus pour eviter que le menu fixe tremble lors d'un scroll
        $('html,body').stop(true, false); // Stop l'animation si elle ne s'etait
        $('html,body').animate({scrollTop: pos}, 1000);
        return false;
    });

    /* Change le cookie pour la galerie selon le choix de l'utilisateur */
    $('#galerie .dropdown-menu a').click(function () {
        var gallery_mode = $(this).attr('id') === "galerie_vitrine" ? "vitrine" : "standard";
        $(this).parents('.btn-group').children('.dropdown-toggle').dropdown('toggle');
        gallery(gallery_mode);
        return false;
    });

    /* Appel a la fonction permettant d'affiche la galerie differement selon la taille de l'ecran et le cookie enregistre */
    if ($('.gallery').length !== 0) {
        gallery();
        $(window).resize(function () {
            gallery();
        });
    }

    /* Animation des cartes de competences */
	$('.card').click(function () {
		$(this).children('.panel-hide').slideToggle("slow");
	});
	
	/* Execute le code présent dans la div et affiche le resultat */
	$("a[href='#code']").click(function(){
		var content = $("div[contenteditable]").text().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
		$("#code").html(content);
	});
});

/* Active le menu */
function activateMenuItem(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
}

/* Fontion permettant d'afficher les elements un fois le niveau atteint */
function scroll() {
    var botWindow = $(window).scrollTop() + $(window).height();
    $('.scroll').each(function () {
        var topObject = $(this).offset().top;
        if ($(this).css('opacity') === '0' && botWindow > topObject) {
            $(this).css({'opacity': '0.01'}); // Afin d'eviter les executions multiples du à la lantence de l'animation sur certain navigateur
            $(this).animate({'opacity': '1'}, 3000);
            var progress = $(this).find('.progress .progress-bar');
            if (progress.length !== 0) {
                progress.css("width", function () {
                    var percent = $(this).attr("data-value") + "%";
                    $(this).children().text(percent);
                    return percent;
                });
            }
            var timeline = $(this).find('.timeline article p');
            if (timeline.length !== 0) {
                timeline.each(function () {
                    showText($(this), $(this).text(), 0, 50);
                });
            }
        }
    });
}

/* Permet d'afficher les lettres d'un texte une par une selon un interval */
function showText(target, message, index, interval) {
    var mes = "";
    while (index < message.length) {
        if (message[index + 1] === " ") {
            mes += "<span class='letter-by-letter'>" + message[index] + " " + "</span>";
        } else {
            mes += "<span class='letter-by-letter'>" + message[index] + "</span>";
        }
        index++;
    }
    $(target).html(mes);
    $(target).children('.letter-by-letter').each(function (index) {
        var span = $(this);
        setTimeout(function () {
            $(span).css({'visibility': 'visible'});
        }, interval * index);
    });
}

/* Calcul le temps passé depuis une date jusqu'a aujourd'hui */
function getInterval(strDate) {
    var oldDate = new Date(strDate.substring(6, 10) + '-' + strDate.substring(3, 5) + '-' + strDate.substring(0, 2) + "T00:00:00Z");
    var date = new Date();
    var jour = 0;
    var mois = 0;
    var annee = 0;
    if (oldDate.getTime() <= date.getTime()) {
        jour = date.getDate() >= oldDate.getDate() ? date.getDate() - oldDate.getDate() : date.getDate() + nbJour(oldDate.getMonth(), oldDate.getFullYear()) - oldDate.getDate();
        mois = date.getMonth() >= oldDate.getMonth() ? date.getMonth() - oldDate.getMonth() : date.getMonth() + 12 - oldDate.getMonth();
        mois = date.getDate() >= oldDate.getDate() ? mois : (mois - 1 >= 0 ? mois - 1 : mois - 1 + 12);
        annee = date.getFullYear() - oldDate.getFullYear();
        annee = date.getMonth() > oldDate.getMonth() || (date.getMonth() === oldDate.getMonth() && date.getDate() >= oldDate.getDate()) ? annee : annee - 1;
    }
    return {jour: jour, mois: mois, annee: annee};
}

/* Calcul le nombre de jour dans le mois et selon les annees bisextilles */
function nbJour(mois, annee) {
    var nbJour = 0;
    if (mois === 2) {
        if (annee % 4 === 0 && annee % 100 !== 0 || annee % 400 === 0) {
            nbJour = 29;
        } else {
            nbJour = 28;
        }
    } else if (mois === 4 || mois === 6 || mois === 9 || mois === 11) {
        nbJour = 30;
    } else {
        nbJour = 31;
    }
    return nbJour;
}

/* Fonction permettant d'activer le bon onglet du menu au fur et a mesure que l'on se deplace dans la page */
function menuScroll() {
    var position = $(this).scrollTop();
    var precedent = 0;
    var total = $('.nav-sidebar li>a').length;
    $('.nav-sidebar li>a').each(function (index) {
        var lien = $(this).attr('href');
        if ($(lien).length !== 0) {
            var pos = $(lien).offset().top + $(lien).outerHeight() - 50; // On soustrait la taille du menu
            if (position >= precedent && position < pos) {
                $(this).parent().addClass('active');
            } else if (position >= precedent && index + 1 === total) {
                $(this).parent().addClass('active');
            } else {
                if ($(this).parent().hasClass('active')) {
                    $(this).parent().removeClass('active');
                }
            }
            precedent = pos;
        }
    });
}

/* Fonction permettant d'affiche la galerie differement selon la taille de l'ecran et le cookie enregistre */
function gallery(gallery_mode) {
    if ($('#galerie .btn-group').css('display') !== 'none' && gallery_mode !== "standard") {
        $('#galerie_vitrine').parent().addClass('disabled');
        $('#galerie_standard').parent().removeClass('disabled');
        if ($('.gallery').find('.carousel-gallery').length === 0) {
            $('.gallery a').unwrap();
            $('.gallery').addClass('gallery-perspective');
            $('.gallery a').wrapAll('<div class="carousel-gallery" />');
        }
    } else {
        $('#galerie_standard').parent().addClass('disabled');
        $('#galerie_vitrine').parent().removeClass('disabled');
        if ($('.gallery').find('.carousel-gallery').length !== 0) {
            $('.gallery a').unwrap();
            $('.gallery').removeClass('gallery-perspective');
            $('.gallery a').wrap('<div class="col-tn-12 col-xs-6 col-sm-4 col-md-3 col-lg-2" />');
        }
    }
}