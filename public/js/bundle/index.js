(()=>{"use strict";const e=(e,o)=>{t();const a=`<p class="alert alert--${e}">${o}</p>`;document.querySelector("body").insertAdjacentHTML("afterbegin",a)},t=()=>{const e=document.querySelector(".alert");e&&e.remove()};window.addEventListener("DOMContentLoaded",(()=>{const t=document.querySelector(".form"),o=document.querySelector("#map");o&&((e,t)=>{mapboxgl.accessToken="pk.eyJ1Ijoic2FjaGluNTUiLCJhIjoiY2t3dnVjZGhuMjNzYTJ2bGMxemVyaWd6MCJ9.8HfTVTWt-JrfeeVwmWqeQA";const o=new mapboxgl.Map({container:"map",style:"mapbox://styles/sachin55/ckwvuijkn35zq14n24kc85bso",scrollZoom:!1}),a=new mapboxgl.LngLatBounds;t.forEach((e=>{const t=document.createElement("div");t.className="marker",new mapboxgl.Marker({element:t,anchor:"bottom"}).setLngLat(e.coordinates).addTo(o),new mapboxgl.Popup({offset:30}).setLngLat(e.coordinates).setHTML(`<p>Day ${e.day} : ${e.description}</p>`).addTo(o),a.extend(e.coordinates)})),o.fitBounds(a,{padding:{top:200,bottom:200,left:100,right:100}})})(0,JSON.parse(o.dataset.locations)),t&&t.addEventListener("submit",(t=>{t.preventDefault();const o=new FormData(t.target);(async(t,o)=>{(await fetch("/api/v1/users/login",{method:"POST",headers:{accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({email:t,password:o})})).ok?(e("success","Login Successful"),setTimeout((()=>{window.location.href="/"}),2e3)):e("error","Login failed.Please double check your username and password.")})(o.get("email"),o.get("password"))}))}))})();