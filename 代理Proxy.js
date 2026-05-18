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

