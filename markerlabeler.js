/* edit the interface */
var dotdiv = document.createElement("div");
dotdiv.innerHTML = "Red <input id='red_add_text' type='text' size='8'/> Blue <input id='blue_add_text' size='8'/><input type='button' onclick='plotDots()' value='Plot Dots'/>";
document.getElementsByClassName("atlas_inputs")[0].appendChild(dotdiv);

var tileCanvas = document.createElement("canvas");
tileCanvas.width = 256;
tileCanvas.height = 256;
tileCanvas.style.display = "none";
document.body.appendChild(tileCanvas);
var tileCtx = tileCanvas.getContext("2d");

function MarkerNotePlus(map, post_url)
{
    var marker_width = 30;
    var marker_height = 30;
        
    this.location = map.getCenter();
    
    var data = this.data = {
        'lat': this.location.lat,
        'lon': this.location.lon,
        'marker_number': markerNumber,
        'user_id': current_user_id,
        'note': ''
    };
    
    this.location = map.getCenter();
                            
    var div = document.createElement('div');
    div.className = 'marker';
        
    this.img = document.createElement('img');
    this.img.src = 'http://i.imgur.com/fxQyD.png';
    div.appendChild(this.img);
                                   
    var submitNote = function()
    {
        if (new_marker_text_area.value.trim() == ''){
            alert('Please fill out your note!');
            return false;
        } else {
            reqwest({
                url: post_url,
                method: 'post',
                data: data,
                type: 'json',
                error: function(err) {
                    console.log('error', err);
                },
                success: function (resp) {
                  /* console.log('resp', resp); */
                  changeMarkerDisplay(resp);
                }
            });
            
            active_marker = false;
            note_displayed = false;
            
            return false; 
        }
    }
    
    var changeMarkerDisplay = function(resp)
    {
        new_marker_text_area.value = '';
        
        div.parentNode.removeChild(div);
        
        var new_marker_note = document.getElementById('new_marker_note');
        new_marker_note.className = 'hide';
    
        var note = resp.note_data;
        
        if (!note.username)
        {
            note.username = 'Anonymous';
        }
        
        addSavedNote(note.note,note.username,note.created,note.marker_number,note.latitude,note.longitude);
    }
    
    var removeMarkerNote = function()
    {                    
        div.parentNode.removeChild(div);
        
        var editable_new_note = document.getElementById('new_marker_note');
        editable_new_note.className = 'hide'; 
        
        active_marker = false;
        note_displayed = false;
    }
        
    var input_lat = document.createElement('input');
    input_lat.value = this.location.lat.toFixed(6);
    input_lat.type = 'hidden';
    input_lat.name = 'marker[' + markerNumber + '][lat]';
    div.appendChild(input_lat);
    
    var input_lon = document.createElement('input');
    input_lon.value = this.location.lon.toFixed(6);
    input_lon.type = 'hidden';
    input_lon.name = 'marker[' + markerNumber + '][lon]';
    div.appendChild(input_lon);
    
    var scan_id = document.createElement('input');
    scan_id.value = scan_id;
    scan_id.name = 'marker[' + markerNumber + '][scan_id]';
    scan_id.type = 'hidden';
    div.appendChild(scan_id);
    
    var user_id = document.createElement('input');
    user_id.value = current_user_id;
    user_id.name = 'marker[' + markerNumber + '][scan_id]';
    user_id.type = 'hidden';
    div.appendChild(user_id);
    
    markerNumber--;
    
    /* make it easy to drag */
    
    this.img.onmousedown = function(e)
    {
        if (active_polygon != -1 || (active_marker && !note_displayed) || draw_mode)
        {
            return;
        }
        
        active_marker = true;
        
        note_displayed = true;
        
        var ok_button = document.getElementById('new_marker_ok_button');
        ok_button.onclick = submitNote;
        
        var remove_button = document.getElementById('new_marker_delete_button');
        remove_button.onclick = removeMarkerNote;
        
        var editable_new_note = document.getElementById('new_marker_note');
        editable_new_note.className = 'show';
        
        var editable_new_note_textarea = document.getElementById('new_marker_textarea');
        
        editable_new_note_textarea.onchange = function () {
            data.note = this.value;
        };
        
        /* var marker_width = 30; */
        var offsetY = 5;
        
        editable_new_note.style.position = "absolute";
        editable_new_note.style.left = div.offsetLeft - .5*editable_new_note.offsetWidth + .5*marker_width + 'px';
        editable_new_note.style.top = div.offsetTop - editable_new_note.offsetHeight - offsetY + 'px';
        
        var marker_start = {x: div.offsetLeft, y: div.offsetTop},
            mouse_start = {x: e.clientX, y: e.clientY};
        
        var note_start = {x: editable_new_note.offsetLeft, y: editable_new_note.offsetTop};
        
        document.onmousemove = function(e)
        {   
            var mouse_now = {x: e.clientX, y: e.clientY};
        
            div.style.left = (marker_start.x + mouse_now.x - mouse_start.x) + 'px';
            div.style.top = (marker_start.y + mouse_now.y - mouse_start.y) + 'px';
            
            editable_new_note.style.left = (note_start.x + mouse_now.x - mouse_start.x) + 'px';
            editable_new_note.style.top = (note_start.y + mouse_now.y - mouse_start.y) + 'px';
        }
        
        return false;
    }
    
    var marker = this;
    
    this.img.onmouseup = function(e)
    {                                   
        var marker_end = {x: div.offsetLeft + .5 * marker_width, y: div.offsetTop + .5 * marker_height};
        
        marker.location = map.pointLocation(marker_end);
        
        data.lat = marker.location.lat.toFixed(6);
        data.lon = marker.location.lon.toFixed(6);
    
        document.onmousemove = null;
        return false;
    }
    
    /* add it to the map */
    
    this.updatePosition = function()
    {
        /* console.log(marker_width, marker_height); */
        var point = map.locationPoint(marker.location);
        
        div.style.left = point.x + - .5 * marker_width + 'px';
        div.style.top = point.y - .5 * marker_height + 'px';
    }
                            
    map.addCallback('panned', this.updatePosition);
    map.addCallback('zoomed', this.updatePosition);
    this.updatePosition();
        
    return [this, div];
}

var reddots = [ ];
var bluedots = [ ];
var markersToSave = [ ];

function plotDots(){
	/* collect the most zoomed-in tiles from the scan */
	var zoomimgs = document.getElementsByTagName("img");
	var maxzoom = 0;
	var maxzoomitems = [ ];
	for(var z=0; z<zoomimgs.length; z++){
		if(zoomimgs[z].src.split('/').length > 7){
			if(zoomimgs[z].src.split('/')[4] == "scans"){
				if(zoomimgs[z].src.split('/')[6] > maxzoom){
					maxzoom = zoomimgs[z].src.split('/')[6];
					maxzoomitems = [ zoomimgs[z] ];
				}
				else if(zoomimgs[z].src.split('/')[6] == maxzoom){
					maxzoomitems.push( zoomimgs[z] );
				}
			}
		}
	}
	reddots = [ ];
	bluedots = [ ];
	markersToSave = [ ];

	for(var mz=0;mz<maxzoomitems.length;mz++){
		tileCtx.drawImage(maxzoomitems[mz], 0, 0, 256, 256);
		var imgData = tileCtx.getImageData(0, 0, 256, 256);
		for(var x=0; x<256; x++){
			for(var y=0; y<256; y++){
				var r = imgData.data[y*4*256+x*4];
				var g = imgData.data[y*4*256+x*4+1];
				var b = imgData.data[y*4*256+x*4+2];
				var a = imgData.data[y*4*256+x*4+3];
				if((r > 160 && g < 80 & b < 80) || (r > 150 && g < 70 & b < 70) || (r > 110 && g < 60 & b < 60) || ( r > 140 && g < 90 && b < 110 )){
					/* red dot */
					var transform = maxzoomitems[mz].style.webkitTransform.split(",");
					reddots.push([ (transform[12] * 1 + x)  , (transform[13] * 1 + y) ]);
				}
				else if( ( r < 90 && g < 110 & b > 150 ) || (r < 50 && g < 50 && b > 80) ){
					/* blue dot */
					var transform = maxzoomitems[mz].style.webkitTransform.split(",");
					bluedots.push([ (transform[12] * 1 + x)  , (transform[13] * 1 + y) ]);
				}
			}
		}
	}
	
	var existingMarkers = document.getElementsByClassName("marker");

	for(var rd=0;rd<reddots.length;rd++){
		/* reduce red dots so they must be >10px from each other */
		var nearRed = false;
		for(var r2=0;r2<rd;r2++){
			var dist = Math.pow((reddots[rd][0] - reddots[r2][0]),2) + Math.pow((reddots[rd][1] - reddots[r2][1]), 2);
			if(dist < 100){
				nearRed = true;
				break;
			}
		}
		if(nearRed){
			continue;
		}
		/* don't overlap with existing markers
		var nearMarker = false;
		for(var m2=0;m2<existingMarkers.length;m2++){
			var markxy = [ existingMarkers[m2].style.left.replace("px","") * 1, existingMarkers[m2].style.top.replace("px","") * 1];
			var dist = Math.pow((reddots[rd][0] - markxy[0]),2) + Math.pow((reddots[rd][1] - markxy[1]), 2);
			if(dist < 100){
				nearMarker = true;
				break;
			}
		}
		if(nearMarker){
			continue;
		}*/
		var myloc = map.pointLocation( { x: reddots[rd][0], y: reddots[rd][1] } );
		mark(myloc, { title: "Red - " + document.getElementById("red_add_text").value, icon: "http://i.imgur.com/fxQyD.png" });
	}

	for(var rd=0;rd<bluedots.length;rd++){
		/* reduce blue dots so they must be >10px from each other */
		var nearBlue = false;
		for(var r2=0;r2<rd;r2++){
			var dist = Math.pow((bluedots[rd][0] - bluedots[r2][0]),2) + Math.pow((bluedots[rd][1] - bluedots[r2][1]), 2);
			if(dist < 100){
				nearBlue = true;
				break;
			}
		}
		if(nearBlue){
			continue;
		}
		/* don't overlap with existing markers
		var nearMarker = false;
		for(var m2=0;m2<existingMarkers.length;m2++){
			var markxy = [ existingMarkers[m2].style.left.replace("px","") * 1, existingMarkers[m2].style.top.replace("px","") * 1];
			var dist = Math.pow((reddots[rd][0] - markxy[0]),2) + Math.pow((reddots[rd][1] - markxy[1]), 2);
			if(dist < 100){
				nearMarker = true;
				break;
			}
		}
		if(nearMarker){
			continue;
		}*/
		var myloc = map.pointLocation( { x: bluedots[rd][0], y: bluedots[rd][1] } );
		/* if */
		mark(myloc, {title:"Blue - " + document.getElementById("blue_add_text").value, icon:"http://placematters.net/ESRImap/images/geolocation_icon.png"});
	}

	saveMarkers(0);
}

function mark(myloc, mykey){
	var marker_width = 30;
    var marker_height = 30;
    
    changeNoteButtonStyle('marker'); 
    
    var markerInfo = new MarkerNotePlus(map, post_url);
    var markerSelf = markerInfo[0];
    var markerDiv = markerInfo[1];
    document.getElementById('marker-container').appendChild(markerDiv);

	markerSelf.location = myloc;
	markerSelf.data.lat = markerSelf.location.lat.toFixed(6);
	markerSelf.data.lon = markerSelf.location.lon.toFixed(6);
	if(mykey.icon){
		markerSelf.img.src = mykey.icon;
	}
	if(mykey.title){
		markerSelf.data.note = mykey.title;
	}
	markerSelf.updatePosition();
	
	markersToSave.push( markerSelf );

	/* console.log(markerSelf); */
}

function saveMarkers(m_index){
	reqwest({
        url: post_url,
		method: 'post',
		data: markersToSave[ m_index ].data,
		type: 'json',
		error: function (err) {
			console.log('error', err);
		},
		success: function (resp) {
			if(m_index >= markersToSave.length - 1){
				console.log("finished saving");
				location.reload(true);
			}
			else{
	            saveMarkers(m_index + 1);
	        }
		}
	});
}