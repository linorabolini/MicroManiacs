define(function (require) {
    'use strict';

    return function a(b,c,d,e){function f(){var a=this,f={};a.on=function(a,b){(f[a]||
	(f[a]=[])).push(b)},a.trigger=function(a,b){for(var c=f[a],d=0;c&&d<c.length;)c
	[d++](b)},a.off=function(a,b){for(d=f[a]||[];b&&(c=d.indexOf(b))>-1;)d.splice(c
	,1);f[a]=b?d:[]};for(c in b)d=b[c],a[c]=typeof d=="function"?function(){return(
	d=this.apply(a,arguments))===e?a:d}.bind(d):d;a.init&&a.init.apply(a,arguments)
	}return f.extend=function(f){d={};for(c in b)d[c]=b[c];for(c in f)d[c]=f[c],b[c
	]!==e&&(d["__"+c]=b[c]);return a(d)},f};

});