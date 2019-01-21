/*
*   Data sent from CasparCG Client as templateData
*   is pushed into corresponding HTML id element
*
*   Usage:
*   insert a script reference in the HTML template header.
*   ex: <script type="text/javascript" src="CasparCG.js"></script>
*   Make sure that the id that you refer to is the innermost tag.
*   Everything within that tag id will be replaced by the value sent from CasparCG
*   
*   put together by Tomas Linden
*
*
   Structure of data sent from CasparCG:
   <templateData>
      <componentData id="#idCaspar#">
         <data id="text" value="#valCaspar#" />
      </componentData>
      :
      :
      <componentData id="#idCaspar#">
         <data id="text" value="#valCaspar#" />
      </componentData>
   </templateData>
*/
// Global variable for data from CasparCG
var dataCaspar = {};


// Replace characters that could become a problem if left as is
function escapeHtml(unsafe) {
   return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}


// Parse templateData into an XML object
function parseCaspar(str)   {
   var xmlDoc;
   if (window.DOMParser)   {
      parser=new DOMParser();
      xmlDoc=parser.parseFromString(str,"text/xml");
   }
   dataCaspar = XML2JSON(xmlDoc.documentElement.childNodes);
}


// Make the XML templateData message into a more simple key:value object
function XML2JSON(node)   {
   var data = {};   // resulting object
   for (k=0;k<node.length;k++)   {
      var idCaspar = node[k].getAttribute("id");
      var valCaspar = node[k].childNodes[0].getAttribute("value");
      if ( idCaspar != undefined && valCaspar != undefined)   { data[idCaspar] = valCaspar; };
   }
   return data;
}


// Main function to insert data
function dataInsert(dataCaspar)   {
   for (var idCaspar in dataCaspar) {
      var idTemplate = document.getElementById(idCaspar);
      if (idTemplate != undefined)   { idTemplate.innerHTML = escapeHtml(dataCaspar[idCaspar]); }
   }
}


// insert data from CasparCg client when activated
function play(str) {
   parseCaspar(str);   // Parse templateData into an XML object
   dataInsert(dataCaspar);   // Insert data
   startAnim ();
}


// Call for a stop from CasparCG client
function stop () {
	stopAnim();
}


// Call for a update of data from CasparCG client
function update(str) {
   parseCaspar(str);   // Parse templateData into an XML object
   dataInsert(dataCaspar);   // Insert data
}

function startAnim () {
	var divs = document.querySelectorAll("[id^='text']");
	var tl = new TimelineMax();
   tl.to(divs, 0.5, {ease: Power3.easeInOut, opacity:1.0});
   tl.to(divs, 0.5, {ease: Power3.easeInOut, scale:1.0}, '-=0.4');
   tl.to(divs, 4.0, {backgroundSize:'100% 100%', yoyo:true, repeat:-1}, '-=0.5');
}

function stopAnim () {
	var divs = document.querySelectorAll("[id^='text']");
	var tl = new TimelineMax();
	tl.to(divs, 0.5, {ease: Power3.easeInOut, scale:0.0});
	tl.to(divs, 0.5, {ease: Power3.easeInOut, opacity:0}, '-=0.4');
	tl.to(divs, 1.0, {backgroundSize:'400% 100%'}, '-=0.5');

}