var React=require("react");
var store=require("./store");
var actions=require("./actions");
var Reflux=require("reflux");
var ucs2string=require("glyphemesearch").ucs2string;
var getutf32=require("glyphemesearch").getutf32;
var KageGlyph=require("./kageglyph");
var E=React.createElement;
var useKage=require("./usekage");
var styles={candidates:{outline:0,cursor:"pointer"}};
var fontserverurl="http://chikage.linode.caasih.net/exploded/?inputs=";

//window.Promise=require("promise-polyfill");
require("whatwg-fetch");
var Candidates=React.createClass({
	mixins:[Reflux.listenTo(store,"onData")]
	,getInitialState:function(){
		return {candidates:[],joined:[]};
	}
	,fontcache:{} //buhins already in memory
	,loading:[] //loading buhins

	,load:function(buhins) {
		var that = this;
		var data = {};
		var k;

		for (k in buhins) {
			data[k] = buhins[k].replace(/@\d+/g, ""); //workaround @n at the end
		}
		KageGlyph.loadBuhins(data);
		this.loading.forEach(function(glyph){
			console.log(glyph);
			that.fontcache[glyph]=true
		});
		this.loading=[];
		this.fontdataready=true;
		this.setState({candidates:this.renderCandidates(this.state.searchresult)});

		return;
	}
	,loadFromServer:function() {
		var url=fontserverurl+this.loading.join("");
		fetch(url)
			.then(function(response){ return response.json(); })
			.then(this.load);
	}
	,renderCandidates:function(searchresult) {
		var o=[];
		for (var i=0;i<searchresult.length;i++) {
			var glyph=ucs2string(searchresult[i]);
			if (useKage(searchresult[i])){
				if (this.fontcache[glyph]) {
					o.push(E(KageGlyph,{key:i,glyph:"u"+searchresult[i].toString(16)}));
				} else {
					this.loading.push(glyph);
				}
			} else {
				o.push(glyph);
			}
		}
		if (this.loading.length) {
			this.loadFromServer();
		}
		return o;
	}

	,onData:function(data) {
		this.fontdataready=false;
		this.setState({searchresult:data,candidates:this.renderCandidates(data)});
	}
	,isHighSurrogate:function(code) {
		return code>=0xD800 && code<=0xDBFF;
	}
	,getGlyphInfo:function(glyph) {
		this.props.action("selectglyph",glyph);
	}
	,onselect:function(e) {
		var svglabel=e.target.parentNode.attributes["label"];
		if (svglabel) svglabel=ucs2string(parseInt("0x"+svglabel.value.substr(1)));

		var selChar=svglabel||e.target.innerText;
		
		if (selChar) {
			if (this.prevSelected) this.prevSelected.style.background="silver";
			e.target.style.background="yellow";
			this.prevSelected=e.target;
			this.getGlyphInfo(selChar);
		}
	}
	,render:function() {
		return E("span",{ref:"candidates",
			onMouseUp:this.onselect,onTouchTap:this.onselect,
			style:styles.candidates},this.state.candidates);
	}
});
module.exports=Candidates;
