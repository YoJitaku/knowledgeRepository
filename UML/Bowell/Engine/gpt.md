# GO

```js
function(){
  var typelookup = {};
  var names = ['array', 'object', ...];
  var index = 0;
  for(; index < names.length; ++index){
    typelookup['[object' + names[index] + ']'] = names[index].tolowercase();
  }
}
```

```js
extend = function (tar, ex) {
  var pp, cp;
  for (pp in ex) {
    cp = ex[pp];
    if (this.type(cp) === "obj") {
      tar[pp] = this.extend({}, cp);
    } else if (this.type(cp) === "array") {
      tar[pp] = this.extend({}, cp);
    } else {
      tar[pp] = cp;
    }
  }
  return tar;
};
```

```js
var load = function(name, configUrl, assetsPath, onload, onerror){
  if (configUrl.indexOf('/config.json' < 0)){
    configUrl += '/config.json';
  }
  var http = new ic.Http(_this.monitor);
  http.responseType = 'text';
  http.load(configUrl, function (response){
    _this.loadconfig(
      name, JSON.parse(response), assetsPath, onload, onerror);
    })；
  };
```

```js
var Http = function (monitor) {
  this.monitor = monitor;
  this.responseType = "";
  this.withCredentials = false;
  this.crossDomain = true;
};
Http.prototype = {
  constructor: Http,
  load: function (url, onload, onProgress, onError) {
    var _this = this;
    var request = new XMLHttpRequest();
    var cached = ic.Cache.get(url);
    if (cached !== undefined) {
      if (_this.monitor) {
        _this.monitor.itemLoadStart(url);
      }
      setTimeout(function () {
        if (onLoad) onLoad(cached);
        if (_this.monitor) {
          _this.monitor.itemLoadEnd(url);
        }
      }, 0);
      return request;
    }
    if (request.overrideMimeType) {
      request.overrideMimeType("text/xml");
    }
    requeset.open("GET", url, true);
    requeset.onload = function (event) {
      var response = event.target.response;
      if (this.status === 200) {
        if (_this.responseType == "json") {
          response = JSON.parse(response);
        }
        ic.Cache.add(url, response);
        if (onLoad) onLoad(response);
        if (_this.monitor) {
          _this.monitor.itemLoadEnd(url);
        }
      } else if (this.status === 0) {
        window.console.warn("HTTP Status === 0 received.");
        if (onLoad) {
          onLoad(response);
        }
        if (_this.monitor) {
          _this.monitor.itemLoadEnd(url);
        }
      } else {
        if (onError) {
          onError(event);
        }
        if (_this.monitor) {
          _this.monitor.itemLoadError(url);
        }
      }
    };
    if (onProgress !== undefined) {
      request.onprogress = onProgress;
    }
    request.onerror = function (event) {
      if (onError) onError(event);
      if (_this.monitor) {
        _this.monitor.itemLoadError(url);
      }
    };
    request.responseType =
      _this.responseType === "json" ? "text" : _this.responseType;
    request.withCredentials = _this.withCredentials;
    request.crossDomain = _this.crossDomain;

    if (_this.monitor) {
      _this.monitor.itemLoadStart(url);
    }
    request.send();
    return request;
  },
};
```
