

function create(parent) {
  var F = function() {};
  F.prototype = parent;
  return new F();
}


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function include(url){
  var element;
 switch(url.split(".").pop()){
   case "css":{
     element=document.createElement("link");
     element.setAttribute("rel","stylesheet");
     element.setAttribute("type","text/css")
     element.setAttribute("href",url)
   }break;
   case "js":{
     element=document.createElement("script");
     element.setAttribute("language","javascript")
     element.setAttribute("src",url)
   }break;
   default:window.console && window.console.error("could not identify",url,"skip include");return;
 }
 var head=document.querySelector("head");
 if(head.innerHTML.indexOf(element.outerHTML)!=-1){
   window.console && window.console.warn("Duplicate include, skipping:",url);
 }else{
   head.appendChild(element);
 }
}
function makeFullClient(e){
    e.style.position = "fixed";
    e.style.top = 0 + "px";
    e.style.left = 0 + "px";
    e.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    e.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);    
}
