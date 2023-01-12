// import React, { useState, useEffect } from 'react';
// import { EditorState } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
// import "./Draft.css";
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import { convertToHTML } from 'draft-convert';

// function MyEditor() {
//     const [editorState, setEditorState] = useState(
//         () => EditorState.createEmpty(),
//     );

//     const [convertedContent, setConvertedContent] = useState(null);

//     useEffect(() => {
//         let html = convertToHTML(editorState.getCurrentContent());
//         setConvertedContent(html);
//     }, [editorState]);

//     console.log(convertedContent);

//     return (

//         <Editor
//             editorState={editorState}
//             onEditorStateChange={setEditorState}
//             wrapperClassName="wrapper-class"
//             editorClassName="editor-class"
//             toolbarClassName="toolbar-class"
//         />

//     )
// }

// export default MyEditor;