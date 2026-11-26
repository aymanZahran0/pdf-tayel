import { useEffect,useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import PdfViewer from './components/PdfViewer';
import QrDialog from './components/QrDialog';
import UploadDialog from './components/UploadDialog';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import PublicPdfPage from './pages/PublicPdfPage';
import { useDocuments } from './hooks/useDocuments';

export default function App(){
  const [view,setView]=useState('library');
  const [loggedIn,setLoggedIn]=useState(false);
  const [uploadOpen,setUploadOpen]=useState(false);
  const [preview,setPreview]=useState(null);
  const [qrDocument,setQrDocument]=useState(null);
  const [message,setMessage]=useState('');
  const {documents,addDocument,deleteDocument}=useDocuments();
  useEffect(()=>{if(!message)return;const timer=setTimeout(()=>setMessage(''),2600);return()=>clearTimeout(timer)},[message]);
  const login=()=>{setLoggedIn(true);document.body.classList.add('admin-mode')};
  const logout=()=>{setLoggedIn(false);document.body.classList.remove('admin-mode');setMessage('تم تسجيل الخروج بنجاح')};
  const remove=doc=>{if(confirm('هل تريد حذف هذا المستند؟ لا يمكن التراجع عن هذا الإجراء.')){deleteDocument(doc.id);setMessage('تم حذف المستند')}};
  const openPreview=doc=>doc.url?setPreview(doc):setMessage('ارفع ملف PDF لمعاينته في النسخة التجريبية');
  const workspace=<><Header view={view} onChangeView={setView}/><main>{view==='library'?<LibraryPage documents={documents} onPreview={openPreview} onMessage={setMessage}/>:loggedIn?<AdminDashboard documents={documents} onLogout={logout} onUpload={()=>setUploadOpen(true)} onDelete={remove} onQr={setQrDocument}/>:<LoginPage onLogin={login}/>}</main><UploadDialog open={uploadOpen} onClose={()=>setUploadOpen(false)} onUpload={doc=>addDocument({...doc,publicId:doc.id})} onMessage={setMessage}/><PdfViewer document={preview} onClose={()=>setPreview(null)}/><QrDialog document={qrDocument} onClose={()=>setQrDocument(null)} onMessage={setMessage}/></>;
  return <><Routes><Route path="/pdf/:publicId" element={<PublicPdfPage documents={documents}/>}/><Route path="*" element={workspace}/></Routes><div id="toast" className={message?'show':''} role="status">{message}</div></>;
}
