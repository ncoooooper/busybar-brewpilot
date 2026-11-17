import {surface,label,panel,rect,wrap,mint,amber,read,persist,type Key,type Frame} from "@shared/surface";

type Step={name:string; seconds:number; fraction:number};
type Recipe={name:string; ratio:number; steps:Step[]};
const recipes:Recipe[]=[
 {name:"V60",ratio:16,steps:[{name:"Bloom",seconds:35,fraction:0.18},{name:"Pour",seconds:60,fraction:0.65},{name:"Top up",seconds:75,fraction:1}]},
 {name:"French press",ratio:15,steps:[{name:"Fill",seconds:30,fraction:1},{name:"Steep",seconds:210,fraction:1},{name:"Plunge",seconds:15,fraction:1}]},
 {name:"AeroPress",ratio:13,steps:[{name:"Wet grounds",seconds:20,fraction:0.3},{name:"Fill / stir",seconds:60,fraction:1},{name:"Press",seconds:30,fraction:1}]}
];
let recipe=read("recipe",0), dose=read("dose",15), step=0;
let mode:"recipe"|"dose"|"brew"|"done"="recipe";
let due=0, paused=false, remaining=0, timer:ReturnType<typeof setInterval>|undefined;
const secs=()=>paused?remaining:Math.max(0,Math.ceil((due-Date.now())/1000));
const clock=(s:number)=>Math.floor(s/60)+":"+(s%60<10?"0":"")+(s%60);
function stop(){if(timer!==undefined){clearInterval(timer);timer=undefined;}}
function startStep(){stop();paused=false;due=Date.now()+recipes[recipe].steps[step].seconds*1000;timer=setInterval(()=>{refresh();if(secs()===0)stop();},1000);}
function draw():Frame{
 const r=recipes[recipe], water=dose*r.ratio, item=r.steps[step];
 const title=mode==="recipe"?r.name:mode==="dose"?dose+"g coffee":mode==="done"?"Enjoy!":item.name;
 const detail=mode==="brew"?(paused?"PAUSED ":secs()===0?"OK NEXT ":"")+clock(secs()):mode==="done"?"OK: new brew":water+"g water";
 return [rect("mark",0,0,2,16,amber),label("title",title,4,0,amber),label("metric",detail,4,9,mint,"front","tiny"),
 ...panel("BREWPILOT",mode==="brew"?[r.name+" / "+dose+"g coffee","Step "+(step+1)+" of "+r.steps.length,item.name+" to "+Math.round(water*item.fraction)+"g","Time left: "+clock(secs()),"Start: pause / resume","Click: next step"]:mode==="done"?["Brew complete",r.name+" / "+water+"g water","Click to pick a new recipe"]:[r.name,"Ratio 1:"+r.ratio,dose+"g coffee / "+water+"g water",mode==="recipe"?"Turn: pick recipe":"Turn: change dose",mode==="recipe"?"Click: portion size":"Click: begin brewing"])];
}
function input(k:Key){
 if(mode==="recipe"){
   if(k==="up"||k==="down")recipe=wrap(recipe+(k==="up"?1:-1),recipes.length);
   if(k==="ok"){persist("recipe",recipe);mode="dose";}
 }else if(mode==="dose"){
   if(k==="up"||k==="down")dose=Math.min(40,Math.max(8,dose+(k==="up"?1:-1)));
   if(k==="ok"){persist("dose",dose);step=0;mode="brew";startStep();}
   if(k==="start")mode="recipe";
 }else if(mode==="brew"){
   if(k==="start"&&secs()>0){
     if(paused){due=Date.now()+remaining*1000;paused=false;timer=setInterval(()=>{refresh();if(secs()===0)stop();},1000);}
     else{remaining=secs();paused=true;stop();}
   }
   if(k==="ok"){stop();if(step+1<recipes[recipe].steps.length){step++;startStep();}else mode="done";}
 }else if(k==="ok"||k==="start")mode="recipe";
 console.log("brew",mode,recipes[recipe].name,dose,step,paused,secs());
}
const refresh=surface(draw,input,stop);
