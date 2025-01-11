import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from 'tinymce';

type EditorProps = {
  content?: string,
  handleEditorChange: (data:string) => void,
}

export default function PostEditor({content, handleEditorChange}: EditorProps) {
	
	const editorRef = useRef<TinyMCEEditor | null>(null);

	return (
		<Editor
        apiKey={import.meta.env.VITE_TINYMCE_KEY}
        onInit={(_evt, editor) => editorRef.current = editor}
        initialValue={content}
        init={{
          height: 250,
          menubar: false,
          plugins: [
            "image", "advlist", "autolink", "lists", "link", "charmap",
            "preview", "anchor", "searchreplace", "visualblocks", "code",
            "fullscreen", "insertdatetime", "media", "table", "help",
            "wordcount", "codesample", "emoticons", "autosave", 
          ],
          toolbar:
            "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | codesample emoticons fullscreen",
          content_style: `
            body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; }
            img { max-width: 100%; height: auto; }
          `,
        }}
        onEditorChange={(_, editor) => handleEditorChange(editor.getContent())}
      />
	)
}
