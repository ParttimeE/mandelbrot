(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();const C=t=>e=>(n,o)=>n===o?e:t(n,o),K=(t,e)=>{const n=1-t/e,o=Math.floor(255*n);return{r:o,g:o,b:o}},X=(t,e,n)=>(o,r)=>{const a=1-o/r,c=Math.floor(255*a),i=o%t===0?0:c,l=o%e===0?0:c,u=o%n===0?0:c;return{r:i,g:l,b:u}},oe="modulepreload",re=function(t){return"/"+t},U={},ae=function(e,n,o){let r=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),i=c?.nonce||c?.getAttribute("nonce");r=Promise.allSettled(n.map(l=>{if(l=re(l),l in U)return;U[l]=!0;const u=l.endsWith(".css"),v=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${v}`))return;const s=document.createElement("link");if(s.rel=u?"stylesheet":oe,u||(s.as="script"),s.crossOrigin="",s.href=l,i&&s.setAttribute("nonce",i),document.head.appendChild(s),u)return new Promise((g,m)=>{s.addEventListener("load",g),s.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${l}`)))})}))}function a(c){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=c,window.dispatchEvent(i),!i.defaultPrevented)throw c}return r.then(c=>{for(const i of c||[])i.status==="rejected"&&a(i.reason);return e().catch(a)})},W=await ae(()=>import("./calculations_bg-CVwsojbZ.js"),[]);function ce(t,e){const{maxIterations:n,maxRealPart:o,minRealPart:r,maxImaginaryPart:a,minImaginaryPart:c,getColorFn:i,width:l,height:u}=e,{factor:v,xPosition:s,yPosition:g}=t;if(v===0)return e;const m=r+(o-r)*(s/l),p=c+(a-c)*(g/u),I=Math.abs(o-r)/v,w=Math.abs(a-c)/v,L=m-I/2,R=m+I/2,b=p-w/2,y=p+w/2;return Y({...e,maxIterations:n,maxRealPart:R,minRealPart:L,maxImaginaryPart:y,minImaginaryPart:b,getColorFn:i})}function Y(t){const{maxIterations:e,maxRealPart:n,minRealPart:o,maxImaginaryPart:r,minImaginaryPart:a,getColorFn:c,width:i,height:l,imageData:u}=t,v=(n-o)/i,s=(r-a)/l,g=u.data;for(let m=0;m<l;m++)for(let p=0;p<i;p++){const I=o+p*v,w=a+m*s,L=W.new_complex_number(I,w),R=W.calculate_iterations_per_pixel(L,e),b=c(R,e),y=(m*i+p)*4;g[y]=b.r,g[y+1]=b.g,g[y+2]=b.b,g[y+3]=255}return{...t,imageData:u}}function ie(t,e){const n=document.createElement("canvas");n.className="canvas";const o=n.getContext("2d");n.width=t,n.height=e,document.body.appendChild(n);const r=o.createImageData(n.width,n.height);return{canvas:n,drawingContext:o,imageData:r}}function J(t,e){return t.drawingContext.putImageData(e.imageData,0,0),e}async function Q(t,e){const n=Y(e);return J(t,n)}async function D(t,e,n){const o=ce(t,e);return J(n,o)}function le(){const t=document.documentElement;t.requestFullscreen&&t.requestFullscreen()}function se(t){return new Promise(e=>setTimeout(e,t))}async function ee(t,e,n,o){e!=0&&(t(),await se(n),o.aborted||ee(t,e-1,n,o))}const F=800,$=F/2,_=document.getElementById("red"),O=document.getElementById("green"),S=document.getElementById("blue"),V=document.getElementById("backgroundRed"),k=document.getElementById("backgroundGreen"),z=document.getElementById("backgroundBlue"),te=document.getElementById("MaxIterations"),A=document.getElementById("zoomFactor"),N=document.getElementById("zoomSteps"),q=document.getElementById("zoomDelay"),B=document.getElementById("activateModuloColor");let E=new AbortController,j=E.signal,ue=+te.value,f={factor:+A.value,steps:+N.value,delay:+q.value},P={r:+V.value,g:+k.value,b:+z.value},h=C(K);const d=ie(F,F),de={maxRealPart:1,minRealPart:-2,maxImaginaryPart:1.5,minImaginaryPart:-1.5,maxIterations:ue,getColorFn:h(P),imageData:d.imageData,width:d.canvas.width,height:d.canvas.height};let H=Q(d,de);async function M(t){H=H.then(e=>t(e))}async function x(t){M(e=>Q(d,{...e,...t}))}function T(t){const e=t.target;!e||!e.value||(f={factor:+A.value,steps:+N.value,delay:+q.value})}function Z(t){const e=t.target;!e||!e.value||x({getColorFn:C(X(+_.value,+O.value,+S.value))(P)})}function G(t){const e=t.target;!e||!e.value||(P={r:+V.value,g:+k.value,b:+z.value},x({getColorFn:h(P)}))}function ne(t){E=new AbortController,j=E.signal,ee(()=>M(e=>D({factor:t,xPosition:$,yPosition:$},e,d)),f.steps-1,f.delay,j)}_.addEventListener("input",Z);O.addEventListener("input",Z);S.addEventListener("input",Z);V.addEventListener("input",G);z.addEventListener("input",G);k.addEventListener("input",G);q.addEventListener("input",T);N.addEventListener("input",T);A.addEventListener("input",T);d.canvas.addEventListener("click",function(t){const e=d.canvas.getBoundingClientRect(),n=t.clientX-e.left,o=t.clientY-e.top;le(),E.abort(),M(r=>D({factor:f.factor,xPosition:n,yPosition:o},r,d)),f.steps!=1&&ne(f.factor)});d.canvas?.addEventListener("contextmenu",t=>{t.preventDefault();const e=1/f.factor;E.abort(),M(n=>D({factor:e,xPosition:500,yPosition:500},n,d)),f.steps!=1&&ne(e)});te?.addEventListener("input",t=>{const e=t.target;!e||!e.value||x({maxIterations:+e.value})});B?.addEventListener("change",function(){B&&B.checked?(h=C(X(+_.value,+S.value,+O.value)),x({getColorFn:h(P)})):(h=C(K),x({getColorFn:h(P)}))});
