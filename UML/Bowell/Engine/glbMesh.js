(function (ic) {
  "use strict";

  let Super = ic.Mesh;

  let GlbMesh = function (option) {
    option = option || {};
    let flipUV = option.flipUV || false;
    let uvw = option.uvw || new ic.Vec3.One();
    Super.call(this, "testName");

    let position = [];
    let normals = [];
    let uvs = [];
    let flipUvs = [];
    let indices = [];
    let meshLayout = new ic.MeshLayout();
    let attributesLayout = [{ name: ic.Position, size: 3, data: position }, {}];
    meshLayout.addAttributes([], ic.Float32, ic.Static);

    meshLayout.setIndex(indices, ic.Static);
    this.buildByLayout(meshLayout);
  };
  GlbMesh.prototype = ic.inheritPrototype(Super, {
    constructor: GlbMesh,
  });

  ic.GlbMesh = GlbMesh;
})(ICreator);

nodes[0].children[0].primitives[0].attributes[1].typedArray