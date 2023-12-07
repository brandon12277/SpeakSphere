import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import the styles

export default function RichTextEditor ({ editorContent, setEditorContent }){
  const [editorHtml, setEditorHtml] = useState(editorContent || '');
  
    const handleEditorChange = (content, delta, source, editor) => {
      // content is the HTML content of the editor
      setEditorHtml(content)
      setEditorContent(content);
     
    };
    const wordCount = editorHtml
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .split(/\s+/)
    .filter(Boolean)
    .length;

  const isWordCountValid = wordCount >= 100;
    return (
        <div style={{height:"40vh",marginBottom:"2%"}}>
    <p>Description</p>
        
      <ReactQuill
       style={{ height: '50%', marginBottom: '20px' }}
        theme="snow" // you can choose different themes
        value={editorHtml}
        onChange={handleEditorChange}
      />
       <div>
        
        <br></br>
        <p>
          (Minimum word count 100)Word Count: {wordCount} {isWordCountValid ? '✅' : '❌'}
        </p>
      </div>
      
      </div>
    );
  };
  
