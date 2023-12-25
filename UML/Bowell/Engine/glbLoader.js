/* ==================================================================
 * Copyright (c) 2023 Bowell_DT.
 * All rights reserved.
 * ===================================================================
 * Author: Yusz.
 * Version: 1.0.
 * Description: .
 */



class LoaderFunction {
  let glTF_Json;
  let glTF_Data;
  let _this = this;

  function parseModel(DataUrl) {
    return new Promise((resolve, reject) => {

    })


    //根据Json结构，读取bin中特定区域数据
    if (DataUrl.indexOf(".glb") < 0) {
      DataUrl += ".glb";
    }
    let http = new ic.Http(_this._monitor);
    http.responseType = "arraybuffer";
    http.load(DataUrl, function (response) {
      let view = new DataView(response);
      let magic = view.getUint32(0, true);
      let version = view.getUint32(4, true);
      let length = view.getUint32(8, true);

      if (magic !== 0x46546c67) {
        console.log("glb read error! <magic code>");
      } else {
        let byteOffset = 12;
        while (byteOffset < response.byteLength) {
          let chunklength = view.getUint32(byteOffset, true);
          byteOffset += 4;
          let chunkType = view.getUint32(byteOffset, true);
          byteOffset += 4;
          let chunkData = new Uint8Array(response, byteOffset, chunklength);
          byteOffset += chunklength;
          if (chunkType === 0x4e4f534a) {
            const textDecoder = new TextDecoder('utf-8');
            const jsonString = textDecoder.decode(chunkData);
            _this.glTF_Json = JSON.parse(jsonString);
          } else if (chunkType === 0x004e4942){
            _this.glTF_Data = chunkData;
          }
        }
      }
    });
  }

  function parseNode(glTF_Json){
    return new Promise((resolve, reject) => {
      const scene = glTF_Json.scenes[glTF_Json.scene || 0];
      if(!scene){
        return;
      }
      resolve(scene.nodes);
    });
  }

  function parseMesh(scene, glTF_Data){
    return new Promise((resolve, reject) => {
      let meshData = {};
      
    })
  }

  async parseJson(glTF_Json) {

  }
}

class GlbLoader{
  //读取模型
  //解析Json并异步加载数据，存入modelComponents
  //modelComponents结构近似Json，由最小引擎对象组成如 mesh、material、Texture。。。
  //全局ResourceCache存储共享的资源 纹理、二进制缓冲区、glTF的Json部分
  //当代码需要加载资源时首先检查缓存，未命中才会加载别的
}

//加载函数
GlbLoader.prototype.load = async function () {
  if (defined(this._promise)) {
    return this._promise;
  }

  this._promise = loadGltfJson(this);
  return this._promise;
};

//异步加载Json
async function loadGltfJson(loader) {
  loader._state = GltfLoaderState.LOADING;
  loader._textureState = GltfLoaderState.LOADING;

  try {
    const gltfJsonLoader = ResourceCache.getGltfJsonLoader({
      gltfResource: loader._gltfResource,
      baseResource: loader._baseResource,
      typedArray: loader._typedArray,
      gltfJson: loader._gltfJson,
    });
    loader._gltfJsonLoader = gltfJsonLoader;
    await gltfJsonLoader.load();

    if (
      loader.isDestroyed() ||
      loader.isUnloaded() ||
      gltfJsonLoader.isDestroyed()
    ) {
      return;
    }

    loader._state = GltfLoaderState.LOADED;
    loader._textureState = GltfLoaderState.LOADED;

    return loader;
  } catch (error) {
    if (loader.isDestroyed()) {
      return;
    }

    loader._state = GltfLoaderState.FAILED;
    loader._textureState = GltfLoaderState.FAILED;
    handleError(loader, error);
  }
}