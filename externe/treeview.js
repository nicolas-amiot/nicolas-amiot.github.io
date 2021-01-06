(function($){
	
	$.fn.extend({
		treeview: function(param) {
			
			// Treeview core
			$(this).find("li:has(ul)").each(function() {
				// Wrap text with span
				$(this).contents().filter(function() {
					return this.nodeType == 3; //Node.TEXT_NODE
				}).wrap("<span class='tv-caret'>");
				// Hide childrens ul
				$(this).children("ul").hide();
				
				// Click on the span
				$(this).children(".tv-caret").click(function() {
					var ul = $(this).parent("li").children("ul");
					if(ul.is(":hidden")) {
						ul.show();
						$(this).addClass("active");
					} else {
						ul.hide();
						$(this).removeClass("active");
					}
				});
			});
			
			// Treeview option
			if(param != undefined) {
				
				// Name used for the input
				var name = "treeview";
				if(param.name != undefined && param.name.trim() != "") {
					name = param.name
				}
				
				// Specifies the li child number
				if(param.childNumber == true) {
					$(this).find("li:has(ul)").each(function() {
						var caret = $(this).children(".tv-caret");
						caret.html(caret.text() + " <span class='amount'>(" + $(this).children("ul").children("li").length + ")</span>");
					});
				}
				
				// Transform the li final
				if(param.type == "link") {
					$(this).find("li:not(:has(ul))").each(function() {
						$(this).wrapInner("<a href='#'></a>");
					});
				} else if(param.type == "checkbox") {
					$(this).find("li:not(:has(ul))").each(function() {
						var value = $(this).text();
						var key = value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accent
						key = key.substring(0, 1).toLowerCase() + key.substring(1);
						key = key.replace(/[_-\s]([a-z])/g, function(v) { return v.toUpperCase(); });
						key = key.replace(/[^a-zA-Z]/g,"");
						$(this).html("<input type='checkbox' id='" + key + "' name='" + name + "' value='" + value + "'>&nbsp;<label for='" + key + "'>" + value + "</label>");
					});
				} else if(param.type == "radio") {
					$(this).find("li:not(:has(ul))").each(function() {
						var value = $(this).text();
						var key = value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accent
						key = key.substring(0, 1).toLowerCase() + key.substring(1);
						key = key.replace(/[_-\s]([a-z])/g, function(v) { return v.toUpperCase(); });
						key = key.replace(/[^a-zA-Z]/g,"");
						$(this).html("<input type='radio' id='" + key + "' name='" + name + "' value='" + value + "'>&nbsp;<label for='" + key + "'>" + value + "</label>");
					});
				}
				
			}
			
		}
	});
	
})(jQuery);