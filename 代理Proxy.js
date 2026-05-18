//使用代理的目的是：监控 某一个对象 的所有操作  可以知道网站需要什么环境，然后补齐

// var window = {
//     name: "zcj",
//     age: 18,
//     chi() {
//         console.log("我正在吃");
//         return "chi函数返回我正在吃";
//     }
// }
//只针对对象，不针对函数，函数部分需要另外写
//window = new Proxy  加代理就是：给原来的window对象包一层代理，以后任何代码访问window都会先经过这个代理，相当于监视这个window对象
// window = new Proxy(window, handler:{
//      handler: 具体发生什么操作, 要被劫持

//     当代码读取 window.xxx 时，自动触发get函数
//     get(target:目标对象, pro:被读取的属性名, receiver：代理对象本身){
//         // return obj[pro] ;   // 死循环
//         // 反射 -> 你可以理解成就是从目标对象中获取某个属性, (可以忽略掉代理)
//         var val = Reflect.get(target, pro, receiver);     Reflect.get 的意思是 不经过代理，直接拿window对象里对应属性的真实值
//         console.log("在代理中获取到了", pro, val);
//         return val;
//     },
//     set(target, pro, value, receiver){
//         console.log("给对象,设置属性", pro, "=", value);
//         Reflect.set(target, pro, value, receiver);
//     },
//     网站调用了 window 的哪些方法就会触发apply这个函数
//     apply(target, thisArg, arg_list){
//         console.log("有人调用函数了, ")
//         var ret = Reflect.apply(target, thisArg, arg_list);
//         console.log("函数执行完了, 结果是 ", ret);
//         return ret;
//     }
// });

// window = new Proxy(window, {
//     get(target,pro,receiver) {
//         console.log(target);
//         console.log(pro);
//         console.log(receiver);
//         console.log("我正在获取window里的数据");
//         return "getting";
//     },
//     set(target,pro,receiver,val) {
//         console.log("我正在设置window里的数据");
//         return "数据修改了"+val;
//     }
// })


function obj_proxy(obj, name) {
    return new Proxy(obj, {
        get(target, pro, receiver) {
            // 关键：过滤不需要监控的属性，避免无限打印
            // 1. 跳过 Symbol 类型的属性（比如 Symbol.toPrimitive）
            if (typeof pro === "symbol") return Reflect.get(target, pro, receiver);
            // 2. 跳过 Object 原型上的内置方法（比如 valueOf、toString、constructor 等）
            if (["valueOf", "toString", "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString"].includes(pro)) return Reflect.get(target, pro, receiver);
            var val = Reflect.get(target, pro, receiver);
            console.log("从", name, "获取", pro, "该属性的值是", val);
            if (typeof val === 'object') {
                return obj_proxy(val, pro); // 灵魂~~~
            } else if (typeof val === 'function') {
                return func_proxy(val, pro);
            }
            return val;
        },
        set(target, pro, val, receiver) {
            console.log("向", name, "设置", pro, "该属性的值是", val);
            Reflect.set(target, pro, val, receiver);
        }
    });
}

function func_proxy(func, name) {
    return new Proxy(func, {
        apply(target, thisArg, arg_list) {
            var ret = Reflect.apply(target, thisArg, arg_list);
            console.log(thisArg + "调用" + name + "函数", name + "函数返回的是", ret);
            if (typeof ret === 'object')
                return obj_proxy(ret, name + "的返回值");
            else if (typeof ret === 'function')
                return func_proxy(ret, name + "的返回值");
            return ret;
        }
    })
}
var my_navigator = {
    userAgent: "初晴的浏览器",
    plugins: {
        abc: {
            def: {}
        },
        chi: function () {
            return {
                hehe: "嘿嘿",
                miao: {
                    duomiao: "很秒"
                }
            };
        }
    }
};

var window = {
    name:"zcj"
}
window = obj_proxy(window, "window");

window.navigator = my_navigator;
console.log(window.name);
// console.log(window.navigator.plugins.abc.def);
// console.log(window.navigator.plugins.chi());

