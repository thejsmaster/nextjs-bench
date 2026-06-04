import React from "react";

export default function UIBadge() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.75rem 1rem",background:"white",borderRadius:"8px",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
      <span style={{fontSize:"0.85rem",color:"#666",fontWeight:500}}>Badge</span>
      <div style={{padding:"0.35rem 0.75rem",background:"#f0f4ff",borderRadius:"6px",fontSize:"0.85rem",fontWeight:500,color:"#4a6cf7"}}>Chip Label</div>
      <span style={{fontSize:"0.75rem",color:"#999"}}>Enabled</span>
    </div>
  );
}
