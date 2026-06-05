import React from "react";
import { Box, Typography } from "@mui/material";

export default function StatusOverview() {
  return (
    <Box sx={{background:"white",borderRadius:"8px",padding:"1.25rem",boxShadow:"0 1px 3px rgba(0,0,0,0.08)",borderTop:"3px solid hsl(120,50%,40%)"}}>
      <Typography variant="overline" sx={{display:"block",fontSize:"0.85rem",letterSpacing:"0.05em",color:"#888",fontWeight:600,mb:0.75}}>Status</Typography>
      <Typography variant="h5" sx={{fontSize:"1.5rem",fontWeight:700,color:"hsl(120,50%,40%)"}}>Online</Typography>
      <Typography variant="body2" sx={{fontSize:"0.8rem",color:"#999",mt:0.5}}>99.9%</Typography>
    </Box>
  );
}
