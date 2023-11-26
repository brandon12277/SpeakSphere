import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import the styles

export default function RichTextEditor ({ editorContent, setEditorContent }){
    
  
    const handleEditorChange = (content, delta, source, editor) => {
      // content is the HTML content of the editor
      setEditorContent(content);
    };
  
    return (
        <div style={{height:"30vh",marginBottom:"1%"}}>
    <p>Description</p>
        
      <ReactQuill
       style={{ height: '150px', marginBottom: '20px' }}
        theme="snow" // you can choose different themes
        value={editorContent}
        onChange={handleEditorChange}
      />
      </div>
    );
  };
  
