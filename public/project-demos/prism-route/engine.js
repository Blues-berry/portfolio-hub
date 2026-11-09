(function(root){
'use strict';
const routes = [
 {name:['First reflection','第一束光'],start:3,end:1,points:[[3,2],[1,2]]},
 {name:['A longer way','绕一个弯'],start:1,end:2,points:[[1,1],[5,1],[5,5],[2,5]]},
 {name:['Folded light','折叠光路'],start:5,end:4,points:[[5,2],[2,2],[2,4],[4,4]]},
 {name:['Crossroads','交叉路口'],start:0,end:6,points:[[0,1],[4,1],[4,5],[1,5],[1,3],[6,3]]},
 {name:['The return','回返'],start:6,end:0,points:[[6,1],[2,1],[2,5],[5,5],[5,3],[0,3]]},
 {name:['Around the edge','沿着边缘'],start:3,end:5,points:[[3,0],[0,0],[0,6],[6,6],[6,2],[1,2],[1,4],[5,4]]},
 {name:['Inner passage','内部通道'],start:4,end:3,points:[[4,1],[1,1],[1,5],[6,5],[6,0],[0,0],[0,3],[3,3]]},
 {name:['The prism engine','棱镜引擎'],start:2,end:1,points:[[2,0],[6,0],[6,6],[0,6],[0,2],[4,2],[4,4],[1,4]]}
];
const dirs=[[0,1],[1,0],[0,-1],[-1,0]];
function reflect(d,orientation){return orientation===0?[3,2,1,0][d]:[1,0,3,2][d];}
function trace(level,mask){let r=level.start,c=-1,d=0;const path=[[r,c]],seen=new Set();for(let steps=0;steps<240;steps++){r+=dirs[d][0];c+=dirs[d][1];path.push([r,c]);if(r<0||r>6||c<0||c>6)return {won:c===7&&r===level.end,status:c===7&&r===level.end?'connected':'escaped',path};let key=r+','+c+','+d;if(seen.has(key))return {won:false,status:'loop',path};seen.add(key);if(level.walls.some(p=>p[0]===r&&p[1]===c))return {won:false,status:'blocked',path};let i=level.points.findIndex(p=>p[0]===r&&p[1]===c);if(i>=0)d=reflect(d,(mask>>i)&1);}return {won:false,status:'loop',path};}
function bits(n){let c=0;while(n){c+=n&1;n>>=1;}return c;}
const levels=routes.map((route,index)=>{const level={...route,walls:[],initial:0};let prev=[route.start,-1],incoming=0,solution=0,occupied=new Set();route.points.forEach((point,i)=>{let next=route.points[i+1]||[route.end,7];let outgoing=dirs.findIndex(v=>Math.sign(next[0]-point[0])===v[0]&&Math.sign(next[1]-point[1])===v[1]);let orientation=reflect(incoming,0)===outgoing?0:1;solution|=orientation<<i;for(let r=prev[0],c=prev[1];r!==point[0]||c!==point[1];r+=dirs[incoming][0],c+=dirs[incoming][1])if(c>=0&&c<7)occupied.add(r+','+c);occupied.add(point.join(','));incoming=outgoing;prev=point;});let full=trace(level,solution);full.path.forEach(p=>occupied.add(p.join(',')));for(let r=0;r<7;r++)for(let c=0;c<7;c++)if(!occupied.has(r+','+c)&&(r*11+c*7+index)%6===0)level.walls.push([r,c]);const solutions=[];for(let m=0;m<(1<<level.points.length);m++)if(trace(level,m).won)solutions.push(m);const flipped=[[0,1],[0,2,3],[1,3],[0,2,5],[1,2,4,5],[0,2,3,5,7],[1,3,4,6],[0,2,3,5,6]][index];level.initial=solution^flipped.reduce((m,i)=>m|(1<<i),0);level.par=Math.min(...solutions.map(s=>bits(level.initial^s)));level.solutions=solutions;return level;});
root.PrismRoute={levels,trace,bits,reflect};
})(typeof globalThis!=='undefined'?globalThis:this);
