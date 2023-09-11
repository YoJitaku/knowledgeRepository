# Babylonjs_Note
## 环境配置
1. Playground编辑器
```js
babylon使用HTML5的canvas元素作为容器
Playground是在线代码编辑器
babylon使用pointer事件而不是mouse，需要加载PEP.js
```
2. 自己搭建HTML
```js
添加canvas到body中 //决定了3D场景的渲染位置
将canvas引入到js代码中 //用于初始化babylon engine
得到engine对象创建3D Scene
渲染Scene //Playground中自动完成
(engine对象的runRenderLoop方法)
1. 60fps
2. 窗口大小自适应
```
3. 在项目中引用babylonjs
```js
babylonjs - babylon的核心库，引入它就能让程序跑起来，下面的是功能补充的库
babylonjs-materials - 集合了babylon官方提供的一组高级材质，提供更炫酷的效果
babylonjs-loaders - 能够让babylon支持导入OBJ, STL, glTF等3d文件
babylonjs-post-process - 后期特效库，能够让场景展示电影级别的滤镜效果
babylonjs-procedural-textures - babylon官方提供的一组纹理贴图，可以展示更酷的效果
babylonjs-serializers - 能够把场景Scene和物体mesh等元素序列化成为json配置并导出
babylonjs-gui - 交互组件库，支持按钮、复选框、下拉列表等表单元素
babylonjs-inspector - 对babylon的3d场景进行运行时调试，可详细记录并显示babylon甚至webGL的运行情况，非常强大
babylonjs-viewer - Babylon查看器，几行代码就能让3d内容展示到网页上
```
4. 超级大混乱名词合集
```js
vue是基于ES6的js框架
ES6是js的一套标准规范
node是基于chrome v8引擎的js运行环境(js需要运行在宿主环境中，并且需要调用宿主环境提供的底层API，node就是其中一种宿主环境)
npm是node的包管理器
```
### GLTF格式
```js
gltf是3Dapp之间传输3D场景和模型的格式
babylon js-loader插件
```
# 公开课WebGL
```js
Step 0 Get DOM Objects
获取canvas
```
```js
Step 1 Init WebGL
获取context->webgl or webgl2
```
```js
Step 2 Function to extract shader code from DOM
function getshader(id)
从外部输入vertex shader 和 fragment shader文件
```
```js
Step 3 Compile shaders into a program
创建vtxShader和fragShader
创建Program
attach vtxShader and fragShader
LinkProgram
UseProgram
```
```js
Step 4 Attributes
getAttribLocation
enableVertexAttribArray
```
```js
Step 5 Shaders uniforms(variables)
getUniformLocation
创建投影矩阵 模型矩阵
```
```js
Step 6 Mesh's buffers
创建buffer
绑定buffer
创建vertices数组
创建单位向量
```
```js
Step 7 Render
渲染循环renderLoop
clearColor
clearBuffer
设置投影矩阵
单位化投影矩阵
translate
rotate
scale
将shader传给GPU
drawArrays
```
```js
Final Step Just Go!
```
## chapter1
```js
基本渲染流程
wireframing     //线框绘制
rasterization   //光栅化
flat shading    //平面着色 整个三角形都用同一个颜色，同一个法线
gouraud shading //每个顶点单独计算颜色后进行线性插值得到片元颜色，所有像素同一个法线，不同颜色插值
Phong shading   //对每个片元进行着色计算，光亮表面的效果号，所有像素有各自的法线插值和颜色插值
texture mapping
```
## chapter2
```js
WebGL做了一些事，但是下面的得自己做
create shaders code
create geometry and topology
handle textures and resources management
manage the render loop
```
## chapter3
```js

```

# WebGL 1.0笔记
1. WebGL是用来run你电脑上的GPU的
2. 需要手动以函数对pairs of functions的形式提供代码给GPU
3. 分别是Vertex shader和fragment shader(片段着色器),由非常严格的类C/C++语言写成，把它叫做GLSL
4. 依靠vtx shader, WebGL可以光栅化rasterize点，线，三角面
5. 光栅化就是调用frag shader添加和计算颜色信息
6. 几乎所有的WebGL API是关于设置这两个shader运行状态的
7. gl.drawArrays, gl.drawElement是调用最多的GPU执行函数
8. 所有数据都需要提供给GPU, 有四种数据
8-1.Attributes and Buffers: 缓冲区是2进制数据，包含positions, normals, texture coordinates, vertex colors
8-2. 
8-3.
8-4.
# TIPS/要点
1. diffuseColor/SpecularColor都需要光源中带有目标颜色。否则不反射/不高光
2. ambientColor/环境纹理，同上也需要设置场景的环境颜色，且包含环境纹理目标颜色，否则不反射


# Camera
```js
//cross product 叉积
function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];
}
//向量相减
function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
//单位化向量
function normalize(v) {
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // 确定不会除以 0
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}
//有CameraPosition有TargetPosition，计算Camera朝向的矩阵
var m4 = {
  lookAt: function(cameraPosition, target, up) {
    var zAxis = normalize(
        subtractVectors(cameraPosition, target));
    var xAxis = normalize(cross(up, zAxis));
    var yAxis = normalize(cross(zAxis, xAxis));
 
    return [
       xAxis[0], xAxis[1], xAxis[2], 0,
       yAxis[0], yAxis[1], yAxis[2], 0,
       zAxis[0], zAxis[1], zAxis[2], 0,
       cameraPosition[0], cameraPosition[1], cameraPosition[2], 1,
    ];
  }
  +----+----+----+----+
| Xx | Xy | Xz |  0 |  <- x axis
+----+----+----+----+
| Yx | Yy | Yz |  0 |  <- y axis
+----+----+----+----+
| Zx | Zy | Zz |  0 |  <- z axis
+----+----+----+----+
| Tx | Ty | Tz |  1 |  <- 相机位置
+----+----+----+----+
1.相机在场景世界中的的期望位置CameraPosition
2.与target目标位置相减得到相对于Camera的Z向量
3.Z向量与Up单位向量叉积得到相对与Camera的X向量
4.Z向量与X向量叉积得到相对于Camrra的Y向量
5.通过相机矩阵的逆矩阵得到ViewMatrix视图矩阵
6.对场景中的所有物体矩阵×视图矩阵
//我们要让lookfat函数返回相机矩阵而不是视图矩阵，应用将会更广泛
```
# Light
DirectionLight
```js
光的方向和面的方向点乘
dot(a,b)，得到范围-1到1的值
//-1方向相反
//1方向相同
立方体顶点处有多个法向量，用于描述相邻面的朝向

实时光照，物体改变位置时法向量重定向，光照重新计算
！！！重点问题
世界矩阵对物体缩放之后，物体表面法向量可能和拉伸之后的面不垂直
从而导致光照错误！！！
解决方法是世界矩阵的逆矩阵然后求转置transpose
var m4 = {
  transpose: function(m) {
    return [
      m[0], m[4], m[8], m[12],
      m[1], m[5], m[9], m[13],
      m[2], m[6], m[10], m[14],
      m[3], m[7], m[11], m[15],
    ];
  },
得到WorldInverseTransposeLocationMtx

void main() {
  // 将位置和矩阵相乘
  gl_Position = u_worldViewProjection * a_position;
 
  // 重定向法向量并传递给片段着色器
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
}
```
PointLight
```js
光源位置和物体表面点计算得到面到光源的向量，面本身还有个有法向量
片段着色器中需要将表面到光源的方向进行单位化
//注意：在片段着色器中需要将表面到光源的方向进行单位化， 注意，虽然我们可以在顶点着色器中传递单位向量， 但是 varying 会进行插值再传给片段着色器， 所以片段着色器中的向量基本上不是单位向量了。
物体表面到光源SurfaceLightVec + 物体表面到相机SurfaceCameraVec / 2 = HalfVec
如果HalfVec和Surface法向量相同即dot(HalfVec, Surface) = 1则高光启动 = 0垂直 = -1相反

//shininess将高光算法从线性变成指数pow(a,b)
//注意pow(a,b)方法在a为负值b为小数时会产生Undefined
uniform float u_shininess;
float specular = 0.0;
if (light > 0.0) {
    specular = pow(dot(normal, halfVector), u_shininess);
  }
// 设置亮度
var shininessLocation = gl.getUniformLocation(program, "u_shininess");
gl.uniform1f(shininessLocation, shininess);

// 只将颜色部分（不包含 alpha） 和光照相乘
// gl_FragColor.rgb *= light * u_lightColor; 
// var lightColorLocation = gl.getUniformLocation(program, "u_lightColor");
// gl.uniform3fv(lightColorLocation, m4.normalize([1, 0.6, 0.6]));  // 红光

// 直接和高光相加
gl_FragColor.rgb += specular * u_specularColor;
var specularColorLocation = gl.getUniformLocation(program, "u_specularColor");
gl.uniform3fv(specularColorLocation, m4.normalize([1, 0.6, 0.6])); // 红光
```
SpotLight
```js
给点光源一个方向向量LightDirection，然后点积得到角度范围-1到1
规定SpotLight范围大小，值在点积(点乘/内积)空间中取
角度   |   弧度   | 点积空间
 --------+---------+----------
    0    |   0.0   |    1.0
    22   |    .38  |    .93
    45   |    .79  |    .71
    67   |   1.17  |    .39
    90   |   1.57  |    0.0
   180   |   3.14  |   -1.0

dotFromDirection = dot(surfaceToLight, -lightDirection)
if (dotFromDirection >= limitInDotSpace) {
   // 使用光照
}
tips:尽量不在Shader中使用if等条件语句
//GLSL函数Step
function step(a, b) {
   if (b >= a) {
       return 1;
   } else {
       return 0;
   }
}
//升级 shader中
float dotFromDirection = dot(surfaceToLightDirection, -u_lightDirection);
//如果光线在聚光灯范围内 inLight 就为 1，否则为 0
float inLight = step(u_limit, dotFromDirection);
float light = inLight * dot(normal, surfaceToLightDirection);
float specular = inLight * pow(dot(normal, halfVector), u_shininess);

//过渡升级 shader中
float dotFromDirection = dot(surfaceToLightDirection, -u_lightDirection);
//float inLight = step(u_limit, dotFromDirection);删除替代
//float limitRange = u_innerLimit - u_outerLimit;//内部限定和外部限定
//clamp(min最小值, val首选值, max最大值) = max(min, min(val, max))
//float inLight = clamp((0.0, dotFromDirection - u_outerLimit) / limitRange, 1.0); 官方文档里第一第二个的参数反了
//注意GLSL中的Undefined, 当inner = outer时 LimitRange = 0,但除数不能为0
float inLight = smoothstep(u_outerLimit, u_innerLimit, dotFromDirection); 
//！！注意 smoothstep不是线性插值而是Hermite插值
//！！注意 smoothstep方法在lowerbound大于或等于upperbound时会产生undefined
float light = inLight * dot(normal, surfaceToLightDirection);
float specular = inLight * pow(dot(normal, halfVector), u_shininess);
```