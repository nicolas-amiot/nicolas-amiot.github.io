(function($){
	
	var settings = {
		format: {
			numeric: "[0-9]",
			alphabetic: "[A-Za-z]",
			alphanumeric: "[0-9A-Za-z]"
		},
		character: '*',
		placeholder: '_'
	};
	
	$.fn.extend({
		mask: function() {
			var input = this;
			var regex = getRegex(input.attr("data-format"));
			var placeholder = getPlaceholder(input.attr("data-placeholder"), regex);
			var mask = getMask(input.attr("data-mask"), placeholder, regex);
			var remove = false;
			
			if(mask != undefined) {
				input.attr('maxlength', mask.length);
				input.wrap( "<div class='placeholders' data-placeholders='" + mask +"'></div>" );
				
				input.keydown(function(e) {
					var code = e.which;
					/*  code 8 =  BACKSPACE, code 48 = SUPPR */
					remove = (code == 8 || code == 46);
				});
				input.keypress(function(e) {
					var code = e.which;
					/*  Certain navigateur (firefox) passe par cet evenement malgré que la saisie n'imprime aucun caractère.
						Pour n'importe quel navigateur, la touche espace (code 13) est prise en compte par le keypress */
					if(!e.ctrlKey && !e.altKey && !e.metaKey && e.shiftKey && code >= 32) {
						var key = String.fromCharCode(e.which);
						var size = input.val().length;
						/*  Accepte la saisie si la touche correspond au format ou au caractère fixe à cette position  */
						if(!regex.test(key) && mask.charAt(size) != placeholder && key != mask.charAt(size)) {
							e.preventDefault();
						}
					}
				});
				input.on('input', function() {
					var size = input.val().length;
					for(i = -1; i < size; i++) {
						/* 	Supprime les caractères indésirables dû au copier coller ou au décalage lors de la suppression  */
						if(i != -1 && mask.charAt(i) == placeholder && !regex.test(input.val().charAt(i))) {
							input.val(input.val().substr(0, i) + input.val().substr(i + 1, size));
							size--;
							i--;
						}
						/* 	Ajoute les caractères fixes non présents une fois les caractères précédents renseignés
							excepté si on essaye de supprimer le dernier caractère alors qu'il s'agit d'un caractère fixe */
						if(mask.charAt(i + 1) != placeholder && input.val().charAt(i + 1) != mask.charAt(i + 1)) {
							if(i != size - 1 || !remove) {
								input.val(input.val().substr(0, i + 1) + mask.charAt(i + 1) + input.val().substr(i + 1, size));
								size++;
							}
						}
					}
					/*  Supprime les caractères en trop lors de l'ajout des caractères fixes */
					if(size > mask.length) {
						input.val(input.val().substr(0, mask.length));
					}
					input.parent().attr("data-placeholders", getFullPlaceholder(size, mask));
				});
			}
		}
	});
	
	function replace(string, oldChar, newChar) {
		var pattern = new RegExp("\\" + oldChar, 'g');
		return string.replace(pattern, newChar);
	}
	
	function getMask(mask, placeholder, regex) {
		if(mask.indexOf(placeholder) >= 0) {
			console.log("Don't use the placeholder character '" + placeholder + "' in your mask");
			return undefined;
		}
		if(mask.indexOf(settings.character) == -1) {
			console.log("Put at least 1 definition character : " + settings.character);
			return undefined;
		}
		return replace(mask, settings.character, placeholder);
	}
	
	function getRegex(format) {
		var regex = settings.format[format];
		if(regex == undefined) {
			regex = settings.format["alphanumeric"];
		}
		return new RegExp(regex);
	};
	
	function getPlaceholder(placeholder, regex) {
		if(placeholder != undefined && placeholder.length == 1 && !regex.test(placeholder)) {
			return placeholder;
		}
		return settings.placeholder;
	};
	
	function getFullPlaceholder(index, mask) {
		var placeholder = "";
		for(i = 0; i < index; i++) {
			placeholder += " ";
		}
		placeholder += mask.substring(index, mask.length);
		return placeholder;
	};
	
})(jQuery);