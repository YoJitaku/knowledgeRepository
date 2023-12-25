(function (ic) {
  "use strict";

  function parse(Json) {
    //提取扩展
    const extensions = defaultValue(gltf.extensions, defaultValue.EMPTY_OBJECT);
    const structuralMetadataExtension = extensions.EXT_structural_metadata;
    const featureMetadataExtensionLegacy = extensions.EXT_feature_metadata;
    const cesiumRtcExtension = extensions.CESIUM_RTC;

    const nodes = loadNodes();
    //const skins = loadSkins();
    //const animations = loadAnimations();
    //const articulations = loadArticulations();
    const scene = loadScene();

    const components = new ic.GlbModel.components();
    const asset = new ic.GlbModel.Asset();

    //版权解析
    /*const copyright = gltf.asset.copyright;
    if (defined(copyright)) {
      const credits = copyright.split(";").map(function (string) {
        return new Credit(string.trim());
      });
      asset.credits = credits;
    }*/

    components.asset = asset;
    components.scene = scene;
    components.nodes = nodes;
    //components.skins = skins;
    //components.animations = animations;
    //components.articulations = articulations;
    //components.upAxis = loader._upAxis;
    //components.forwardAxis = loader._forwardAxis;

    /*
    if (
      ic.defined(structuralMetadataExtension) ||
      ic.defined(featureMetadataExtensionLegacy)
    ) {
      const promise = loadStructuralMetadata(
        loader,
        gltf,
        structuralMetadataExtension,
        featureMetadataExtensionLegacy,
        supportedImageFormats,
        frameState
      );
      loader._loaderPromises.push(promise);
    }*/
  }
  function loadTexture(
    loader,
    gltf,
    textureInfo,
    supportedImageFormats,
    frameState,
    samplerOverride
  ) {
    const imageId = GltfLoaderUtil.getImageIdFromTexture({
      gltf: gltf,
      textureId: textureInfo.index,
      supportedImageFormats: supportedImageFormats,
    });

    if (!defined(imageId)) {
      return undefined;
    }

    const textureLoader = ResourceCache.getTextureLoader({
      gltf: gltf,
      textureInfo: textureInfo,
      gltfResource: loader._gltfResource,
      baseResource: loader._baseResource,
      supportedImageFormats: supportedImageFormats,
      frameState: frameState,
      asynchronous: loader._asynchronous,
    });

    const textureReader = GltfLoaderUtil.createModelTextureReader({
      textureInfo: textureInfo,
    });

    const index = loader._textureLoaders.length;
    loader._textureLoaders.push(textureLoader);
    const promise = textureLoader.load().catch((error) => {
      if (loader.isDestroyed()) {
        return;
      }

      if (!loader._incrementallyLoadTextures) {
        // If incrementallyLoadTextures is false, throw the error to ensure the loader state
        // immediately is set to have failed
        throw error;
      }

      // Otherwise, save the error so it can be thrown next
      loader._textureState = GltfLoaderState.FAILED;
      loader._textureErrors.push(error);
    });
    loader._texturesPromises.push(promise);
    // This can only execute once textureLoader.process() has run and returns true
    // Save this finish callback by the loader index so it can be called
    // in process().
    loader._textureCallbacks[index] = () => {
      textureReader.texture = textureLoader.texture;
      if (defined(samplerOverride)) {
        textureReader.texture.sampler = samplerOverride;
      }
    };

    return textureReader;
  }
  //加载材质
  /*
  function loadMaterial(
    gltf,
    gltfMaterial,
  ) {
    const material = new Material();

    const extensions = defaultValue(
      gltfMaterial.extensions,
      defaultValue.EMPTY_OBJECT
    );
    const pbrSpecularGlossiness =
      extensions.KHR_materials_pbrSpecularGlossiness;
    const pbrMetallicRoughness = gltfMaterial.pbrMetallicRoughness;

    material.unlit = defined(extensions.KHR_materials_unlit);

    if (defined(pbrSpecularGlossiness)) {
      const specularGlossiness = new SpecularGlossiness();
      material.specularGlossiness = specularGlossiness;

      if (defined(pbrSpecularGlossiness.diffuseTexture)) {
        specularGlossiness.diffuseTexture = loadTexture(
          loader,
          gltf,
          pbrSpecularGlossiness.diffuseTexture,
          supportedImageFormats,
          frameState
        );
      }
      if (defined(pbrSpecularGlossiness.specularGlossinessTexture)) {
        if (defined(pbrSpecularGlossiness.specularGlossinessTexture)) {
          specularGlossiness.specularGlossinessTexture = loadTexture(
            loader,
            gltf,
            pbrSpecularGlossiness.specularGlossinessTexture,
            supportedImageFormats,
            frameState
          );
        }
      }
      specularGlossiness.diffuseFactor = fromArray(
        Cartesian4,
        pbrSpecularGlossiness.diffuseFactor
      );
      specularGlossiness.specularFactor = fromArray(
        Cartesian3,
        pbrSpecularGlossiness.specularFactor
      );
      specularGlossiness.glossinessFactor =
        pbrSpecularGlossiness.glossinessFactor;
      material.pbrSpecularGlossiness = pbrSpecularGlossiness;
    } else if (defined(pbrMetallicRoughness)) {
      const metallicRoughness = new MetallicRoughness();

      if (defined(pbrMetallicRoughness.baseColorTexture)) {
        metallicRoughness.baseColorTexture = loadTexture(
          loader,
          gltf,
          pbrMetallicRoughness.baseColorTexture,
          supportedImageFormats,
          frameState
        );
      }
      if (defined(pbrMetallicRoughness.metallicRoughnessTexture)) {
        metallicRoughness.metallicRoughnessTexture = loadTexture(
          loader,
          gltf,
          pbrMetallicRoughness.metallicRoughnessTexture,
          supportedImageFormats,
          frameState
        );
      }
      metallicRoughness.baseColorFactor = fromArray(
        Cartesian4,
        pbrMetallicRoughness.baseColorFactor
      );
      metallicRoughness.metallicFactor = pbrMetallicRoughness.metallicFactor;
      metallicRoughness.roughnessFactor = pbrMetallicRoughness.roughnessFactor;
      material.metallicRoughness = metallicRoughness;
    }

    // Top level textures
    if (defined(gltfMaterial.emissiveTexture)) {
      material.emissiveTexture = loadTexture(
        loader,
        gltf,
        gltfMaterial.emissiveTexture,
        supportedImageFormats,
        frameState
      );
    }
    // Normals aren't used for classification, so don't load the normal texture.
    if (defined(gltfMaterial.normalTexture) && !loader._loadForClassification) {
      material.normalTexture = loadTexture(
        loader,
        gltf,
        gltfMaterial.normalTexture,
        supportedImageFormats,
        frameState
      );
    }
    if (defined(gltfMaterial.occlusionTexture)) {
      material.occlusionTexture = loadTexture(
        loader,
        gltf,
        gltfMaterial.occlusionTexture,
        supportedImageFormats,
        frameState
      );
    }
    material.emissiveFactor = fromArray(
      Cartesian3,
      gltfMaterial.emissiveFactor
    );
    material.alphaMode = gltfMaterial.alphaMode;
    material.alphaCutoff = gltfMaterial.alphaCutoff;
    material.doubleSided = gltfMaterial.doubleSided;

    return material;
  }*/

  //加载索引
  function loadIndices(gltf, accessorId) {
    const accessor = gltf.accessors[accessorId];
    const bufferViewId = accessor.bufferView;

    if (!defined(draco) && !defined(bufferViewId)) {
      return undefined;
    }

    const indices = new ic.GlbModel.Indices();
    indices.count = accessor.count;

    /*
   
   const loadAttributesAsTypedArray = loader._loadAttributesAsTypedArray;
    // Load the index buffer as a typed array to generate wireframes in WebGL1.
    const loadForWireframe =
      loader._loadIndicesForWireframe && !frameState.context.webgl2;
  
    // Load the index buffer as a typed array to batch features together for classification.
    const loadForClassification = loader._loadForClassification && hasFeatureIds;
  
    // Whether the final output should be a buffer or typed array
    // after loading and post-processing.
    const outputTypedArrayOnly = loadAttributesAsTypedArray;
    const outputBuffer = !outputTypedArrayOnly;
    const outputTypedArray =
      loadAttributesAsTypedArray || loadForWireframe || loadForClassification;
  
    // Determine what to load right now:
    //
    // - If post-processing is needed, load a packed typed array for
    //   further processing, and defer the buffer loading until later.
    // - On the other hand, if post-processing is not needed, set the load
    //   flags directly
    const loadBuffer = needsPostProcessing ? false : outputBuffer;
    const loadTypedArray = needsPostProcessing ? true : outputTypedArray;
  
    const indexBufferLoader = getIndexBufferLoader(
      loader,
      gltf,
      accessorId,
      draco,
      loadBuffer,
      loadTypedArray,
      frameState
    );
  
    const index = loader._geometryLoaders.length;
    loader._geometryLoaders.push(indexBufferLoader);
    const promise = indexBufferLoader.load();
    loader._loaderPromises.push(promise);
    // This can only execute once indexBufferLoader.process() has run and returns true
    // Save this finish callback by the loader index so it can be called
    // in process().
    loader._geometryCallbacks[index] = () => {
      indices.indexDatatype = indexBufferLoader.indexDatatype;
      indices.buffer = indexBufferLoader.buffer;
      indices.typedArray = indexBufferLoader.typedArray;
    };
  
    const indicesPlan = new PrimitiveLoadPlan.IndicesLoadPlan(indices);
    indicesPlan.loadBuffer = outputBuffer;
    indicesPlan.loadTypedArray = outputTypedArray;
  
    return indicesPlan;
    */
  }

  //加载片元
  function loadPrimitive(gltfJson, gltfPrimitive) {
    //获取片元定义
    const primitive = new ic.GlbModel.Primitive();
    //const primitivePlan = new PrimitiveLoadPlan(primitive);

    //加载材质
    /*
    const materialId = gltfPrimitive.material;
    if (ic.defined(materialId)) {
      primitive.material = loadMaterial(gltf, gltf.materials[materialId]);
    }
    */

    //扩展信息
    /*
    const extensions = defaultValue(
      gltfPrimitive.extensions,
      defaultValue.EMPTY_OBJECT
    );

    let needsPostProcessing = false;
    const outlineExtension = extensions.CESIUM_primitive_outline;
    if (loader._loadPrimitiveOutline && defined(outlineExtension)) {
      needsPostProcessing = true;
      primitivePlan.needsOutlines = true;
      primitivePlan.outlineIndices = loadPrimitiveOutline(
        loader,
        gltf,
        outlineExtension,
        primitivePlan
      );
    }

    const loadForClassification = loader._loadForClassification;
    const draco = extensions.KHR_draco_mesh_compression;
    */

    //顶点属性
    let hasFeatureIds = false;
    const attributes = gltfPrimitive.attributes;
    if (ic.defined(attributes)) {
      for (const semantic in attributes) {
        /*
        if (attributes.hasOwnProperty(semantic)) {
          const accessorId = attributes[semantic];
          const semanticInfo = getSemanticInfo(
            loader,
            VertexAttributeSemantic,
            semantic
          );

          const modelSemantic = semanticInfo.modelSemantic;
          if (
            loadForClassification &&
            !isClassificationAttribute(modelSemantic)
          ) {
            continue;
          }

          if (modelSemantic === VertexAttributeSemantic.FEATURE_ID) {
            hasFeatureIds = true;
          }

          const attributePlan = loadVertexAttribute(
            loader,
            gltf,
            accessorId,
            semanticInfo,
            draco,
            hasInstances,
            needsPostProcessing,
            frameState
          );

          primitivePlan.attributePlans.push(attributePlan);
          primitive.attributes.push(attributePlan.attribute);*/
      }
    }

    //MorphTarget
    /*
    const targets = gltfPrimitive.targets;
    // Morph targets are disabled for classification models.
    if (defined(targets) && !loadForClassification) {
      const targetsLength = targets.length;
      for (let i = 0; i < targetsLength; ++i) {
        primitive.morphTargets.push(
          loadMorphTarget(
            loader,
            gltf,
            targets[i],
            needsPostProcessing,
            primitivePlan,
            frameState
          )
        );
      }
    }*/

    //索引
    const indices = gltfPrimitive.indices;
    if (ic.defined(indices)) {
      // const indicesPlan = loadIndices(
      //   gltf,
      //   indices,
      // );
      // if (ic.defined(indicesPlan)) {
      //   primitivePlan.indicesPlan = indicesPlan;
      //   primitive.indices = indicesPlan.indices;
      // }
    }

    //特征ID和结构性元数据
    // Load feature Ids
    /*if (defined(meshFeatures)) {
      loadPrimitiveFeatures(
        loader,
        gltf,
        primitive,
        meshFeatures,
        supportedImageFormats,
        frameState
      );
    } else if (hasFeatureMetadataLegacy) {
      loadPrimitiveFeaturesLegacy(
        loader,
        gltf,
        primitive,
        featureMetadataLegacy,
        supportedImageFormats,
        frameState
      );
    }

    // Load structural metadata
    if (defined(structuralMetadata)) {
      loadPrimitiveMetadata(primitive, structuralMetadata);
    } else if (hasFeatureMetadataLegacy) {
      loadPrimitiveMetadataLegacy(loader, primitive, featureMetadataLegacy);
    }

    const primitiveType = gltfPrimitive.mode;
    if (loadForClassification && primitiveType !== PrimitiveType.TRIANGLES) {
      throw new RuntimeError(
        "Only triangle meshes can be used for classification."
      );
    }
    primitive.primitiveType = primitiveType;
    */

    //片元类型
    const primitiveType = gltfPrimitive.mode;
    if (loadForClassification && primitiveType !== PrimitiveType.TRIANGLES) {
      console.log("Only triangle meshes can be used for classification.");
    }
    primitive.primitiveType = primitiveType;

    return primitive;
  }

  //加载单个节点
  function loadNode(gltfJson, gltfJsonNode) {
    //新建一个节点对象
    const node = new ic.GlbModel.Node();

    //解包数据
    node.name = gltfJsonNode.name;
    node.matrix = fromArray(Matrix4, gltfJsonNode.matrix);
    node.translation = fromArray(Cartesian3, gltfJsonNode.translation);
    node.rotation = fromArray(Quaternion, gltfJsonNode.rotation);
    node.scale = fromArray(Cartesian3, gltfJsonNode.scale);

    //扩展
    /*const nodeExtensions = defaultValue(
      gltfJsonNode.extensions,
      defaultValue.EMPTY_OBJECT
    );
    const instancingExtension = nodeExtensions.EXT_mesh_gpu_instancing;
    const articulationsExtension = nodeExtensions.AGI_articulations;
    if (ic.defined(instancingExtension)) {
      if (loader._loadForClassification) {
        console.log(
          "Models with the EXT_mesh_gpu_instancing extension cannot be used for classification."
        );
      }
      node.instances = loadInstances(loader, gltf, nodeExtensions, frameState);
    }

    if (ic.defined(articulationsExtension)) {
      node.articulationName = articulationsExtension.articulationName;
    }*/

    //该节点下是否有mesh信息
    const meshId = gltfJsonNode.mesh;
    if (ic.defined(meshId)) {
      const mesh = gltfJson.meshes[meshId];
      const primitives = mesh.primitives;
      const primitivesLength = primitives.length;
      //遍历片元
      for (let i = 0; i < primitivesLength; ++i) {
        //节点里存片元队列
        node.primitives.push(loadPrimitive(gltfJson, primitives[i]));
      }

      /*
      // If the node has no weights array, it will look for the weights array provided
      // by the mesh. If both are undefined, it will default to an array of zero weights.
      const morphWeights = defaultValue(gltfNode.weights, mesh.weights);
      const targets = node.primitives[0].morphTargets;
      const targetsLength = targets.length;

      // Since meshes are not stored as separate components, the mesh weights will still
      // be stored at the node level.
      node.morphWeights = defined(morphWeights)
        ? morphWeights.slice()
        : new Array(targetsLength).fill(0.0);
        */
    }

    return node;
  }

  //加载节点树
  function loadNodes(gltfJson) {
    //有定义
    if (!ic.defined(gltfJson.nodes)) {
      return [];
    }

    //遍历准备
    let i, j;
    const nodesLength = gltfJson.nodes.length;
    const nodes = new Array(nodesLength);
    for (i = 0; i < nodesLength; ++i) {
      //单个节点的加载
      const node = loadNode(gltfJson, gltfJson.nodes[i]);
      node.index = i;
      nodes[i] = node;
    }

    for (i = 0; i < nodesLength; ++i) {
      const childrenNodeIds = gltfJson.nodes[i].children;
      if (ic.defined(childrenNodeIds)) {
        const childrenLength = childrenNodeIds.length;
        for (j = 0; j < childrenLength; ++j) {
          nodes[i].children.push(nodes[childrenNodeIds[j]]);
        }
      }
    }

    return nodes;
  }

  //function loadSkins() {}
  //function loadAnimations() {}
  //function loadArticulations() {}

  function getSceneNodeIds(gltf) {
    let nodesIds;
    if (ic.defined(gltf.scenes) && ic.defined(gltf.scene)) {
      nodesIds = gltf.scene[gltf.scene].nodes;
    }
    nodesIds = defaultValue(nodesIds, gltf.nodes);
    nodesIds = defined(nodesIds) ? nodesIds : [];
    return nodesIds;
  }

  function loadScene(gltfJson, nodes) {
    const scene = new Scene();
    const sceneNodeIds = getSceneNodeIds(gltfJson);
    scene.nodes = sceneNodeIds.map(function (sceneNodeIds) {
      return nodes[sceneNodeIds];
    });
    return scene;
  }

  //实例
  function loadInstances(loader, gltf, nodeExtensions, frameState) {
    const instancingExtension = nodeExtensions.EXT_mesh_gpu_instancing;

    const instances = new Instances();
    const attributes = instancingExtension.attributes;
    if (defined(attributes)) {
      for (const semantic in attributes) {
        if (attributes.hasOwnProperty(semantic)) {
          const accessorId = attributes[semantic];
          instances.attributes.push(
            loadInstancedAttribute(
              loader,
              gltf,
              accessorId,
              attributes,
              semantic,
              frameState
            )
          );
        }
      }
    }

    const instancingExtExtensions = defaultValue(
      instancingExtension.extensions,
      defaultValue.EMPTY_OBJECT
    );
    const instanceFeatures = nodeExtensions.EXT_instance_features;
    const featureMetadataLegacy = instancingExtExtensions.EXT_feature_metadata;

    if (defined(instanceFeatures)) {
      loadInstanceFeatures(instances, instanceFeatures);
    } else if (defined(featureMetadataLegacy)) {
      loadInstanceFeaturesLegacy(
        gltf,
        instances,
        featureMetadataLegacy,
        loader._sortedPropertyTableIds
      );
    }

    return instances;
  }
  
  //function loadSkin() {}
  //function loadAnimation() {}
  //function loadArticulation() {}

  //async function loadStructuralMetadata() {}
})(ICreator);
