import React from 'react';
import { useLocation } from 'react-router-dom';
import { safeParse } from '../lib/safeLocal';

export default function DevDebug() {
  const loc = useLocation();
  const user = safeParse('user', null);
  return (
    <div style={{position:'fixed',right:12,top:12,zIndex:9999,background:'#111827cc',color:'#fff',padding:'6px 10px',borderRadius:6,fontSize:12,boxShadow:'0 4px 20px rgba(2,6,23,0.6)'}}>
      <div><strong>path:</strong> {loc.pathname}</div>
      <div style={{marginTop:4}}><strong>user:</strong> {user ? JSON.stringify(user) : 'null'}</div>
    </div>
  );
}
