# TypeScript_Note
## TS为什么出现
1. 是JS的超集，多了类型支持
2. JS中的大部分错误为类型错误
3. TS是静态语言(编译时检查TYPE)，JS是动态语言(执行时检查TYPE)
## TS初始化
1. 安装工具包 npm i -g typescript: 新增tsc命令
2. tsc实现向JS的转换, tsc -v查看版本
3. tsc + name.ts 同级目录中出现同名JS文件 tsc + name.ts -w 打开监视模式(单文件)
4. 简化步骤，合并命令：tsc(转化)+node(运行)
5. npm i -g ts-node: ts-node + name.ts
6. tsconfig.json //重要配置文件
```ts
{
  //包含
  "include": [
    "./src/**/*"  //**任意目录 *任意文件
  ],
  //不包含
  "exclude":[],
  "extedns":"....." //继承其他配置文件
  "files":[   //同include 直接列出文件
    "..",
    "...",
  ]
  "compilerOptions":{
    "target": "ES5", //编译的JS目标版本
    "module": "commonjs",//指定模块化方案
    "lib": ["dom"], //指定第三方库，帮助检查代码，有提示
    "outDir": "./dist",//指定编译后的文件目录,多个
    "outFile": "./dist", //合并多个编译后的js文件,只有一个(模块化只限制在AMD和System，剩下全是全局属性)
    "allowJs": false, //是否对js一起编译，默认为false
    "checkJs": false, //是否检查js文件,默认false
    "removeComments": false, //是否不要注释,默认false
    "strict": true, //控制下面所有的东西
    "noEmit": true, //不生成编译后的文件
    "noEmitError": true, //有错误时不生成编译文件
    "alwaysStrict": false, //编译后是否使用严格模式 ES6默认严格模式
    "noImplicitAny": true, //不允许隐式any出现
    "noImplicitThis": true, //不允许隐式This出现
    "strictNullChecks": true, //严格检测null出现的情况
}
}
```
## TS语法
```ts
1. 类型注解:
let age: number = 18
1. 原始类型：
number/string/boolean/null/undefined/symbol
1. 数组类型: 
number[]/Array<string>/Array[number]/boolean[]
1. 数组的联合类型：
let arr: (number | string)[] = [1, 'a', 3, 'b']
1. 类型别名：
type MyArray = (number | string | boolean)[] -> let arr: MyArray = [....]
1. 函数类型：
function add(num1: number, num2: number): number{ return num1 + num2}
1. 匿名函数定义常量
const add = (num1: number, num2: number): number => { return num1 + num2}
1. const add:(num1: number, num2: number) => number = (num1, num2) => {return num1 + num2} //add:后是类型指定 =>number之后才是原本的函数表达式
2. 无返回值
function greet(name: string): void{console.log('goodbye', name)}
1.  可选参数(可选参数只能出现在参数列表的最后)
function mySlice(start?: number, end?: number): void{....}
1.  对象类型(用大括号描述对象结构,属性和函数返回值类型都要指定)
let person: {name: string; age: number; sayHi(): void} = {
  name: 'jack',
  age: 19,
  sayHi(){}
}
1.  接口(描述对象类型用于复用)(接口只能用于对象，type是任意类型)
interface IPerson{
  name: string
  age: number
  sayHi(): void
}
type IPerson = {
  name: string
  age: number
  sayHi(): void
}
let person: Iperson = {....}
1.  接口继承
interface Point2D {x: number, y: number}
interface Point3D extends Point2D {z: number} === interface Point3D{x: number, y: number, z: number}
1.  元组Tuple(固定元素个数，不然是无限个number)
let position: [number, number] = [x, y]
1.  类型推论(可以省略，自动确认类型)
let age = 18 (又变成了js...)
function add(num1: number, numb2: number)(省略){return num1 + num2}
1.  类型断言(强制类型转换，由大向小)
<a href="http:www.itcast.cn/" id="link"></a>
const aLink = document.getElementById('link') as HTMLAnchorElement (由HTMLElement到Anchor)
1.  字面量类型(任意字面量可以自己作为自定义类型使用)
const str = 'strName' //相当于自定义类型，拥有最高精确规格
function changeDirection(direction:'up'|'down'|'letf'|'right'){.....}
1.  枚举(字面量类型的联合)(默认值0,1,2,3累加)(值也可以自定义为字符串,无自增长行为)
enum Direction{up, down, left, right} //可以通过Direction.up访问
function changeDirection(direction: Direction){.....}
1.  typeof类型自动查询
let p: number = 10;
let xx: typeof p = 100;
```
## TS高级
```ts
1. 继承extends和implements
class Child extends Parents{...}

interface Parents{
  sing(): void //有点像纯虚函数,只有定义,需要被重写
}
class Child implements Parents{
  sing(){
    ....//具体实现
  }
}
2. public protected privaate
3. readonly(防止在除了定义之外的其他位置(除了构造函数内),更改class的属性值)
4. Structural Type System(结构化类型系统), Nominal Type System(标明类型系统)
Duck Typing(STS)： 两个对象形状相同，那他就是同一类型，尽管名字不一样(另外还具有兼容子集的特性,可以强转)
C#、Java(NTS).
5. (接口，类，函数都有兼容性)
对象，多的赋值给属性少的
函数，参数少的给参数多的，相同位置的参数类型要相同或兼容(对象类型),返回值类型本身类型相同或者兼容(对象类型，成员多的给成员少的)
6. 交叉类型(组合多个类型为一个类型)
interface A {...}
interface B {...}
type C = A & B
let obj: C = {......}
extends不能合并同名不同类型的属性，但是交叉类型type可以
7. 泛型(无敌！！！！)
函数：//要求参数和返回值类型相同
function id(value: any): any{return value} //失去类型保护 不行
function id<Type>(value: Type): Type{return value} //仍然安全 行
let num = id<number>(10) -> let num = id(10) //此处有类型推断可以省略
接口：
interface IdFunc<Type>{
  id: (value: Type) => Type
  ids: () => Type[]
}
let obj: IdFunc<number> = { //此处没有类型推断得手写
  id(value) {return value}
  ids() {return [1, 3 , 5]}
}
class：
class GenericNumber<Type>{
  value: Type
  add: (x: Type, y: Type) => Type
  constructor(value: Type)
  {this.value = value}
}
const myNum = new GenricNumber(10);
//上面可省，下面不可省
class GenericNumber<Type>{
  value: Type
  add: (x: Type, y: Type) => Type
}
const myNum = new GenricNumber<number>();
8. 泛型约束 //不能访问类型的原装属性eg:length
指定更加具体的类型 行！
funtion id<Type>(value: Type[]): Type[]{} //指定为泛型数组，可用value.length
funtion id<Type extends ILength>(value: Type): Type{} //扩展约束，也可以用value.length
9. 高级泛型约束
function getProp<Type, Key extends keyof Type>(obj: Type, key: Key){...}
let person = {name: 'jack', age: 18}
getProp(person, 'name') //约束p2必须是p1中的属性 Key must be a Key-of Type
10. 泛型工具
Partial: 创建旧类型的属性可选版本
interface AAA{
  id: string
  ids: number[]
}
type BBB = Partial<AAA>
Readonly: 创建旧类型的属性只读版本
type CCC = Readonly<AAA>
Pick<Type, Keys>：创建旧类型的属性部分选择版本
type DDD = Pick<AAA, 'id'>
Record<Keys, Type>: 创建旧类型的属性的复合体
type RObj = {
  a: string[]
  b: string[]
  c: string[]
}
type RObj = Record<'a'|'b'|'c', string[]>
11. 索引签名类型
interface AnyObject{
  [key: string]: number
}
let obj: AnyObject = {}
12. 映射类型(基于索引签名类型)
//只能在type中使用，无法在interface中使用
type PropKeys = 'x'|'y'|'z'
type Type1 = {x: number; y: number; z: number} //不行
type Type2 = {[Key in PropKeys]: number} //行

type Props = {a: number; b: string; c: boolean}
type Types = {[key in keyof Props]: number}
//泛型工具都是基于映射实现
13. 索引查询类型
type Props = {a: number; b: string; c: boolean}
type TypeA = Props[keyof Props] //string|number|boolean
14. TS类型声明文件.d.ts(declaration)
a. 
```
## TS万字进阶
```ts
1. import type / export type
import有三种{函数(具体值), 类型(接口), class(类，前面两个的合体)}
ts编译至js会自动删除类型的导入
import type指明导入的是类型，不是值
import type {某个class}, 不能extend继承
```

## WebPack
1. 初始化
```js
npm init -y //生成package.json
npm i -D webpack webpack-cli typescript ts-loader//-D等于saveDevice

//根目录
webpack.config.js
{
  const path = require('path'); //引入一个包
  module.exports = {  //webpack所有配置都写在这个里面
    entry: "./src/index.ts", //指定入口
    output: {               //指定打包文件输出目录和名字
      path: path.resolve(__dirname, 'dist'),
      filename: "bundle.js"
    },
    module: {             //指定webpack打包时使用的模块
      rules: [{
        test: /\.ts$/,    //指定规则生效的目标文件
        use: 'ts-loader',  //用ts-loader处理
        exclude: /node_modules/ //排除文件夹
      }]
    }
  }
}

//根目录
tsconfig.json{
  "compilerOptions": {
    "module": "es6",
    "target": "es6",
    "strict": true
  }
}

//根目录
package.json{
  //加入
  "scripts":
  "build": "webpack"   //npm run build
}
```
2. 重要插件
```ts
npm i -D html-webpack-plugin  //自动生成html文件
webpack.config.js{
  const HTMLWebpackPlugin = require('html-webpack-plugin'); //引入html插件
  plugins: [
    new HTMLWebpackPlugin({
      //title: "name"
      template: './src/index.html'
    }),
  ]
}
//npm run build之后 自动生成index.html


npm i -D webpack-dev-server //内置服务器,实时更新
package.json{
  "scripts":{
    "start": "webpack serve --open chrome.exe"
  }
}
//npm start 或者 --open

npm i -D clean-webpack-plugin
webpack.config.js{
  const {CleanWebpackPlugin} = require('clean-webpack-plugin');
  plugins:[  
    new CleanWebpackPlugin(),
  ]
}
```
3. 引入模块
```ts
webpack.config.js{
  resolve:{  //设置引入模块
    extensions: ['.ts', '.js']
  }
}
```
4. babel(增加兼容性)
```ts
npm i -D @babel/core @babel/preset-env babel-loader core-js
webconfig.js{
  module:{
    rules: [
      use: [//指定loader
        {
          loader:"babel-loader",//指定加载器
          options:{//设置babel-loader
            presets:[
              [
                @babel/preset-env,//指定环境插件
                {
                  targets:{//需要兼容的目标浏览器
                    "chrome":"88",
                    "ie":"11" //比较老的版本
                  },
                  "corejs":"3"//corejs的版本 
                  //eg:babel不会转换promise,但是corejs包中有替代实现
                  "useBuiltIns":"usage"//按需加载
                }
              ]
            ]
          }
        }
        'ts-loader'//设置ts-loader
      ],
    ]
  }

  output:{
    environment:{
      arrowFunction: false //禁止webpack使用箭头函数
    }
  }
}
```

## Js中使用Ts (待测试...)
```ts
如何在JavaScript中引用TypeScript文件
在编写项目时我们可能只想用TypeScript编写新的一部分代码，那么在编写完之后势必需要在旧的JavaScript代码中调用新编写的逻辑，网上对这部分并没有详细的介绍，因此在这里简单进行介绍。

在要被引用的.ts文件中，开发时我们不需要注意什么，只要在最后使用Node.js中JavaScript原生的方式module.exports的方式进行导出，这行语句在编译之后会原封不动的留下来，因此可以被其它.js文件引用。需要注意的是原生的方式和TypeScript中的导出方式不能混用，否则编译之后会发生冲突，无法被正确导入。

在.js文件中我们只需要正常的使用require方法导入对应的模块即可。
```


## Call/Apply/Bind
```ts
let dog{
  name = "wang",
  sayHi(){
    console.log("我是" + this.name);
  },
  eat(food){
    console.log("爱吃" + food)
  }
  drink(water1, water2){
    console.log("想喝" + water1 + water2);
  }
}
let cat = {
  name = "meow"
}

dog.sayhi.call(cat);
dog.eat.call(cat,"🐟");
dog.drink.apply(cat, ["可乐", "雪碧"]); //第二个参数是数组
let fun1 = dog.sayhi.bind(cat);
let fun2 = dog.eat.bind(cat,"🐟");
let fun3 = dog.drink.bind(cat, ["可乐", "雪碧"]);
fun1();
fun2();
fun3();
```