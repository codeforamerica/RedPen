/* collect the markers and restyle them
 catch new markers and give them the same style */
 
var markers = document.getElementsByClassName("marker");
var markerLength = 0;
setInterval( function(){
	if( markers.length > markerLength ){
		var oldMarkerLength = markerLength;
		markerLength = markers.length;
		for(var m=oldMarkerLength; m<markers.length; m++){
			markers[m].children[0].src = "http://i.imgur.com/fxQyD.png";
			markers[m].children[0].onmouseover = function(e){
				if (active_polygon == -1 && !active_marker && !draw_mode){

					if(data.created){
						var date = new Date(data.created*1000);
						var day = date.getDate();
						var month = date.getMonth();
						var year = date.getFullYear();

						var formatted_date = (parseInt(month) + 1) + '/' + day + '/' + year;

						saved_note.innerHTML = data.note + '<br><br>' + user + ', ' + formatted_date;
					}
					else{
						saved_note.innerHTML = data.note;
					}

					var offsetY = 5;

					saved_note.className = 'show';
					saved_note.style.position = "absolute";
					saved_note.style.left = div.offsetLeft - .5*saved_note.offsetWidth + .5*marker_width + 'px';
					saved_note.style.top = div.offsetTop - saved_note.offsetHeight - offsetY + 'px';
				}
				else{
					this.img.style.cursor = 'default';
				}
			};
			markers[m].children[0].onmouseout = function(e){
				if (active_marker) {
					return;
				}
				this.img.style.cursor = 'move';
				if (saved_note.className = 'show'){
					saved_note.className = 'hide';
				}
			};
		}
	}
}, 250);

/* have marker tool match new marker icon */
document.getElementById("marker_button").style.background = 'url("http://i.imgur.com/fxQyD.png") no-repeat';