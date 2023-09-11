# NOTE
node --version
npm init
npm install express
```js
const express = require('express')
const app = express()
app.use(express.static("public"))
app.listen(3000)
```
node server.js

# Init Set
```js
const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')

if (!gl) {
  throw new Error('webgl not supported')
}

// vertexData = [...]
// 画布中心为0,0 上右为正,vtxIndex为顺时针
const vertexData = [
  0, 1, 0,
  1, -1, 0,
  -1, -1, 0,
]

// create buffer 
// bind buffer 
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

// load vertexData into buffer
// 用的 float 32 的 array 数组
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.DYNAMIC_DRAW);

// create vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, `
attribute vec3 position;
void main(){
  gl_Position = vec4(position, 1);
}
`)
gl.compileShader(vertexShader);

// create fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, `
void main(){
  gl_FragColor = vec4(1, 0, 0, 1);
}
`)
gl.compileShader(fragmentShader)

// create program
var program = gl.createProgram()

// attach shaders to program
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)

// enable vertex attributes
const posisionLocation = gl.getAttribLocation(program, `position`)
gl.enableVertexAttribArray(posisionLocation)
gl.vertexAttribPointer(posisionLocation, 3, gl.FLOAT, false, 0, 0)

// draw
gl.useProgram(program)
gl.drawArrays(gl.TRIANGLES, 0, 3)
```

# 官方文档
## chapter1 基础知识
```js
1. WebGL在GPU中运行,仅仅是个光栅化引擎
2. 两个draw函数gl.drawArrays和gl.drawElements
3. 重要概念：Attributes/buffers/Uniforms/Textures/Varyings
buffers: 向GPU发送的二进制数据序列，通常包含位置，法向量，纹理坐标，顶点颜色等
Attributes: 设置如何从buffer获取数据给GPU, (比如Position是3个32位浮点型), buffer可以有多个, Attributes需要指明是哪个, 从哪开始到哪结束, 偏移值等
Uniforms: 全局变量，一直有效，着色程序运行前赋值
Textures: 仅仅是数据队列, 一般储存图像数据, 也可以随便存其他的
Varyings: VtxShader给FragmentShader传值的方式(插值方式)(3个Shading Frequencies着色频率)

```
4. WebGL只关心1+1: 裁剪空间坐标值(裁剪范围-1,1) + 颜色相关值(值范围0,1)
5. fragment没有默认精度：需要mediump->medium precision中等精度
6. 渲染前调整canvas尺寸,实际像素个数和显示大小
```js
webglUtils.resizeCanvasToDisplaySize(gl.canvas);  //针对Canvas设置,weigl自动调整
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); //传递canvas当前尺寸给WebGl用于裁剪空间
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program); // 告诉它用我们之前写好的着色程序（一个着色器对）
gl.enableVertexAttribArray(positionAttributeLocation); //启用对应属性，buffers->shader
```

## chapter2 基础设置
1. 图像处理
```js
模糊，锐化，边缘检测，平滑
```
2. 2DMatrix
```js
1. 3*3的矩阵,
一个矩阵能代表三种所有变换,矩阵相乘对层级变换很重要
2. 单位阵
matrixX * identity = matrixX
var m3 = {
  identity: function() {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];
  },
3. translate Mtx

[1.0 0.0 0.0]
[0.0 1.0 0.0]
[tx  ty  1.0]

newX = x + tx;
newY = y + ty;

4. rotate mtx
[c  -s   0.0]
[s   c   0.0]
[0.0 0.0 1.0]

s = Math.sin(angleToRotateInRadians);
c = Math.cos(angleToRotateInRadians);

newX = x *  c + y * s;
newY = x * -s + y * c;

5. scale mtx

[sx  0.0 0.0]
[0.0 sy  0.0]
[0.0 0.0 1.0]

newX = x * sx;
newY = y * sy;

6. 3DMatrix

```

## chapter3 高级技术
三次贝塞尔曲线
```js
invT = (1 - t)
P = P1 * invT^3 +
    P2 * 3 * t * invT^2 +
    P3 * 3 * invT * t^2 +
    P4 * t^3
```