import React from "react";

export default function DataTableSection() {
  return (
    <div style={{background:"white",borderRadius:"8px",padding:"1.25rem",boxShadow:"0 1px 3px rgba(0,0,0,0.08)",borderTop:"3px solid hsl(210,60%,48%)"}}>
      <h3 style={{margin:"0 0 0.75rem",fontSize:"0.85rem",textTransform:"uppercase",letterSpacing:"0.05em",color:"#888",fontWeight:600}}>Data Table</h3>
      <div style={{fontSize:"1.5rem",fontWeight:700,color:"hsl(210,60%,48%)"}}>2,451</div>
      <div style={{fontSize:"0.8rem",color:"#999",marginTop:"0.5rem"}}>rows</div>
    </div>
  );
}
