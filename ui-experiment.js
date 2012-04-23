/* collect the markers and restyle them
 catch new markers and give them the same style */

var notebar = document.createElement("div");
notebar.style.position = "absolute";
notebar.style.left = "8px";
notebar.style.top = "230px";
notebar.style.zIndex = 999;
notebar.style.maxHeight = "400px";

function bindNote(listitem, index){
	listitem.onmouseover=function(){
		document.getElementsByClassName("marker")[index].children[0].onmouseover();
	};
	listitem.onmouseout=function(){
		document.getElementsByClassName("marker")[index].children[0].onmouseout();
	};
	listitem.onclick=function(){
		document.getElementsByClassName("marker")[index].children[0].onmousedown();
	}
}

var noteviewer = document.createElement("ul");
for(var n=0;n<notes.length;n++){
	var noteadd = document.createElement("li");
	noteadd.style.listStyleType = "none";
	noteadd.style.backgroundColor = "#fff";
	noteadd.style.margin = "4px";
	noteadd.style.padding = "4px";
	bindNote(noteadd, n);
	noteadd.innerHTML = notes[n].note;
	noteviewer.appendChild(noteadd);
}
notebar.appendChild(noteviewer);

document.body.appendChild(notebar);