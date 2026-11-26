import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const toDocument = row => ({ id:row.id, publicId:row.public_id, title:row.title, size:Number(row.file_size), date:new Date(row.created_at).toLocaleDateString('ar-EG',{year:'numeric',month:'long',day:'numeric'}), createdAt:row.created_at, url:row.file_url, filePath:row.file_path });

export function useDocuments() {
  const [documents,setDocuments]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const loadDocuments=useCallback(async()=>{setLoading(true);const{data,error:requestError}=await supabase.from('documents').select('*').eq('is_active',true).order('created_at',{ascending:false});if(requestError)setError(requestError.message);else{setDocuments((data||[]).map(toDocument));setError('')}setLoading(false)},[]);
  useEffect(()=>{loadDocuments()},[loadDocuments]);
  const addDocument=async({title,file})=>{const publicId=crypto.randomUUID();const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,'-');const filePath=`${publicId}/${safeName}`;const{error:uploadError}=await supabase.storage.from('pdfs').upload(filePath,file,{contentType:'application/pdf'});if(uploadError)throw uploadError;const{data:publicData}=supabase.storage.from('pdfs').getPublicUrl(filePath);const{data,error:insertError}=await supabase.from('documents').insert({public_id:publicId,title,file_path:filePath,file_url:publicData.publicUrl,file_size:file.size}).select().single();if(insertError){await supabase.storage.from('pdfs').remove([filePath]);throw insertError}const document=toDocument(data);setDocuments(items=>[document,...items]);return document};
  const deleteDocument=async document=>{const{error:databaseError}=await supabase.from('documents').delete().eq('id',document.id);if(databaseError)throw databaseError;await supabase.storage.from('pdfs').remove([document.filePath]);setDocuments(items=>items.filter(item=>item.id!==document.id))};
  return {documents,loading,error,addDocument,deleteDocument,reload:loadDocuments};
}
