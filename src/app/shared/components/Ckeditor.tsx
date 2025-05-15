/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/#installation/NoJgNARCB0Cs0AYKQIwICwgBxYOy9gQDYUBmEAThQpuyJFNhthS1NKI9yPQS2QgBTAHbIEYYCjDjxUqQgC6kLCyIBDAEawICoA==
 */

import React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';

import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';
import { HeadingOption } from '@ckeditor/ckeditor5-heading';

const LICENSE_KEY =
  'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDgzMDM5OTksImp0aSI6IjI4YmEyZmMwLTUwNjctNGJlZi05NzM0LTE2Njk3Zjc3MTc1YSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjgzOTExODMyIn0.--XLR0j-7KbSk_tHi2d0y38JFM99-B_dfamx_J7-zBEDG65k-NfERXti08ImCNnoTyf1XgC3p1gGWkz8hPSvtw';

type CkeditorProps = {
  onChange?: (data: string) => void;
};

export default function Ckeditor({ onChange }: CkeditorProps) {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const cloud = useCKEditorCloud({ version: '45.0.0' });

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const { ClassicEditor, editorConfig } = useMemo(() => {
    if (cloud.status !== 'success' || !isLayoutReady) return {};

    const {
      ClassicEditor,
      // All required plugins
      Alignment,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BlockQuote,
      Bold,
      Bookmark,
      CloudServices,
      Code,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      GeneralHtmlSupport,
      Heading,
      Highlight,
      HorizontalLine,
      Image,
      ImageBlock,
      ImageCaption,
      ImageEditing,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      ImageUtils,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      PageBreak,
      Paragraph,
      RemoveFormat,
      ShowBlocks,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Style,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
    } = cloud.CKEditor;

    return {
      ClassicEditor,
      editorConfig: {
        toolbar: {
          items: [
            'showBlocks',
            '|',
            'heading',
            'style',
            '|',
            'fontSize',
            'fontFamily',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'bold',
            'italic',
            'underline',
            '|',
            'link',
            'insertImage',
            'insertTable',
            'highlight',
            'blockQuote',
            '|',
            'alignment',
            '|',
            'bulletedList',
            'numberedList',
            'todoList',
            'outdent',
            'indent',
            '|',
            'undo',
            'redo',
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          Alignment,
          Autoformat,
          AutoImage,
          AutoLink,
          Autosave,
          BlockQuote,
          Bold,
          Bookmark,
          CloudServices,
          Code,
          Essentials,
          FindAndReplace,
          FontBackgroundColor,
          FontColor,
          FontFamily,
          FontSize,
          GeneralHtmlSupport,
          Heading,
          Highlight,
          HorizontalLine,
          Image,
          ImageBlock,
          ImageCaption,
          ImageEditing,
          ImageInline,
          ImageInsert,
          ImageInsertViaUrl,
          ImageResize,
          ImageStyle,
          ImageTextAlternative,
          ImageToolbar,
          ImageUpload,
          ImageUtils,
          Indent,
          IndentBlock,
          Italic,
          Link,
          LinkImage,
          List,
          ListProperties,
          PageBreak,
          Paragraph,
          RemoveFormat,
          ShowBlocks,
          SpecialCharacters,
          SpecialCharactersArrows,
          SpecialCharactersCurrency,
          SpecialCharactersEssentials,
          SpecialCharactersLatin,
          SpecialCharactersMathematical,
          SpecialCharactersText,
          Strikethrough,
          Style,
          Subscript,
          Superscript,
          Table,
          TableCaption,
          TableCellProperties,
          TableColumnResize,
          TableProperties,
          TableToolbar,
          TextTransformation,
          TodoList,
          Underline,
        ],
        image: {
          toolbar: [
            'toggleImageCaption',
            'imageTextAlternative',
            '|',
            'imageStyle:inline',
            'imageStyle:wrapText',
            'imageStyle:breakText',
            '|',
            'resizeImage',
          ],
        },
        style: {
          definitions: [
            {
              name: 'Article category',
              element: 'h3',
              classes: ['category'],
            },
            {
              name: 'Title',
              element: 'h2',
              classes: ['document-title'],
            },
            {
              name: 'Subtitle',
              element: 'h3',
              classes: ['document-subtitle'],
            },
            {
              name: 'Info box',
              element: 'p',
              classes: ['info-box'],
            },
            {
              name: 'CTA Link Primary',
              element: 'a',
              classes: ['button', 'button--green'],
            },
            {
              name: 'CTA Link Secondary',
              element: 'a',
              classes: ['button', 'button--black'],
            },
            {
              name: 'Marker',
              element: 'span',
              classes: ['marker'],
            },
            {
              name: 'Spoiler',
              element: 'span',
              classes: ['spoiler'],
            },
          ],
        },
        licenseKey: LICENSE_KEY,
        fontSize: {
          options: [10, 12, 14, 'default', 18, 20, 22],
        },
        fontFamily: {
          supportAllValues: true,
        },
        heading: {
          options: [
            {
              model: 'paragraph',
              title: 'Paragraph',
              class: 'ck-heading_paragraph',
            },
            {
              model: 'heading1',
              view: 'h1',
              title: 'Heading 1',
              class: 'ck-heading_heading1',
            },
            {
              model: 'heading2',
              view: 'h2',
              title: 'Heading 2',
              class: 'ck-heading_heading2',
            },
            {
              model: 'heading3',
              view: 'h3',
              title: 'Heading 3',
              class: 'ck-heading_heading3',
            },
            {
              model: 'heading4',
              view: 'h4',
              title: 'Heading 4',
              class: 'ck-heading_heading4',
            },
          ] as HeadingOption[],
        },
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: 'https://',
        },
        table: {
          contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableProperties',
            'tableCellProperties',
          ],
        },
        initialData: '<p>Upload cover photo here.</p>\n<p>Share with us!</p>',
        extraPlugins: [
          function CustomUploadAdapterPlugin(editor: any) {
            editor.plugins.get('FileRepository').createUploadAdapter = (
              loader: any
            ) => {
              return new S3UploadAdapter(loader);
            };
          },
        ],
      },
    };
  }, [cloud, isLayoutReady]);

  return (
    <div
      className="editor-container editor-container_classic-editor editor-container_include-style"
      ref={editorContainerRef}
    >
      <div className="editor-container__editor">
        <div ref={editorRef}>
          {ClassicEditor && editorConfig && (
            <CKEditor
              editor={ClassicEditor}
              config={editorConfig}
              onChange={(_, editor) => {
                const data = editor.getData();
                onChange?.(data);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// --------------------
// Custom Upload Adapter
// --------------------

class S3UploadAdapter {
  loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  async upload() {
    try {
      const file = await this.loader.file;
      const fileName = encodeURIComponent(file.name);
      const fileType = encodeURIComponent(file.type);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Access token not found in localStorage');
      }

      const response = await fetch(
        `https://simpcat.online/api/v1/signatures?type_upload=cover-post&file_name=${fileName}&file_type=${fileType}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error('Failed to get signed URL');
      }

      const { signedRequest: signedUrl, url: accessUrl } =
        await response.json();

      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        console.error('Upload to S3 failed:', errText);
        throw new Error('Upload to S3 failed');
      }

      return {
        default: accessUrl,
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  abort() {}
}
