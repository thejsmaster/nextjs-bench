import React from "react";
import { Box, Button, Typography, Card, CardContent, Badge, Chip, CircularProgress, Switch, LinearProgress, Skeleton } from "@mui/material";

export default function UISkeleton() {
  return (
    <Box sx={{display:"flex",alignItems:"center",gap:1.5,padding:"0.75rem 1rem",background:"white",borderRadius:"8px",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
      <Typography variant="body2" sx={{fontSize:"0.85rem",color:"#666",fontWeight:500,minWidth:100}}>Skeleton</Typography>
      <Box sx={{padding:"0.35rem 0.75rem",background:"#f0f4ff",borderRadius:"6px",fontSize:"0.85rem",fontWeight:500,color:"#4a6cf7"}}>Icon</Box>
      <Typography variant="caption" sx={{fontSize:"0.75rem",color:"#999",ml:"auto"}}>Active</Typography>
    </Box>
  );
}
