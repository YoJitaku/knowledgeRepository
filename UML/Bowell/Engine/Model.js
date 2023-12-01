/* ==================================================================
 * Copyright (c) 2023 by Bowell_DT. All Rights Reserved.
 * ===================================================================
 * Author: Yusz.
 * Version: 1.0.
 * Description: glTF数据格式全定义.
 */
(function (ic) {
  "use strict";

  const GlbModel = {};

  function Quantization() {
    this.octEncoded = false;
    this.octEncodedZXY = false;
    this.normalizationRange = undefined;
    this.quantizedVolumeOffset = undefined;
    this.quantizedVolumeDimensions = undefined;
    this.quantizedVolumeStepSize = undefined;
    this.componentDatatype = undefined;
    this.type = undefined;
  }

  function Attribute() {
    this.name = undefined;
    this.semantic = undefined;
    this.setIndex = undefined;
    this.componentDatatype = undefined;
    this.type = undefined;
    this.normalized = false;
    this.count = undefined;
    this.min = undefined;
    this.max = undefined;
    this.constant = undefined;
    this.quantization = undefined;
    this.typedArray = undefined;
    this.buffer = undefined;
    this.byteOffset = 0;
    this.byteStride = undefined;
  }

  function Indices() {
    this.indexDatatype = undefined;
    this.count = undefined;
    this.buffer = undefined;
    this.typedArray = undefined;
  }

  function FeatureIdAttribute() {
    this.featureCount = undefined;
    this.nullFeatureId = undefined;
    this.propertyTableId = undefined;
    this.setIndex = undefined;
    this.label = undefined;
    this.positionalLabel = undefined;
  }

  function FeatureIdImplicitRange() {
    this.featureCount = undefined;
    this.nullFeatureId = undefined;
    this.propertyTableId = undefined;
    this.offset = 0;
    this.repeat = undefined;
    this.label = undefined;
    this.positionalLabel = undefined;
  }

  function FeatureIdTexture() {
    this.featureCount = undefined;
    this.nullFeatureId = undefined;
    this.propertyTableId = undefined;
    this.textureReader = undefined;
    this.label = undefined;
    this.positionalLabel = undefined;
  }

  function MorphTarget() {
    this.attributes = [];
  }

  function Primitive() {
    this.attributes = [];
    this.morphTargets = [];
    this.indices = undefined;
    this.material = undefined;
    this.primitiveType = undefined;
    this.featureIds = [];
    this.propertyTextureIds = [];
    this.propertyAttributeIds = [];
    this.outlineCoordinates = undefined;
  }

  function Instances() {
    this.attributes = [];
    this.featureIds = [];
    this.transformInWorldSpace = false;
  }

  function Skin() {
    this.index = undefined;
    this.joints = [];
    this.inverseBindMatrices = [];
  }

  function Node() {
    this.name = undefined;
    this.index = undefined;
    this.children = [];
    this.primitives = [];
    this.instances = undefined;
    this.skin = undefined;
    this.matrix = undefined;
    this.translation = undefined;
    this.rotation = undefined;
    this.scale = undefined;
    this.morphWeights = [];
    this.articulationName = undefined;
  }

  function Scene() {
    this.nodes = [];
  }

  function AnimationSampler() {
    this.input = [];
    this.interpolation = undefined;
    this.output = [];
  }

  function AnimationTarget() {
    this.node = undefined;
    this.path = undefined;
  }

  function AnimationChannel() {
    this.sampler = undefined;
    this.target = undefined;
  }

  function Animation() {
    this.name = undefined;
    this.samplers = [];
    this.channels = [];
  }

  function ArticulationStage() {
    this.name = undefined;
    this.type = undefined;
    this.minimumValue = undefined;
    this.maximumValue = undefined;
    this.initialValue = undefined;
  }

  function Articulation() {
    this.name = undefined;
    this.stages = [];
  }

  function Asset() {
    this.credits = [];
  }

  function Components() {
    this.asset = new Asset();
    this.scene = undefined;
    this.nodes = [];
    this.skins = [];
    this.animations = [];
    this.articulations = [];
    this.structuralMetadata = undefined;
    this.upAxis = undefined;
    this.forwardAxis = undefined;
    this.transform = Matrix4.clone(Matrix4.IDENTITY);
  }

  function TextureReader() {
    this.texture = undefined;
    this.index = undefined;
    this.texCoord = 0;
    this.transform = Matrix3.clone(Matrix3.IDENTITY);
    this.channels = undefined;
  }

  function MetallicRoughness() {
    this.baseColorTexture = undefined;
    this.metallicRoughnessTexture = undefined;
    this.baseColorFactor = Cartesian4.clone(
      MetallicRoughness.DEFAULT_BASE_COLOR_FACTOR
    );
    this.metallicFactor = MetallicRoughness.DEFAULT_METALLIC_FACTOR;
    this.roughnessFactor = MetallicRoughness.DEFAULT_ROUGHNESS_FACTOR;
  }

  MetallicRoughness.DEFAULT_BASE_COLOR_FACTOR = Cartesian4.ONE;
  MetallicRoughness.DEFAULT_METALLIC_FACTOR = 1.0;
  MetallicRoughness.DEFAULT_ROUGHNESS_FACTOR = 1.0;

  function SpecularGlossiness() {
    this.diffuseTexture = undefined;
    this.specularGlossinessTexture = undefined;
    this.diffuseFactor = Cartesian4.clone(
      SpecularGlossiness.DEFAULT_DIFFUSE_FACTOR
    );
    this.specularFactor = Cartesian3.clone(
      SpecularGlossiness.DEFAULT_SPECULAR_FACTOR
    );
    this.glossinessFactor = SpecularGlossiness.DEFAULT_GLOSSINESS_FACTOR;
  }

  SpecularGlossiness.DEFAULT_DIFFUSE_FACTOR = Cartesian4.ONE;
  SpecularGlossiness.DEFAULT_SPECULAR_FACTOR = Cartesian3.ONE;
  SpecularGlossiness.DEFAULT_GLOSSINESS_FACTOR = 1.0;

  function Material() {
    this.metallicRoughness = new MetallicRoughness();
    this.specularGlossiness = undefined;
    this.emissiveTexture = undefined;
    this.normalTexture = undefined;
    this.occlusionTexture = undefined;
    this.emissiveFactor = Cartesian3.clone(Material.DEFAULT_EMISSIVE_FACTOR);
    this.alphaMode = AlphaMode.OPAQUE;
    this.alphaCutoff = 0.5;
    this.doubleSided = false;
    this.unlit = false;
  }

  Material.DEFAULT_EMISSIVE_FACTOR = Cartesian3.ZERO;

  // const AnimatedPropertyType = {
  //   TRANSLATION: "translation",
  //   ROTATION: "rotation",
  //   SCALE: "scale",
  //   WEIGHTS: "weights",
  // };

  GlbModel.Quantization = Quantization;
  GlbModel.Attribute = Attribute;
  GlbModel.Indices = Indices;
  GlbModel.FeatureIdAttribute = FeatureIdAttribute;
  GlbModel.FeatureIdTexture = FeatureIdTexture;
  GlbModel.FeatureIdImplicitRange = FeatureIdImplicitRange;
  GlbModel.MorphTarget = MorphTarget;
  GlbModel.Primitive = Primitive;
  GlbModel.Instances = Instances;
  GlbModel.Skin = Skin;
  GlbModel.Node = Node;
  GlbModel.Scene = Scene;
  //GlbModel.AnimatedPropertyType = Object.freeze(AnimatedPropertyType);
  GlbModel.AnimationSampler = AnimationSampler;
  GlbModel.AnimationTarget = AnimationTarget;
  GlbModel.AnimationChannel = AnimationChannel;
  GlbModel.Animation = Animation;
  GlbModel.ArticulationStage = ArticulationStage;
  GlbModel.Articulation = Articulation;
  GlbModel.Asset = Asset;
  GlbModel.Components = Components;
  GlbModel.TextureReader = TextureReader;
  GlbModel.MetallicRoughness = MetallicRoughness;
  GlbModel.SpecularGlossiness = SpecularGlossiness;
  GlbModel.Material = Material;
})(ICreator);
