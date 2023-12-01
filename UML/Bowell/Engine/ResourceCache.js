(function (ic) {
  "use strict";
  let Cache = {};

  //资源使用CPU和GPU的统计信息
  class ResourceCacheStatistics {
    constructor() {
      //缓存中已加载的顶点缓冲区或索引缓冲区大小
      this.geometryByteLength = 0;
      //缓存中已加载的Textures的大小
      this.texturesByteLength = 0;

      //通过Cache Key跟踪资源的大小
      this._geometrySizes = {};
      this._textureSizes = {};
    }

    //重置
    clear() {
      this.geometryByteLength = 0;
      this.texturesByteLength = 0;

      this._geometrySizes = {};
      this._textureSizes = {};
    }

    //缓冲区加载器计数
    addGeometryLoader(loader) {
      ic.Check.typeOf.object("loader", loader);

      const cacheKey = loader.cacheKey;

      //不重复计算相同的资源。
      if (this._geometrySizes.hasOwnProperty(cacheKey)) {
        return;
      }

      this._geometrySizes[cacheKey] = 0;

      const buffer = loader.buffer;
      const typedArray = loader.typedArray;

      let totalSize = 0;

      if (ic.defined(buffer)) {
        totalSize += buffer.sizeInBytes;
      }

      if (ic.defined(typedArray)) {
        totalSize += typedArray.byteLength;
      }

      this.geometryByteLength += totalSize;
      this._geometrySizes[cacheKey] = totalSize;
    }

    //纹理加载器计数
    addTextureLoader(loader) {
      ic.Check.typeOf.object("loader", loader);

      const cacheKey = loader.cacheKey;

      //不重复计算相同的资源。
      if (this._textureSizes.hasOwnProperty(cacheKey)) {
        return;
      }

      this._textureSizes[cacheKey] = 0;
      const totalSize = loader.texture.sizeInBytes;
      this.texturesByteLength += loader.texture.sizeInBytes;
      this._textureSizes[cacheKey] = totalSize;
    }

    //移除一个计数器
    removeLoader(loader) {
      ic.Check.typeOf.object("loader", loader);

      const cacheKey = loader.cacheKey;
      const geometrySize = this._geometrySizes[cacheKey];
      delete this._geometrySizes[cacheKey];

      if (ic.defined(geometrySize)) {
        this.geometryByteLength -= geometrySize;
      }

      const textureSize = this._textureSizes[cacheKey];
      delete this._textureSizes[cacheKey];

      if (ic.defined(textureSize)) {
        this.texturesByteLength -= textureSize;
      }
    }
  }

  class ResourceCache {
    //缓存资源
    static cacheEntries = {};

    //记录统计信息
    static statistics = new ResourceCacheStatistics();

    //从缓存中获取资源，Key命中则增加计数，否则Undefined
    static get(cacheKey) {
      ic.Check.typeOf.string("cacheKey", cacheKey);
      const cacheEntry = ResourceCache.cacheEntries[cacheKey];
      if (ic.defined(cacheEntry)) {
        ++cacheEntry.referenceCount;
        return cacheEntry.resourceLoader;
      }
      return undefined;
    }

    //添加资源到缓存中
    static add(resourceLoader) {
      ic.Check.typeOf.object("resourceLoader", resourceLoader);
      const cacheKey = resourceLoader.cacheKey;
      Check.typeOf.string("options.resourceLoader.cacheKey", cacheKey);
      if (defined(ResourceCache.cacheEntries[cacheKey])) {
        console.log(
          "Resource with this cacheKey is already in the cache",
          ResourceCache.cacheEntries[cacheKey]
        );
      }
      ResourceCache.cacheEntries[cacheKey] = new CacheEntry(resourceLoader);
      return resourceLoader;
    }

    //从缓存中卸载资源，引用计数到0时释放
    static unload(resourceLoader) {
      ic.Check.typeOf.object("resourceLoader", resourceLoader);
      const cacheKey = resourceLoader.cacheKey;
      const cacheEntry = ResourceCache.cacheEntries[cacheKey];
      if (!ic.defined(cacheEntry)) {
        console.log(`Resource is not in the cache: cacheEntry`);
      }
      --cacheEntry.referenceCount;

      if (cacheEntry.referenceCount === 0) {
        //没有任何引用了
        ResourceCache.statistics.removeLoader(resourceLoader);
        resourceLoader.destroy();
        delete ResourceCache.cacheEntries[cacheKey];
      }
    }

    //缓存中获取7大Loader，如果缓存中没有，则创建新的
    // static getGltfJsonLoader(options) {
    //   options = defaultValue(options, defaultValue.EMPTY_OBJECT);
    //   const gltfResource = options.gltfResource;
    //   const baseResource = options.baseResource;
    //   const typedArray = options.typedArray;
    //   const gltfJson = options.gltfJson;
    //   Check.typeOf.object("options.gltfResource", gltfResource);
    //   Check.typeOf.object("options.baseResource", baseResource);
    //   const cacheKey = ResourceCacheKey.getGltfCacheKey({
    //     gltfResource: gltfResource,
    //   });
    //   let gltfJsonLoader = ResourceCache.get(cacheKey);
    //   if (defined(gltfJsonLoader)) {
    //     return gltfJsonLoader;
    //   }
    //   gltfJsonLoader = new GltfJsonLoader({
    //     resourceCache: ResourceCache,
    //     gltfResource: gltfResource,
    //     baseResource: baseResource,
    //     typedArray: typedArray,
    //     gltfJson: gltfJson,
    //     cacheKey: cacheKey,
    //   });
    //   return ResourceCache.add(gltfJsonLoader);
    // }

    /*
    static getSchemaLoader(options) {
      options = defaultValue(options, defaultValue.EMPTY_OBJECT);
      const schema = options.schema;
      const resource = options.resource;
      if (defined(schema) === defined(resource)) {
        throw new DeveloperError(
          "One of options.schema and options.resource must be defined."
        );
      }
      const cacheKey = ResourceCacheKey.getSchemaCacheKey({
        schema: schema,
        resource: resource,
      });
      let schemaLoader = ResourceCache.get(cacheKey);
      if (defined(schemaLoader)) {
        return schemaLoader;
      }
      schemaLoader = new MetadataSchemaLoader({
        schema: schema,
        resource: resource,
        cacheKey: cacheKey,
      });
      return ResourceCache.add(schemaLoader);
    }

    static getEmbeddedBufferLoader(options) {
      options = defaultValue(options, defaultValue.EMPTY_OBJECT);
      const parentResource = options.parentResource;
      const bufferId = options.bufferId;
      const typedArray = options.typedArray;
      Check.typeOf.object("options.parentResource", parentResource);
      Check.typeOf.number("options.bufferId", bufferId);
      const cacheKey = ResourceCacheKey.getEmbeddedBufferCacheKey({
        parentResource: parentResource,
        bufferId: bufferId,
      });
      let bufferLoader = ResourceCache.get(cacheKey);
      if (defined(bufferLoader)) {
        return bufferLoader;
      }
      Check.typeOf.object("options.typedArray", typedArray);
      bufferLoader = new BufferLoader({
        typedArray: typedArray,
        cacheKey: cacheKey,
      });
      return ResourceCache.add(bufferLoader);
    }

    static getExternalBufferLoader(options) {
      options = defaultValue(options, defaultValue.EMPTY_OBJECT);
      const resource = options.resource;
      Check.typeOf.object("options.resource", resource);
      const cacheKey = ResourceCacheKey.getExternalBufferCacheKey({
        resource: resource,
      });
      let bufferLoader = ResourceCache.get(cacheKey);
      if (defined(bufferLoader)) {
        return bufferLoader;
      }
      bufferLoader = new BufferLoader({
        resource: resource,
        cacheKey: cacheKey,
      });
      return ResourceCache.add(bufferLoader);
    }

   

    static getBufferViewLoader(options) {
      options = defaultValue(options, defaultValue.EMPTY_OBJECT);
      const gltf = options.gltf;
      const bufferViewId = options.bufferViewId;
      const gltfResource = options.gltfResource;
      const baseResource = options.baseResource;
      Check.typeOf.object("options.gltf", gltf);
      Check.typeOf.number("options.bufferViewId", bufferViewId);
      Check.typeOf.object("options.gltfResource", gltfResource);
      Check.typeOf.object("options.baseResource", baseResource);
      const cacheKey = ResourceCacheKey.getBufferViewCacheKey({
        gltf: gltf,
        bufferViewId: bufferViewId,
        gltfResource: gltfResource,
        baseResource: baseResource,
      });
      let bufferViewLoader = ResourceCache.get(cacheKey);
      if (defined(bufferViewLoader)) {
        return bufferViewLoader;
      }
      bufferViewLoader = new GltfBufferViewLoader({
        resourceCache: ResourceCache,
        gltf: gltf,
        bufferViewId: bufferViewId,
        gltfResource: gltfResource,
        baseResource: baseResource,
        cacheKey: cacheKey,
      });
      return ResourceCache.add(bufferViewLoader);
    }

    static getDracoLoader(options) {
      options = defaultValue(options, defaultValue.EMPTY_OBJECT);
      const gltf = options.gltf;
      const draco = options.draco;
      const gltfResource = options.gltfResource;
      const baseResource = options.baseResource;
      Check.typeOf.object("options.gltf", gltf);
      Check.typeOf.object("options.draco", draco);
      Check.typeOf.object("options.gltfResource", gltfResource);
      Check.typeOf.object("options.baseResource", baseResource);
      const cacheKey = ResourceCacheKey.getDracoCacheKey({
        gltf: gltf,
        draco: draco,
        gltfResource: gltfResource,
        baseResource: baseResource,
      });
      let dracoLoader = ResourceCache.get(cacheKey);
      if (defined(dracoLoader)) {
        return dracoLoader;
      }
      dracoLoader = new GltfDracoLoader({
        resourceCache: ResourceCache,
        gltf: gltf,
        draco: draco,
        gltfResource: gltfResource,
        baseResource: baseResource,
        cacheKey: cacheKey,
      });
      return ResourceCache.add(dracoLoader);
    }

    static getVertexBufferLoader(options) {
      options = defaultValue(options, defaultValue.EMPTY_OBJECT);
      const gltf = options.gltf;
      const bufferId = options.bufferId;
      const draco = options.draco;
      const gltfResource = options.gltfResource;
      const baseResource = options.baseResource;
      Check.typeOf.object("options.gltf", gltf);
      Check.typeOf.number("options.bufferId", bufferId);
      Check.typeOf.object("options.draco", draco);
      Check.typeOf.object("options.gltfResource", gltfResource);
      Check.typeOf.object("options.baseResource", baseResource);
      const cacheKey = ResourceCacheKey.getVertexBufferCacheKey({
        gltf: gltf,
        bufferId: bufferId,
        draco: draco,
        gltfResource: gltfResource,
        baseResource: baseResource,
      });
      let vertexBufferLoader = ResourceCache.get(cacheKey);
      if (defined(vertexBufferLoader)) {
        return vertexBufferLoader;
      }
      vertexBufferLoader = new GltfVertexBufferLoader({
        resourceCache: ResourceCache,
        gltf: gltf,
        bufferId: bufferId,
        draco: draco,
        gltfResource: gltfResource,
        baseResource: baseResource,
        cacheKey: cacheKey,
      });
      return ResourceCache.add(vertexBufferLoader);
    }

    static getIndexBufferLoader(options) {}
    static getImageLoader(options) {}
    static getTextureLoader(options) {}
    static clearForSpecs(options) {}
    */
    // //记录资源的引用次数
    // CacheEntry(resourceLoader) {
    //   this.referenceCount = 1; // 引用计数，初始为1
    //   this.resourceLoader = resourceLoader;
    // }

    // // 获取资源条目
    // static get(cacheKey) {
    //   ic.Check.typeOf.string("cacheKey", cacheKey);
    //   const cacheEntry = ResourceCache.cacheEntries[cacheKey];
    //   if (ic.defined(cacheEntry)) {
    //     ++cacheEntry.referenceCount;
    //     return cacheEntry.resourceLoader;
    //   }
    //   return undefined;
    // }

    // // 添加资源到缓存
    // static add(resourceLoader) {
    //   ic.Check.typeOf.object("resourceLoader", resourceLoader);
    //   const cacheKey = resourceLoader.cacheKey;
    //   ic.Check.typeOf.string("options.resourceLoader.cacheKey", cacheKey);

    //   if (defined(ResourceCache.cacheEntries[cacheKey])) {
    //     ic.consoleLog("Resource with this cacheKey is already in the cache");
    //   }
    //   ResourceCache.cacheEntries[cacheKey] = new CacheEntry(resourceLoader);

    //   return resourceLoader;
    // }
  }

  class GltfJsonLoader {
    constructor() {}
    get cacheKey() {
      return this._cacheKey;
    }
  }

  ic.Cache = Cache;
  ic.ResourceCache = ResourceCache;
})(ICreator);

(function (ic) {
  ic.defined = function (value) {
    return value !== undefined && value !== null;
  };
  ic.Check.typeOf.object = function (name, test) {
    if (typeof test !== "object") {
      console.log("TypeError object");
    }
  };
  Check.typeOf.string = function (name, test) {
    if (typeof test !== "string") {
      console.log("TypeError string");
    }
  };
})(ICreator);
