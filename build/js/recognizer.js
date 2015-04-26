define(["jquery","sharedAudio","clientSocket","utils"],function(e,t,n,r){console.log("> Loading recognizer.js");var i=n.socket,s=n.ioStream;try{var o=o||webkitSpeechRecognition;console.log("Got recognition")}catch(u){var a=Object;console.log("Error getting recognition:",u);return}var f=function(t,n){if(!(this instanceof f))return new f(t,n);console.log("Creating new Recognizer on element",t),n=n||{},this.settings=e.extend({},f.DEFAULTS,n),this.element=e(t),this.$this=e(this);var r=this;this.listening=!1,this._setupRecognition(),this.element.click(function(){r.toggle.call(r)})};return f.DEFAULTS={continuous:!0},f.SpeechRecognition=o,f.prototype._setupRecognition=function(){this.recognition=new f.SpeechRecognition,this.recognition.continuous=this.settings.continuous;var e=this;this.recognition.onresult=function(t){e.$this.trigger("result.spoke.recognizer",t);for(var n=t.resultIndex;n<t.results.length;++n)if(t.results[n].isFinal){var r=t.results[n][0].transcript.trim();console.log("Text result:",r),e.$this.trigger("finalResult.spoke.recognizer",[r])}},this.recognition.onend=function(){console.log("Recognition ended."),e.listening=!1,e.$this.trigger("stop.spoke.recognizer")}},f.prototype._startRecognition=function(){this.listening=!0,this.recognition.start(),this.$this.trigger("start.spoke.recognizer")},f.prototype._stopRecognition=function(){this.recognition.stop()},f.prototype.toggle=function(){console.log("toggleRecognition"),this.listening?this._stopRecognition():this._startRecognition()},f.prototype.on=function(e,t){return this.$this.on(e,t)},{Recognizer:f}});