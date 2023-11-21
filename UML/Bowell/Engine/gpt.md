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

```js
for (i = 0, length = renderlist.length; i < length; i++) {
  renderUnit = renderlist[i];

  renderUnit.__mesh = renderUnit.morph
    ? renderUnit.morph._morphMesh
    : renderUnit.mesh;
  renderUnit.__mat = renderUnit.material;
  renderUnit.__order = renderUnit.drawOrder;

  if (renderUnit.__mat._needsBlend) {
    renderUnit.__z = camera._position.squareDistance(renderUnit, _position);
    transparents.push(renderUnit);
  } else {
    opaques.push(renderUnit);
  }
}
```

```js
var opaqueSortComp = function (lhs, rhs) {
  if (lhs.__order !== rhs.__order) {
    return lhs.__order - rhs.__order;
  } else if (
    lhs.__effect &&
    rhs.__effect &&
    lhs.__effect._id !== rhs.__effect._id
  ) {
    return lhs.__effect._id - rhs.___effect._id;
  } else {
    return lhs.__mesh._id - rhs.__mesh._id;
  }
};
```

```js
collect: function(){
  var root = this._root;
  if(this._hierarchyVersion === root.subHierarchyVersion){
    return this._renderList;
  }
  this._reset();
  this._collectImp(root);
  this._hierarchyVersion = root.subHierarchyVersion;
  return this._renderList;
}
```

```js
_collectImp: function(node){
  var index = 0, len = 0;
  if(node.isMeshNode){
    var material = node.material;
    var mesh = node.mesh;
    if(mesh && node._subMeshes != null){
      for(index = 0, len = node._subMeshes.length; index < len; index++){
        this._renderList.push(node._subMeshes[index]);
      }
      else if (mesh && material && mesh.isMesh && material.isMaterial){
        this._renderList.push(node);
      }
    }
    for (index = 0, len = node._children.length; index < len; index++){
      this._collectImp(node.children[index]);
    }
  }
}
```

```js
addChild: function(node){
  if(node === this){
    return this;
  }
  if(!(node instanceof ic.BaseNode)){
    window.console.warn("BaseNode.addChild must accept the argument typed of ICreator.BaseNode!", node);
    return;
  }
  if(node._parent !== null){
    node._parent.removeChild(node);
  }
  node._parent = this;
  node._markWorldDirty();
  this._children.push(node);
  this._notifyHierarchyDirty(true);
  return this;
}
```

```js
var asset = {
  model: model,
  animations: animations,
  lights: lights,
  glBuffers: [],
};
```

```js
this.bindRenderTarget = (function () {
  var frameBufferObject = null;
  var needsUpdateViewport = null;
  return function (renderTarget) {
    if (renderTarget) {
      var glRenderTarget = glRenderTargetMap.get(renderTarget);
      var renderToCube = renderTarget.renderToCube;
      if (glRenderTarget._version !== renderTarget._version) {
        if (glRenderTarget._fbo === undefined) {
          if (renderToCube) {
            _this._renderTargetFactory.allocateCube(renderTarget);
            renderTarget.releaseObservable.addUnique(
              _this._renderFactory.release
            );
            _this._renderTargetFactory.constructCube(renderTarget);
          } else {
            _this._renderTargetFactory.allocate(renderTarget);
            renderTarget.releaseObservable.addUnique(
              _this._renderTargetFactory.release
            );
            _this._renderTargetFactory.construct(renderTarget);
          }
        }
        needsUpdateViewport = true;
        glRenderTarget._version = renderTarget._version;
      }
      frameBufferObject =
        renderToCube === true
          ? glRenderTarget._fbo[renderTarget._face]
          : glRenderTarget._fbo;
    } else {
      frameBufferObject = null;
      needsUpdateViewport = viewportChanged;
      viewportChanged = false;
    }
    if (currentFramebufferObject !== frameBufferObject) {
      currentFramebufferObject = frameBufferObject;
      gl.bindFramebuffer(gl.FRAMEBUFFER, currentFramebufferobject);
      needsUpdateViewport = true;
    }
    if (needsUpdateViewport === true) {
      _this.viewport(renderTarget ? renderTarget._viewport : viewport);
    }
  };
})();
```

```js
this.depthMask = (function () {
  var _curDepthMask = null;
  return function (flag) {
    if (_curDepthMask !== flag) {
      gl.depthMask(flag);
      _curDepthMask = flag;
    }
  };
})();
```

```js
//makepack.py
import sys
import argparse
import json
import os
import re
import shutil
import tempfile
from io import open
import subprocess
import sys
import base64
reload(sys)
sys.setdefaultencoding('utf-8')

"cd build"
"c:\Python27\python.exe makePack.py --include icreator3d"
"java -jar compiler.jar --js_output_file ../icreator_min.js icreator_min.js --language_out=ESS"

if sys.version_info < (2, 7):
  print("need Python 2.7")

def DumpBin(data, mark):
    outStr = "\n%s Data size = %d" % (Mark, len(data))
    strHexTmp = ''
    strChrTmp = ''
    for i in range(0, len(data)):
      strHexTmp += ' %02X'% (ord(data[i]))
      if data[i] >= ' ' and data[i] <= '~':
        strChrTmp += data[i]
      else:
        strChrTmp += '?'
      if i % 16 == 7 :
        strHexTmp += '|'
      if i & 16 == 15 :
        outStr += "\n[%04d-^04d]:%s   %s" %(i-15. i+1, strHexTmp, strChrTmp)
        strHexTmp = ''
        strChrTmp = ''
    nMiss = len(data) % 16
    if nMiss != 0:
      outStr += "\n[%04d-^04d]:%s   %s" %(16*(len(data)/16)+1, len(data)+1, strHexTmp)
      outStr += '   '* (16-nMiss)
      if nMiss < 7:
        outStr += ' '
      outStr += strChrTmp
    outStr += '\r\n'
    return outStr

def main(argv = None):
    Parser = argparse.argumentParser()
    Parser.add_argument('--include', action='append')
    Parser.add_argument('--output', default='icreator_all.js')

    args = parser.parse_args()

    output = args.output

    print(' * Building' + output)

    fd, path = tempfile.mkstemp()
    tmp = open(path, 'w', encoding='utf-8')
    for include in args.include:
      with open(include + '.json', 'r', encoding='utf-8') as f:
          files = json.load(f)
      for filename in files:
          filename = '../' + filename
          with open(filename, 'r', encoding='utf-8', errors='ignore')as f:
              text = f.read()
              tmp.write(text)
    tmp.close()
    shutil.copy(path, output)
    os.chmod(output, 0o664)

    subprocess.call("java -jar compiler.jar --js_output_file icreator_min.js icreator_all.js --language_out=ES5")
    subprocess.call("lzma e icreator_min.js icreator_min_lzma")

    fd, path = tempfile.mkstemp()
    tmp = open(path, 'w', encoding='utf-8')
    with open("icreator_min_lzma", 'rb') as f:
        text = f.read()
        base64_text = base64.b64encode(text)
        ubase64 = unicode(base64_text)
        ubase64 = "var str=\" + ubase64 + "\""
        tmp.write(ubase64)

    with open("../icreator3d/misc/lzma-d-min.js", 'r', encoding='utf-8') as lzmajs:
        text = lzmajs.read()
        tmp.write(text)

    tmp.write(unicode("var lzmaCode = window.atob(str); var byteNumbers = new Uint8Array(lzmaCode.length); for(var i=0; i<lzmaCode.length; i++){byteNumbers[i] = lzmaCode.charCodeAt(i);} code = LZMA.decompress(byteNumbers); eval(code);"))
    tmp.write(unicode("ICreator.DebugMode = false;"))
    tmp.close()
    shutil.copy(path, "icreator.js")
    os.chmod(output, 0o664)

if __name__ = "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    main()
```

```js
//engine.resource.fbs.js
class Fbs extends Resource {
  constructor(_manager) {
    super(_manager);
    this._resourceName = "model.fbs";
  }
  async loadModel() {
    let model_url = this.resourceHost + "model.fbs";
    return new Promise((resolve, reject) => {
      let monitor = new ICreator.loadingMonitor(
        () => {},
        (url) => {},
        (e) => {
          reject();
        }
      );
      let loader = new ICreator.ModelLoader(monitor);
      loader.load(model.url, (_model) => {
        this._resourceobject = _model;
        resolve();
      });
    });
  }
  async _load() {
    super._load();
    await this.loadModel();
  }
}
```

```js
var getWebGLCompatibility = function (gl) {
  var compatibility = {};
  compatibility.UIntIndexSupport = !!gl.getExtension("OES_element_index_uint");
  compatibility.MaxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
  compatibility.MaxVertTextureUnits = gl.getParameter(
    gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS
  );
  compatibility.MaxTextureSize = gl.getParameter(gl.Max_TEXTURE_SIZE);
  compatibility.MaxCubemapTexsize;
  compatibility.MaxVertAttribs;
  compatibility.MaxVertUniformVecs;
  compatibility.MaxVaryingVecs;
  compatibility.MaxFragUniformVecs;
  compatibility.VertexTextureSupport;
  compatibility.FragFloatTextureSupport;
  compatibility.VertFloatTextureSupport;
  compatibility.FragFloatTextureLinearSupport;
  compatibility.TextureLodSupport;
  compatibility.StandarDerivationSupport;
  compatibility.FloatColorBuffer = !!gl.getExtension(
    "WEBGL_color_buffer_float"
  );
  compatibility.MaxPrecision = getMaxPrecision(gl, "highp");
  var maxAnisotropy = 0;
  if (gl.getExtension("MAX_TEXTURE_MAX_ANISOTROPY_EXT")) {
    maxAnisotropy = gl.getParameter("MAX_TEXTURE_MAX_ANISOTROPY_EXT");
  } else {
    maxAnisotropy = 0;
  }
  compatibility.MaxAnisotropy = maxAnisotropy;
  return compatibility;
};
```

```js
tmpSourceNode.onended = function () {
  if (_state === ICreator.Playing) {
    _state = ICreator.Stop;
  } else if (_state === ICreator.Suspend) {
    var duration = _this.bufferSourceNode.buffer.duration;
    var runningTime = _audioCtx.currntTime;
    _suspendAt = runningTime < duration ? runningTime : runningTime % duration;
  } else if (_state === ICreator.stop) {
  }
};
```

```js
(function (ic) {
var LoadingMonitor = function(onload, onprogress, onerror)
{
  var _this = this;
  var isloading = false, itemsLoaded = 0, itemsTotal = 0;
  this.percent = 0;
  this.onBegin = undefined;
  this.onLoad = onload;
  this.onProgress = onprogress;
  this.onError = onerror;
  this.itemLoadStart = function(url){
    itemsTotal++;
    if(isLoading === false){
      if(_this.onBegin !== undefined){
        _this.onBegin(url, itemsLoaded, itemsTotal);
      }
    }
    isLoading = true;
  };
  this.itemLoadEnd = function(url){
    itemsLoaded++；
    this.percent += (1-this.percent)/(itemsTotal - (itemsLoaded -1));
    if(_this.onProgress !== undefined){
      _this.onProgress(url, itemsLoaded, itemsTotal);
    }
    if(itemsLoaded === itemsTotal){
      isLoading = false;
      if(_this.onLoad !== undefined){
        _this.onload();
      }
    }
  };
  this.itemLoadError = function(url){
    if(_this.onError !== undefined){
      _this.onError(url);
    }
  };
  this.reset = function(){
    if(isLoading){return false;}
    else(
      itemsLoaded = 0;
      itemsTotal = 0;
      this.percent = 0;
      return true;
    )
  };
};
LoadingMonitor.prototype = {
  constructor: LoadingMonitor
};
ic.LoadingMonitor = LoadingMonitor;
})(ICreator);
```

```js
(function (ic) {
  var Http = function (monitor) {};
  Http.prototype = {};
  ic.Http = Http;
})(ICreator);
```

```js
blendState;
pixelFlipY;
curActiveTextureUnit;
clearBitMask = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT;
auxCanvas = document.creaeElement("canvas");
auxContext2d = auxCanvas.getContext("2d");
currentCullState = ic.CullNone;
boundTextures = new Array();
boundTargets = new Array();
_effectId;
enableAttributes;
newEnableAttrs;
glBufferMap;
glTextureMap;
glRenderTargetMap;
viewport;
currentFramebufferObject;
currentRenderTarget;
currentBlendMode;
currentBoundIndexBuffer;
currentClearColor;
```

```js
(function (ic) {
  var GLObjects = function (init) {
    var _object = {};
    var _init = init;
    this.reset = function (object) {
      var map = {};
      if (_init) _init(map);
      _objects[object._id] = map;
      return map;
    };
    this.get = function (object) {
      var obj = _objects[object._id];
      if (obj) {
        return obj;
      } else {
        return this.reset(object);
      }
    };
    this.getById = function (id) {
      var obj = _objects[id];
      return obj ? obj : this.reset(obj);
    };
    this.find = function (object) {
      return _objects[object._id];
    };
    this.remove = function (object) {
      delete _objects[object._id];
    };
    this.clear = function () {
      _objects = {};
    };
    this.iterate = function (callback) {
      for (var id in _objects) {
        callBack(_objects[id]);
      }
    };
  };
  ic.GLObjects = GLObjects;
})(ICreator);
```

```js
renderTargetFactory = {
  chechFramebufferStatus: function () {
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    switch (status) {
      case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
        window.console.error("ERROR: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
        break;
      case gl.FRAMEBUFFER_COMPLETE:
        window.console.error("ERROR: FRAMEBUFFER_UNSUPPORTED");
        break;
      default:
        break;
    }
  },
  attachDepthRenderBuffer: function (
    framebuffer,
    renderBuffer,
    width,
    height,
    stencil
  ) {
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
    if (stencial) {
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.DEPTH_STENCIL_ATTACHMENT,
        gl.RENDERBUFFER,
        renderBuffer
      );
    } else {
      gl.renderbufferStorage(
        gl.RENDERBUFFER,
        gl.DEPTH_COMPONENT16,
        width,
        height
      );
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.DEPTH_ATTACHMENT,
        gl.RENDERBUFFER,
        renderBuffer
      );
    }
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  },
  allocate: function (renderTarget) {
    glRenderTargetMap.get(renderTarget)._fbo = gl.createFramebuffer();
  },
  releaseImp: function (glRenderTarget, cube) {
    var framebufferObject = glRenderTarget._fbo;
    var renderbufferObject = glRenderTarget._depthBuffer;
    if (cube) {
      for (var i = 0; i < framebufferObject.length; i++) {
        gl.deleteFramebuffer(framebufferObject[i]);
        if (renderbufferObject) {
          gl.deleteRenderbuffer(renderbufferObject[i]);
        }
      }
    } else {
      gl.deleteFramebuffer(framebufferObject);
      if (renderbufferObject) {
        gl.deleteRenderbuffer(renderbufferObject);
      }
    }
  },
  release: function (renderTarget) {
    var glRenderTarget = glRenderTargetMap.get(renderTarget);
    if (glRenderTarger === undefined) return;
    renderTarget.colorTexture.release();
    _this._renderTargetFactory.releaseImp(
      glRenderTarget,
      renderTarget._renderToCube
    );
    glRenderTargetMap.remove(renderTarget);
    renderTarget.releaseObservable.removeCallback(this.release);
  },
  construct: function (renderTarget) {
    var glRenderTarget = glRenderTargetMap.get(renderTarget);
    gl.bindFramebuffer(gl.FRAMEBUFFER, glRenderTarget._fbo);
    _this.useTexture2D(renderTarget.colorTexture, 0);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      glTextureMap.get(renderTarget.colorTexture)._texID,
      0
    );
    if (renderTarget.enableDepth === true) {
      if (renderTarget.useDepthTexture) {
        _this.useTexture2D(renderTarget.depthTexture, 0);
        var glDepthTexture = glTextureMap.get(renderTarget.depthTexture);
        var attachment = renderTarget.enableStencil
          ? gl.DEPTH_STENCIL_ATTACHMENT
          : gl.DEPTH_ATTACHMENT;
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          attachment,
          gl.TEXTURE_2D,
          glDepthTexture._texID,
          0
        );
      } else {
        if (!glRenderTarget._depthBuffer) {
          glRenderTarget._depthBuffer = gl.createRenderbuffer();
        }
        this.attachDepthRenderBuffer(
          gl.RenderTarget._fbo,
          glRenderTarget._depthBuffer,
          renderTarget.width,
          renderTarget.height,
          renderTargetenableStencil
        );
      }
      this.checkFramebufferStatus();
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  },
  allocateCube: function (renderTarget) {
    var framebufferList = new Array(6);
    for (var i = 0; i < framebufferList.length; i++) {
      framebufferList[i] = gl.createFramebuffer();
    }
    glRenderTargetMap.get(renderTarget)._fbo = framebufferList;
  },
  constructCube: function () {},
  generateMipMap: function () {},
  read: (function () {
    var readFromFrameBuffer = null;

    return function (renderTarget, x, y, width, height) {
      if (readFromFrameBuffer === null) {
        readFromFrameBuffer = function (
          framebufferObject,
          format,
          dataType,
          x,
          y,
          width,
          height
        ) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferObject);
          var glFormat = convert2GLParam(format);
          var glDataType = convert2GLType(dataType);
          var bufferSize = 4 * width * height;
          var buffer;
          if (dataType === ic.UBtye) {
            buffer = new Uint8Array(bufferSize);
          } else if (dataType === ic.Float32) {
            buffer = new FLoat32Array(bufferSize);
          }
          if (
            format !== ic.RGBA &&
            glFormat !== gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_FORMAT)
          ) {
            window.console.error(
              "renderTarget is not in RGBA or implementation defined format."
            );
          }
          if (
            dataType !== ic.UByte &&
            glDataType !== gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_TYPE) &&
            !(dataType === ic.Float32 && ic.WebGLCompatibility.FloatColorBuffer)
          ) {
            window.console.error(
              "renderTarget is not in UnsigneByteType or implementation defined type."
            );
          }
          gl.readOuxeks(x, y, width, height, glFormat, glDataType, buffer);
          gl.bindFramebuffer(gl.FRAMEBUFFER, currentFramebufferObject);
          return buffer;
        };
      }
      var buffers = [];
      var renderToCube = false;
      if (renderTarget) {
        x = (x === undefined) ? 0 : x;
        y = (y === undefined) > 0 : y;
        width = (width === undefined) ? renderTarget.width : width;
        height = (height === undefined) ? renderTarget.height : height;
        var glRenderTarget = glRenderTargetMap.get(renderTarget);
        renderToCube = renderTarget.renderToCube;
        var colorTexture = renderTarget.colorTexture;
        var fbo = renderToCube ? glRenderTarget._fbo : [glRenderTarget._fbo];
        for(var face = 0; face < fbo.length; face++){
          buffers.push(readFromFrameBuffer(fbo[face], colorTexture.format, colorTexture.dataType, x, y, width, height));
        }
      } else {
        x = (x === undefined) ? viewport[0] : x;
        y = (y === undefined) ? viewport[1] : y;
        width = (width === undefined) ? viewport[2] : width;
        height = (height === undefined) ? viewport[3] : height;
        buffers.push(readFromFrameBuffer(null, ic.RGBA, ic.UByte, x, y, width, height));
      }
      return (buffer.length === 1) ? buffer[0] : buffers;
    };
  })(),
};
```

```js
this.bindMesh = fucntion(mesh, effect){
  var attrs = mesh._vertAttribs;
  var effectAttrs = effect._attributes;
  var location, vertAttr;
  var glBuffer = null;
  var buffer = null;
  for(var type in effectAttrs) {
    loaction = effectAttrs[type];
    vertAttr = attrs[types];
    if(!vertAttr) continue;
    if(buffer !== vertAttr._buffer){
      buffer = vertAttr._buffer;
      glBuffer = glBufferMap.get(buffer);
      this._updateBuffer(buffer, glBuffer);
    }
    this.enableAttribute(location);
    newEnableAttrs(location) = 1;
    gl.vertexAttribPointer(
      location,
      vertAttr._itemSize,
      glBuffer._glType,
      vertAttr.normalized,
      vertAttr._strideBytes,
      vertAttr._offsetBytes
    );
  }
  var index = mesh.index;
  if(index){
    var glIndex = glBufferMap.get(index._buffer);
    this.updateIndex(index._buffer, glIndex);
  }
  for(var i = 0; i < enableAttributes.length; i++){
    if(newEnableAttrs[i] !== enableAttributes[i]){
      gl.disableVertexAttribArray(i);
      enableAtributes[i] = 0;
    } else {
      newEnableAttrs[i] = 0;
    }
  }
};
```

```js
this.updateIndex = function (indexBuff, glIndex) {
  if (glIndex._vbo === undefined) {
    var indexVBO = this.createBuffer(indexBuff);
    indexBuff.realeaseObservable.addUnique(releaseBuffer);
    glIndex._vbo = indexVBO;
    this.blindIndexBuffer(indexVBO);
    if (indexBuff._staticUsage) {
      this.staticIndexBufferData(indexBuff);
    } else {
      this.dynamicIndexBufferData(indexBuff);
    }
  } else if (glIndex.version < indexBuff.version) {
    this.bindIndexBuffer(glIndex._vbo);
    this.updateIndexBuffer(indexBuff);
  } else {
    this.bindIndexBuffer(glIndx._vbo);
    return;
  }
  glIndex.version = indexBuff.version;
};
```

```js
this._updateBuffer = function (attrBuffer, glBuffer) {
  if (glBuffer._vbo === undefined) {
    var vbo = this.createBuffer(attrBuffer);
    attrBuffer.releaseObservable.addUnique(releaseBuffer);
    glBuffer._vbo = vbo;
    glBuffer._glType = vbo._glType;
    this.bindVertexBuffer(vbo);
    if (attrBuffer._staticUsage) {
      this.staticVertexBufferData(attrBuffer);
    } else {
      this.dynamicVertexBufferData(attrBuffer);
    }
  } else if (attrBuffer._version > glBuffer._version) {
    this.bindVertexBuffer(glBuffer._vbo);
    this.updateVertexBuffer(attrBuffer, 0.0);
  } else {
    this.bindVertexBuffer(glBuffer._vbo);
  }
  glBuffer._version = attrBuffer._version;
};
```

```js
this.renderQuad = function (material, renderTarget, clear) {
  preBoundMesh = null;
  if (quad === null) {
    quad = new ic.MeshNode();
    quad.mesh = new ic.Mesh.Plane({
      width: 2,
      height: 2,
      normal: false,
      uv: false,
    });
  }
  engine.bindRenderTarget(renderTarget);
  if (clear === undefined || clear) engine.clear();
  quad.material = material;
  this._renderunitForward(quad, null, null);
  engine.renderTargetMipmap(renderTarget);
};
```

```js
this.render = function (scene, camera, renderTarget, forceMaterial, clear) {
  preBoundMesh = null;
  scene._root.syncTrees();
  camera.getView();
  var renderUnit, i, length;
  var renderList = scene.collect();
  opaques = [];
  transparents = [];
  reflects = [];
  refracts = [];
  var skinMap = {};
  var morphMap = {};
  for (i = 0, length = renderList.length; i < length; i++) {
    renderUnit = renderList[i];
    if (renderUnit.skin && skinMap[renderUnit.skin._id] === undefined) {
      renderUnit.skin.update();
      skinMap[renderUnit.skin._id] = true;
    }
    if (renderUnit.morph && morphMap[renderUnit.morph._id] === undefined) {
      renderUnit.morph.update(renderUnit.mesh);
      morphMap[renderUnit.morph._id] = true;
    }
    if (renderUnit.visible === false) {
      continue;
    }
    renderUnit.__mesh == renderUnit.morph
      ? renderUnit.morph._morphMesh
      : renderUnit.mesh;
    renderUnit.__mat = renderUnit.material;
    renderUnit.__order = renderUnit.drawOrder;
    this.getViewPort(viewport);
    if (renderUnit.__mat._reflect) {
      if (!renderUnit._reflectRender) {
        renderUnit._reflectRender = new ic.RenderTarget();
      }
      renderUnit._reflectRender.resize(viewport[2], viewport[3]);
      if (
        renderUnit._worldVersion !== renderUnit._curWorldVersion ||
        camera._worldVersion !== renderUnit._curCameraWorldVersion
      ) {
        this._createReflectPlane(renderUnit);
        this._updateReflectCamera(renderUnit, camera);
      }
      reflects.push(renderUnit);
    }
    if (renderUnit.__mat._refract) {
      if (!renderUnit._refractRender) {
        renderUnit._refractRender = new ic.RenderTarget();
      }
      if (!renderUnit._depthRender) {
        renderUnit._depthRender = new ic.RenderTarget();
      }
      renderUnit._refractRender.resize(viewport[2], viewport[3]);
      renderUnit._depthRender.resize(viewport[2], viewport[3]);
      this._createReflectPlane(renderUnit);
      refracts.push(renderUnit);
    }
    if (renderUnit.__mat._needsBlend && !renderUnit.__mat._blendNoSort) {
      renderUnit.__z = camera._position.squareDistance(renderUnit._position);
      transparents.push(renderUnit);
    } else {
      opaques.push(renderUnit);
    }
  }
  this.renderShadowMaps(
    renderlist,
    scene._pointLights,
    scene._directionalLights
  );
  opaques.sort(opaqueSortComp);
  transparents.sort(transparentSortComp);
  handleReflect = true;
  clipType = 0;
  length = reflects.length;
  if (length > 0) {
    for (i = 0; i < length; i++) {
      renderUnit = reflects[i];
      clipPlane.set(
        renderUnit._worldNomral.x,
        renderUnit._worldNomral.y,
        renderUnit._worldNomral.z,
        renderUnit._distance
      );
      this._renderProcess(
        scene,
        renderUnit._reflectCamera,
        renderUnit._reflectRender,
        forceMaterial,
        clear,
        renderUnit
      );
    }
  }
  clipType = 1;
  length = refracts.length;
  if (length > 0) {
    for (i = 0; i < length; i++) {
      renderUnit = refracts[i];
      clipPlane.set(
        renderUnit._worldNomral.x,
        renderUnit._worldNomral.y,
        renderUnit._worldNomral.z,
        renderUnit._distance
      );
      this._renderProcess(
        scene,
        camera,
        renderUnit._refractRender,
        forceMaterial,
        clear,
        renderUnit
      );
      renderDepth = true;
      for (i = 0; i < length; i++) {
        renderUnit = refracts[i];
        waterLevel = renderUnit.position.y;
        depthScale = renderUnit.__mat._depthScale;
        clipPlane.set(
          renderUnit._worldNomral.x,
          renderUnit._worldNomral.y,
          renderUnit._worldNomral.z,
          renderUnit._distance
        );
        this._renderProcess(
          scene,
          camera,
          renderUnit._depthRender,
          forceMaterial,
          clear,
          renderUnit
        );
      }
    }
  }
  renderDepth = false;
  handleReflect = false;
  this._renderProcess(scene, camera, renderTarget, forceMaterial, clear);
};
```

```js
this._renderProcess = function (
  scene,
  camera,
  renderTarget,
  forceMaterial,
  clear,
  exclude
) {
  var renderUnit, length, i;
  engine.bindRenderTarget(renderTarget);
  if (this._enableClear) {
    if (!renderDepth) {
      var backgroundColor = scene.backgroundColor;
      engine.clearColor(
        backgroundColor.x,
        backgroundColor.y,
        backgroundColor.z,
        backgroundColor.w
      );
    } else {
      engine.clearColor(255, 255, 255, 255);
    }
    clear = clear === undefined;
    if (clear === true) engine.clear();
  }
  length = opaques.length;
  if (length > 0) {
    for (i = 0; i < length; i++) {
      renderUnit = opaques[i];
      if (renderUnit !== exclude) {
        if (handleReflect) {
          if (renderUnit._meshNode) {
            if (!renderUnit._meshNode.canReflect) continue;
          } else {
            if (!renderUnit.canReflect) continue;
          }
        }
        this._renderUnitForward(renderUnit, camera, scene, forceMaterial);
      }
    }
  }
  if (scene.backgroundImage && scene.backgroundImageVisible && !renderDepth) {
    this.renderQuad(scene._backgroundMaterial, renderTarget, false);
  }
  if (scene._envMap && scene._envNode.visible === true && !renderDepth) {
    this._renderunitForward(scene._envNode, camera, scene);
  }
  length = transparents.length;
  if (length > 0) {
    for (i = 0, length = transparents.length; i < length; i++) {
      renderUnit = transparents[i];
      if (renderUnit !== exclude) {
        if (handleReflect) {
          if (renderUnit._meshNode) {
            if (!renderUnit._meshNode.canReflect) continue;
          } else {
            if (!renderUnit.canReflect) continue;
          }
        }
        this._renderunitForward(renderUnit, camera, scene);
      }
    }
  }
  engine.renderTargetMipmap(renderTarget);
};
```

```js
this._renderunitForward = (function () {
  var mesh, material, from, to;
  var foceBindMesh = false;
  return function (unit, camera, scene, forceMaterial) {
    mesh = unit.__mesh
      ? unit.__mesh
      : unit._morph
      ? unit._morph._morphMesh
      : unit.mesh;
    material = forceMaterial
      ? forceMaterial
      : unit.__mat
      ? unit.__mat
      : unit.material;
    from = unit.from === undefined ? 0 : unit.from;
    to = unit.to === undefined ? mesh.count : unit.to;
    var effect = getEffect(unit, material, scene);
    engine.enableEffect(effect);
    forceBindMesh = false;
    if (handleReflect) {
      effect.setVector4("uClipPlane", clipPlane);
      effect.setInt("uClipPlaneType", clipType);
      effect.setInt("useClipPlane", 1);
    } else {
      effect.setInt("useClipPlane", 0);
      if (material._reflect && unit._reflectRender) {
        effect.setTexture("uReflectMap", unit._reflectRender.colorTexture);
      }
      if (material._refract && unit._refractRender && unit._depthRender) {
        effect.setTexture("uRefractMap", unit._refractRender.colorTexture);
        effect.setTexture("uRefractDepthMap", unit._depthRender.colorTexture);
      }
    }
    if (renderDepth) {
      effect.setInt("uRenderDepth", 1);
      effect.setFloat("uWaterLevel", waterLevel);
      effect.setFloat("uDepthScale", depthScale);
    } else {
      effect.setInt("uRenderDepth", 0);
    }

    if (camera) {
      ...
    }
  };
})();
```

```js
this.renderNormal = function (_this){
  var preClearMode = 0;
  return  function (renderList, camera, renderTarget, clear, options){
    preBoundMesh = null;
    engine.bindRenderTarget(renderTarget);
    preClearMode = engine.getClearMode();
    if(clear === undefined || clear){
      engine.clearColor(0, 0, 0, 1);
      engine.setClearMode(true, true, false);
      engine.clear();
    }
    engine.blend(false);
    for(var i = 0; length = renderList.length; i < length; i++){
      var renderUnit = renderList[i];
      if(!renderUnit.visible || options && options.filter && options.filter(renderUnit)) continue;
      _this.renderunitForward(renderUnit, camera, null, normalMaterial);
    }
    engine.setClearMode(preClearMode);
  }
}(this);
```

```js
var DepthRenderer = function (instance) {
  this._depthMaterialPool = {};
  this._depthDistanceMaterialPool = {};
  this._defaultDepthMaterial = new ic.DepthMaterial();
  this._particleDepthMaterial = new ic.ParticleDepthMaterial();
  this._instance = instance;
  this._alphaTestKey = ic.Material.alphaTestKeyGetter();
  this._flipCullMap = {};
  this._flipCullMap[ic.CullNone] = ic.CullNone;
  this._flipCullMap[ic.CullBack] = ic.CullFront;
  this._flipCullMap[ic.CullFront] = ic.CullBack;
  this._flipCullMap[ic.CullBoth] = ic.CullBoth;
  this._defaultOption = {
    needsFilpCullState: false,
    useDistanceAsDepth: false,
  };
};
DepthRenderer.prototype = {
  geDepthMaterial: function (material, useDistanceAsDepth) {
    var depthMaterial;
    if (!material.isStandardMaterial && !material.isSimpleMaterial) {
      if (material.isParticleMaterial === true) {
        depthMaterial = this._particleDepthMaterial;
        depthMaterial.renderMode = material.renderMode;
      } else {
        depthMaterial = this._defaultDepthMaterial;
      }
      depthMaterial.useDistanceAsDepth = useDistanceAsDepth;
      return depthMaterial;
    }
    var alphaTestKey = this._alphaTestKey(material);
    alphaTestKey += "|" + useDistanceAsDepth + "|" + material.dithered;
    var pool = this._depthMaterialPool;
    if (pool[alphaTestKey] === undefined) {
      depthMaterial = new ic.DepthMaterial();
      depthMaterial._opacityMapUV = material.opacityMapUV;
      depthMaterial._opacityMapChannel = material.opacityMapChannel;
      depthMaterial.useDistanceAsDepth = useDistanceAsDepth;
      depthMaterial.dithered = material.dithered;
      pool[alphaTestKey] = depthMaterial;
    } else {
      depthMaterial = pool[alphaTestKey];
    }
    depthMaterial._opacityMap = material.opacityMap;
    depthMaterial._alphaTestValue = material._alphaTestValue;
    depthMaterial.fillMode = material.fillMode;
    depthMaterial.alpha = material.alpha;
    return depthMaterial;
  },
  render: function (renderList, camera, options) {
    for (var i = 0, length = renderList.length; i < length; i++) {
      var renderUnit = renderList[i];
      options = options || this._defaultOption;
      if (
        (!options.filter && !renderUnit.visible) ||
        (options.filter && options.filter(renderUnit))
      )
        continue;
      var material = renderUnit.material;
      var depthMaterial = this.getDepthMaterial(
        material,
        options.useDistanceAsDepth
      );
      depthMaterial.cullState = options.needsFlipCullState
        ? this._flipCullMap[material.cullState]
        : material.cullState;
      this._instance.renderunitForward(renderUnit, camera, null, depthMaterial);
    }
  },
};
ic.DepthRenderer = DepthRenderer;
```

```js

```
