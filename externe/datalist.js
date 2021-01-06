(function($){
	
	$.fn.extend({
		datalist: function() {
			
			// Constante
			const DEFAULT = "default";
			const EXACT = "exact";
			
			// Activation
			var enabled = true;
			
			// Elements
			var datalist = $(this);
			var input = $("input[list=" + datalist.attr("id") +"]");
			var options = datalist.children("option");
			
			// Traitement des attributs
			var character = datalist.attr("data-character");
			var match = datalist.attr("data-match").toLowerCase();
			if(match != DEFAULT && match != EXACT) {
				match = DEFAULT;
			}
			if(character == undefined) {
				character = 1;
			}
			
			// Met à jour le fonctionnement de la datalist une première fois
			updateDataList();
			
			// A chaque fois que la valeur de l'input change, on met a jour la datalist selon les cas
			input.on('input', function(e) {
				updateDataList();
			});
			
			function updateDataList() {
				// Vide la liste des choix si l'utilisateur n'a pas tapé suffisament de caractère
				if(input.val().length < character) {
					if(enabled) {
						options.each(function() {
							$(this).prop("disabled", true);
						});
						enabled = false;
					}
				// Sinon si le nombre de caractère est suffisant...
				} else {
					// Et que l'on est par défault, on laisse le navigateur affiché les choix qui correspondent
					if(match == DEFAULT) {
						if(!enabled) {
							options.each(function() {
								$(this).prop("disabled", false);
							});
							enabled = true;
						}
					// Et que l'on est en profil exact, on affiche seulement les choix qui commence par la valeur saisie
					} else if(match == EXACT) {
						options.each(function() {
							if($(this).val().trim().toLowerCase().startsWith(input.val().toLowerCase())) {
								$(this).prop("disabled", false);
							} else {
								$(this).prop("disabled", true);
							}
						});
						enabled = true;
					}
				}
			}
			
		}
	});
	
})(jQuery);