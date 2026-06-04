import React from "react";

export default function StatusOverview() {
  return (
    <div style={{background:"white",borderRadius:"8px",padding:"1.25rem",boxShadow:"0 1px 3px rgba(0,0,0,0.08)",borderTop:"3px solid hsl(120,50%,40%)"}}>
      <h3 style={{margin:"0 0 0.75rem",fontSize:"0.85rem",textTransform:"uppercase",letterSpacing:"0.05em",color:"#888",fontWeight:600}}>Status</h3>
      <div style={{fontSize:"1.5rem",fontWeight:700,color:"hsl(120,50%,40%)"}}>Online</div>
      <div style={{fontSize:"0.8rem",color:"#999",marginTop:"0.5rem"}}>99.9%</div>
    </div>
  );
}
