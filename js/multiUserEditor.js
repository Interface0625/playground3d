

# Shared Editor:


client:
	var EDITOR = {
		CONTENT: [],
		INSERT: function(){},
		DELETE: function(){},
		MODIFY: function(){}
	};
	setInterval(function(){
		xhrGet("user@server/documentChanges", function(){
			if(this.response == "None") {return;}
			applyChanges(this.response);
		});
	}, 5000);
	var applyChanges = function(changesTxt){
		var changes = JSON.parse(chagesTxt);
		for(c in chages){
			var obj = changes[c];
			switch(c){
				case "insert": 
					for(var i = 0; i < obj.length; i++){
						EDITOR.INSERT(
							obj[i]["lineno"],
							obj[i]["Line Content"]
						);	
						// obj[i]["dt"]
						// pressing return, copy/pasting, ctrl+v
						// and drag/drop inserts new lines.
					}
					break;
				case "delete": 
					for(var i = 0; i < obj.length; i++){
						EDITOR.DELETE(
							obj[i]["lineno"],
							obj[i]["dt_stamp"]
						);
						// pressing delete / backspace could do it,
						// pressing ctrl+x could do it,
						// and drag/drop deletes lines.
					}
					break;
				case "modify": 
					for(var i = 0; i < obj.length; i++){
						EDITOR.MODIFY(
							obj[i]["lineno"],
							obj[i]["Line Content"]
						);
						// obj[i]["dt_stamp"]
						// typing, copy/pasting, ctrl+v
						// drag/drop and pressing backspace, delete
						// modifies the line.
					}
					break;
				default: break;
			}
		}
	}




