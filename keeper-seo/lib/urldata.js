'use strict';var _createClass=function(){function a(b,c){for(var f,d=0;d<c.length;d++)f=c[d],f.enumerable=f.enumerable||!1,f.configurable=!0,'value'in f&&(f.writable=!0),Object.defineProperty(b,f.key,f)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();function _asyncToGenerator(a){return function(){var b=a.apply(this,arguments);return new Promise(function(c,d){function f(g,h){try{var j=b[g](h),k=j.value}catch(l){return void d(l)}return j.done?void c(k):Promise.resolve(k).then(function(l){f('next',l)},function(l){f('throw',l)})}return f('next')})}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}var Fslog=require('keeper-core'),logger=new Fslog,Mytime=require('keeper-core/lib/time'),mytime=new Mytime,Fscache=require('keeper-core/cache/cache'),cache=new Fscache,Tmall=require('../work/tmall'),tmall=new Tmall,Taobao=require('../work/taobao'),_taobao=new Taobao,InitJs=function(){function a(){_classCallCheck(this,a)}return _createClass(a,[{key:'taobao',value:function(){var c=_asyncToGenerator(regeneratorRuntime.mark(function d(f,g,h,j,k,l){var m=this;return regeneratorRuntime.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt('return',new Promise(function(){var p=_asyncToGenerator(regeneratorRuntime.mark(function q(r){var s,t,u,v,w,x,y;return regeneratorRuntime.wrap(function(A){for(;;)switch(A.prev=A.next){case 0:return s='',t=!1,u=!1,v={},A.next=6,f.newPage();case 6:return w=A.sent,A.next=9,w.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36');case 9:return x=h.substr(h.lastIndexOf('?')+1),A.prev=10,y=function(){var B=_asyncToGenerator(regeneratorRuntime.mark(function C(D){var E,F,G,H,I;return regeneratorRuntime.wrap(function(K){for(;;)switch(K.prev=K.next){case 0:if(D+=1,60<D&&(s='Failed',r(s),logger.myconsole('Wait cont failed!'.red)),s){K.next=6;break}setTimeout(function(){y(D)},100),K.next=25;break;case 6:if(t=!0,E=void 0,!u){K.next=15;break}return F='https://detail.m.tmall.com/item.htm?'+x,K.next=12,tmall.tmall(f,g,F,!0,k,l);case 12:E=K.sent,K.next=20;break;case 15:return G=x.substr(x.indexOf('=')+1),H='https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=itemNumId%22%3A%22'+G+'%2C',K.next=19,_taobao.taobao(f,g,H,!0,k,l);case 19:E=K.sent;case 20:s+=E,I=E&&'Analysis failed!'!==E&&'changeip'!==E&&'Product is missing!'!==E,j&&I&&cache.writecache(s,h,g),v.apidata=I?'success':'Failed',r(s);case 25:case'end':return K.stop();}},C,m)}));return function(){return B.apply(this,arguments)}}(),w.on('response',function(){var B=_asyncToGenerator(regeneratorRuntime.mark(function C(D){return regeneratorRuntime.wrap(function(F){for(;;)switch(F.prev=F.next){case 0:if(t){F.next=15;break}if(-1===D.url().indexOf(x)){F.next=15;break}return F.prev=2,F.next=5,D.text();case 5:return s+=F.sent,u=-1!==D.url().indexOf('detail.tmall.com/item.htm?'),F.next=9,y(0);case 9:F.next=15;break;case 11:F.prev=11,F.t0=F['catch'](2),logger.myconsole(F.t0+' '+k),logger.myconsole(D.url().yellow);case 15:case'end':return F.stop();}},C,m,[[2,11]])}));return function(){return B.apply(this,arguments)}}()),A.next=15,w.goto(h);case 15:return A.next=17,w.close();case 17:t||(l?logger.myconsole('Self browser cont is missing! '.yellow+k):logger.myconsole('Cont is missing! '.yellow+k),r('Cont is missing!')),v.date=mytime.mytime(),v.url=h,logger.mybuffer(v),logger.writelog('success',g),A.next=30;break;case 24:return A.prev=24,A.t0=A['catch'](10),r(!1),logger.myconsole('Cont page error! Or page timeout!'.red),A.next=30,w.close();case 30:case'end':return A.stop();}},q,m,[[10,24]])}));return function(){return p.apply(this,arguments)}}()));case 1:case'end':return o.stop();}},d,this)}));return function b(){return c.apply(this,arguments)}}()}]),a}();module.exports=InitJs;
