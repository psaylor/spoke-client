define(["jquery","socketio","socketio-stream"],function(e,t,n){var r=null,i=function(e){return r?r:(r=s(e),r)},s=function(e){var n=e.path||"",r=e.url||"/",i=t(r,{path:n});return i.on("connect",function(){console.log("Client socket connected to ",n)}),i.on("disconnect",function(){console.log("Client socket disconnected from",n)}),i};return{getSocket:i,_initializeSocket:s,ioStream:n}});