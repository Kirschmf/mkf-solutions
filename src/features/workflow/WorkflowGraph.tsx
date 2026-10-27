import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ReactFlow, Background, Controls, Handle, Position, BaseEdge, getSmoothStepPath, MarkerType, type NodeProps, type EdgeProps, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { stages } from './stages';
import type { Stage, WorkflowState } from './workflow.types';
import styles from './workflow.module.css';
import { useMotionPreference } from '../../app/useMotionPreference';

type StageNode=Node<{title:string;number:string;caption:string;active:boolean;done:boolean;blocked:boolean;source:Position;target:Position;label:string;inspect:()=>void},'stage'>;
type TransferEdge=Edge<{transition:number;active:boolean;value:string},'transfer'>;
function StageCard({data}:NodeProps<StageNode>){
  return <div className={`${styles.graphNode} ${data.active?styles.nodeActive:''} ${data.done?styles.nodeDone:''} ${data.blocked?styles.nodeBlocked:''}`}>
    <Handle type="target" position={data.target}/>
    <button type="button" className={styles.nodeAction} aria-label={data.label} onClick={event=>{event.stopPropagation();data.inspect();}}><span className={styles.nodeNumber}>{data.done?'✓':data.number}</span><strong>{data.title}</strong><span>{data.caption}</span></button>
    <Handle type="source" position={data.source}/>
  </div>;
}
function DataEdge(props:EdgeProps<TransferEdge>){
  const {reducedMotion}=useMotionPreference();
  const [path]=getSmoothStepPath({...props,borderRadius:18});
  const pathRef=useRef<SVGPathElement>(null);
  const cardRef=useRef<SVGGElement>(null);
  const active=props.data?.active;
  const lastTransition=useRef(props.data?.transition);
  useEffect(()=>{
    if(lastTransition.current===props.data?.transition)return;
    lastTransition.current=props.data?.transition;
    if(!active||!pathRef.current||!cardRef.current)return;
    const reduced=reducedMotion;
    const svgPath=pathRef.current,card=cardRef.current;
    const length=svgPath.getTotalLength();
    const cursor={progress:0};
    const draw=()=>{const point=svgPath.getPointAtLength(length*cursor.progress);gsap.set(card,{attr:{transform:`translate(${point.x},${point.y})`},opacity:1});};
    draw();
    if(reduced){gsap.set(card,{opacity:0});return;}
    const tween=gsap.to(cursor,{progress:1,duration:.75,ease:'power1.inOut',onUpdate:draw,onComplete:()=>gsap.to(card,{opacity:0,duration:.15})});
    return()=>{tween.kill();gsap.killTweensOf(card);};
  },[active,props.data?.transition,path,reducedMotion]);
  return <>
    <BaseEdge id={props.id} path={path} markerEnd={props.markerEnd} style={{stroke:active?'#22D6EE':'#7A8BAA',strokeWidth:active?2.5:1.5}} interactionWidth={24}/>
    <path ref={pathRef} d={path} fill="none" stroke="none" aria-hidden="true"/>
    {active&&<g ref={cardRef} pointerEvents="none" opacity="0" aria-hidden="true"><rect x="-32" y="-14" width="64" height="28" rx="4" fill="#17191D"/><text textAnchor="middle" y="5" fill="#fff" style={{fontSize:12,fontFamily:'inherit'}}>pedido</text></g>}
  </>;
}
const nodeTypes={stage:StageCard};
const edgeTypes={transfer:DataEdge};
const locations=[{x:0,y:0},{x:210,y:0},{x:420,y:0},{x:420,y:170},{x:210,y:170},{x:0,y:170},{x:0,y:340},{x:210,y:340}];
const handles=[{source:Position.Right,target:Position.Left},{source:Position.Right,target:Position.Left},{source:Position.Bottom,target:Position.Left},{source:Position.Left,target:Position.Top},{source:Position.Left,target:Position.Right},{source:Position.Bottom,target:Position.Right},{source:Position.Right,target:Position.Top},{source:Position.Right,target:Position.Left}];

export default function WorkflowGraph({state,onInspectStage,onInspectEdge}:{state:WorkflowState;onInspectStage:(stage:Stage)=>void;onInspectEdge:(source:Stage,target:Stage)=>void}){
  const nodes=useMemo<StageNode[]>(()=>stages.map((stage,index)=>({id:stage.id,type:'stage',position:locations[index],data:{title:stage.short,number:String(index+1).padStart(2,'0'),caption:state.stage===stage.id?(state.status==='blocked'?'Sua decisão':state.status==='completed'?'Concluído':'Etapa atual'):state.history.some(entry=>entry.from===stage.id&&entry.to!==entry.from)?'Concluído':'Inspecionar',active:state.stage===stage.id,done:state.history.some(entry=>entry.from===stage.id&&entry.to!==entry.from),blocked:state.stage===stage.id&&(state.status==='blocked'||state.status==='failed'),...handles[index],label:`Etapa ${index+1}: ${stage.title}`,inspect:()=>onInspectStage(stage.id)},ariaLabel:`Etapa ${index+1}: ${stage.title}`,focusable:false,draggable:false,connectable:false})),[state]);
  const edges=useMemo<TransferEdge[]>(()=>stages.slice(0,-1).map((stage,index)=>{
    const target=stages[index+1].id,last=state.history.at(-1);
    const active=last?.from===stage.id&&last?.to===target;
    return {id:`${stage.id}-${target}`,source:stage.id,target,type:'transfer',data:{active,transition:last?.sequence??0,value:state.order?.product??state.input.product},markerEnd:{type:MarkerType.ArrowClosed,color:active?'#22D6EE':'#7A8BAA',width:14,height:14},ariaLabel:`Dados de ${stage.short} para ${stages[index+1].short}`,ariaRole:'button',domAttributes:{onKeyDown:event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();onInspectEdge(stage.id,target);}}},focusable:true};
  }),[state]);
  return <div className={styles.graphCanvas} data-testid="workflow-map"><ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} fitView fitViewOptions={{padding:.08}} minZoom={.35} maxZoom={1.5} preventScrolling={false} zoomOnScroll={false} nodesDraggable={false} nodesConnectable={false} onNodeClick={(_,node)=>onInspectStage(node.id as Stage)} onEdgeClick={(_,edge)=>onInspectEdge(edge.source as Stage,edge.target as Stage)} proOptions={{hideAttribution:false}}><Background color="#C9CED5" gap={24} size={1}/><Controls showInteractive={false}/></ReactFlow></div>;
}
