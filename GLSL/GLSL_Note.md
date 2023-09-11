# GLSL笔记
## 介绍
1. Parallel processing并行处理(每个像素和顶点都是并行计算)
2. 内部数据格式很严格(C like)
3. 内部语句必须加分号;
4. The Vec Class
```ts
vec2 v = vec2(0.5);
ivec2 i = ivec2(2);
bvec b = bvec2(true);
```
5. The if statement(可以用if语句)
6. Loop
```ts
const int count = 10;//必须加const 和 int
for(let i = 0; i<count; i++){
//...
}
```
7. function(可以overload 即同名不同实现的重载)
```ts
void FuncName(vec2 p1, ivec2 p2, bvec2 p3){
  //void return
}
```

## Vtx结构
1. 必须有主函数void main(){}
```ts
最先被call
void main(){
}
```
2. 必须设置gl_Position通过下面3+1个移动步骤
```ts
2-1 modelMatrix: moves the vtx from local to world space
2-2 viewMatrix: moves the vtx from world space to camera view
2-3 projectionMatrix: moves the vtx to clip space screen coordinates
+1 modelViewMatrix: combines the result of 2-1 and 2-2
```

## Frag结构
1. 同样要有主函数
2. 必须设置gl_FragColor为一个RGBA格式的的值(RGBA在0-1之间)