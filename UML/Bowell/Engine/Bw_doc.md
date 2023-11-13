# Bowell_Engine 学习文档

## 一.文档结构

### 1.知识储备

### 2.引擎结构

### 3.学习顺序

## 二.格式转换器

### 1.模型输入分流

#### 1.1 windows/批处理

#### 1.2 Linux/Shell

### 2.第三方工具转 FBX

#### 2.1 Blender 工具

#### 2.2 Maya 工具

#### 2.3 3DMAX 工具

### 3.FBX 解析

#### 3.1 FBXSDK 介绍

#### 3.2 数据分类

##### 3.2.1 Animation

##### 3.2.2 Node

##### 3.2.3 Camera

##### 3.2.4 BoundingBox

##### 3.2.5 Scene

##### 3.2.6 Light

##### 3.2.7 Material

##### 3.2.8 Mesh

##### 3.2.9 Morph

##### 3.2.10 Skin

### 4.MD5 加密

### 5.FreeImage 处理

### 6.FlatBuffers 序列化

#### 6.1 Schema 定义

#### 6.3 输出文件

## 三.渲染引擎

### 1.设计结构

### 2.Animation 模块

### 3.AR 模块

### 4.Audio 模块

### 5.Basic 通用模块

#### 5.1 性能检测

### 6.Camera 模块

#### 6.1 相机模式

##### 6.1.1 Ortho 正交相机

##### 6.1.2 Perspective 投影相机

##### 6.1.3 Target 目标相机

#### 6.2 相机控制

##### 6.2.1 ArcBall/InertiaArcBall 鼠标球

##### 6.2.2 FirstPerson 第一人称

##### 6.2.3 Gyro 陀螺仪

### 7.Core 核心模块

#### 7.1 Scene 管理

#### 7.2 WebGL 调用

##### 7.2.1 WebGL 初始化

#### 7.3 Depth 渲染

#### 7.4 Engine 核心

#### 7.5 第三方 SkyBox 环境

### 8.Effect 模块

### 9.Light 模块

#### 9.1 光源概览

#### 9.2 普通光源

##### 9.2.1 方向光

##### 9.2.2 点光源

##### 9.2.3 探照灯

#### 9.3 阴影光源

##### 9.3.1 方向光

##### 9.3.2 点光源

##### 9.3.3 探照灯

### 10.Loader 模块

#### 10.1 LoadingMonitor 概述

#### 10.2 EnvMapLoader 第三方环境

#### 10.3 FBSLoader/FlatBuffers

##### 10.3.1 AnimationLoader

##### 10.3.2 MaterialLoader

##### 10.3.3 ImageLoader

##### 10.3.4 TextureLoader

##### 10.3.5 ModelLoader

#### 10.4 GpuPreLoader

#### 10.5 HdrLoader

#### 10.6 ObjectLoader

### 11.Material 模块

#### 11.1 BillboardMaterial

#### 11.2 CustomMaterial

#### 11.3 DepthMaterial

#### 11.4 MaterialCaptureMaterial

#### 11.5 NormalMaterial

#### 11.6 Particle/ParticleDepthMaterial

#### 11.7 MultipleMaterial

#### 11.8 PBRMaterial

### 12.Math 模块

#### 12.1 数学模块概述

#### 12.2 AABB 包围盒

#### 12.3 Color 定义

#### 12.4 Matrix 矩阵

#### 12.5 Vector 向量

#### 12.6 Plane 空间平面

#### 12.7 Ray 空间射线

#### 12.8 Quaternion 四元数

### 13.Mesh 模块

#### 13.1 Basic 基础网格

##### 13.1.1 Cone/Cylinder 圆柱/圆锥

##### 13.1.2 Cube/Sphere 正方体/球体

##### 13.1.3 Lines/Plane 线/面

#### 13.2 Vertex 顶点

##### 13.2.1 VertexAttribute 顶点属性

##### 13.2.2 VertexBuffer 顶点缓冲

### 14.Misc 模块

#### 14.1 杂项概览

#### 14.2 Base64 二进制

#### 14.3 ColorPicker

#### 14.4 EffectViewer

#### 14.5 OutLineRenderer

#### 14.6 MeshInterSector

### 15.Node 模块

#### 15.1 节点概览

### 16.Particle 模块

### 17.PassQueue 模块

#### 17.1 后处理介绍

#### 17.2 后处理方法

##### 17.2.1 Bloom 泛光

##### 17.2.2 Bokeh 布克模糊

##### 17.2.3 ChromaticAbrration 色差分离

##### 17.2.4 ColorAdjustment/Balance 色彩调整/平衡

##### 17.2.5 Film 影视

##### 17.2.6 FXAA/SSAA 快速抗锯齿/超采样抗锯齿

##### 17.2.7 Glitch 故障

##### 17.2.8 Grain 颗粒

##### 17.2.9 Sepia 复古

##### 17.2.10 Sharpness 锐化

##### 17.2.11 Vignette 暗角

##### 17.2.12 Edge 边缘处理

### 18.Shader 模块

#### 18.1 Shader 介绍

#### 18.2 FragmentShader

#### 18.3 VertexShader

#### 18.4 ShaderLib

### 19.Skeleton 模块

### 20.Texture 模块

#### 20.1 纹理概览

#### 20.2 纹理介绍

##### 20.2.1 CubeMap 环境纹理

##### 20.2.2 DataTexture 数据纹理

##### 20.2.3 DepthTexture 深度纹理

##### 20.2.4 VideoTexture 视频纹理

### 21.Event 事件系统

#### 21.1 原理概述

#### 21.2 事件分发器

#### 21.3 事件接收者

## 四.编辑器引擎

### 1.Common

### 2.Component

### 3.Configs

### 4.Core

### 5.Layout

### 6.Page

### 7.Store

### 8.Style

### 9.Utils
