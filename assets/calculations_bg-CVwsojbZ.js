const b="/assets/calculations_bg-C29fZr5g.wasm",m=async(e={},t)=>{let o;if(t.startsWith("data:")){const _=t.replace(/^data:.*?base64,/,"");let r;if(typeof Buffer=="function"&&typeof Buffer.from=="function")r=Buffer.from(_,"base64");else if(typeof atob=="function"){const a=atob(_);r=new Uint8Array(a.length);for(let i=0;i<a.length;i++)r[i]=a.charCodeAt(i)}else throw new Error("Cannot decode base64-encoded data URL");o=await WebAssembly.instantiate(r,e)}else{const _=await fetch(t),r=_.headers.get("Content-Type")||"";if("instantiateStreaming"in WebAssembly&&r.startsWith("application/wasm"))o=await WebAssembly.instantiateStreaming(_,e);else{const a=await _.arrayBuffer();o=await WebAssembly.instantiate(a,e)}}return o.instance.exports};let c;const u=typeof TextDecoder>"u"?(0,module.require)("util").TextDecoder:TextDecoder;let l=new u("utf-8",{ignoreBOM:!0,fatal:!0});l.decode();let s=null;function f(){return(s===null||s.byteLength===0)&&(s=new Uint8Array(c.memory.buffer)),s}function g(e,t){return e=e>>>0,l.decode(f().subarray(e,e+t))}typeof FinalizationRegistry>"u"||new FinalizationRegistry(e=>c.__wbg_complexnumber_free(e>>>0,1));function w(e,t){throw new Error(g(e,t))}function d(){const e=c.__wbindgen_export_0,t=e.grow(4);e.set(0,void 0),e.set(t+0,void 0),e.set(t+1,null),e.set(t+2,!0),e.set(t+3,!1)}URL=globalThis.URL;const n=await m({"./calculations_bg.js":{__wbindgen_throw:w,__wbindgen_init_externref_table:d}},b),p=n.memory,y=n.__wbg_complexnumber_free,x=n.__wbg_get_complexnumber_real_part,h=n.__wbg_set_complexnumber_real_part,A=n.__wbg_get_complexnumber_imaginary_part,T=n.__wbg_set_complexnumber_imaginary_part,U=n.calculate_iterations_per_pixel,W=n.new_complex_number,B=n.__wbindgen_export_0,C=n.__wbindgen_start;export{y as __wbg_complexnumber_free,A as __wbg_get_complexnumber_imaginary_part,x as __wbg_get_complexnumber_real_part,T as __wbg_set_complexnumber_imaginary_part,h as __wbg_set_complexnumber_real_part,B as __wbindgen_export_0,C as __wbindgen_start,U as calculate_iterations_per_pixel,p as memory,W as new_complex_number};
